import { walletRepository, entityManager } from '@/data-source';
import { Transaction } from '@entities/transaction.entity';
import {
    DepositFundsDto,
    CreateWalletDto,
    TransferFundsDto,
    WithdrawFundsDto
} from '@/dtos/wallet.dto';
import { Wallet } from '@/entities/wallet.entity';
import { User } from '@entities/user.entity';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException
} from '@exceptions/common.exceptions';


export class WalletService {

    private readonly walletRepo: typeof walletRepository = walletRepository;

    public async createNewWallet(createWalletDto: CreateWalletDto, user: User) {

        const { walletName } = createWalletDto;

        // Check if the user has an existing wallet with the same wallet name
        const walletNameExists = (await this.walletRepo.find({
            select: {
                walletName: true,
            },
            where: {
                walletHolder: { id: user.id }
            },
        })).some(wallet => wallet.walletName === walletName);

        if (walletNameExists) throw new ConflictException(`User has an existing wallet with name ${walletName}`)

        const allWalletNumbers = (await this.walletRepo.find({
            select: {
                walletNumber: true,
            }
        })).map(wallet => wallet.walletNumber);

        const newWallet = new Wallet();

        newWallet.walletName = walletName;
        newWallet.walletNumber = await newWallet.generateWalletNumber(allWalletNumbers);
        newWallet.walletHolder = user

        await this.walletRepo.save(newWallet);

        return newWallet;
    }

    public async findOneByWalletNumber(walletNumber: number, userID: string): Promise<Wallet> {

        const wallet = await this.walletRepo.findOne({
            relations: {
                transactions: true
            },
            where: {
                walletNumber,
                walletHolder: {
                    id: userID
                }
            },
        });

        if (wallet) {

            return wallet;

        } else {

            throw new ForbiddenException(`Invalid Wallet Number`)
        }

    }

    public async findByUser(userID: string): Promise<Wallet[]> {

        const userWallets = await this.walletRepo.find({
            select: {
                walletName: true,
                walletNumber: true,
                walletBalance: true,
                createdAt: true
            },
            where: {
                walletHolder: { id: userID }
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (userWallets.length) {

            return userWallets

        } else {

            throw new NotFoundException('User has not opened any Wallets')
        }
    };

    public async checkWalletBalance(walletNumber: number, userID: string): Promise<number> {

        const wallet = await this.walletRepo
            .createQueryBuilder('wallet')
            .leftJoinAndSelect('wallet.walletHolder', 'walletHolder')
            .where('wallet.walletNumber = :walletNumber', { walletNumber })
            .andWhere('walletHolder.id = :userID', { userID })
            .select(['wallet.walletBalance'])
            .getOne();

        if (wallet) {

            return wallet.walletBalance

        } else {

            throw new ForbiddenException(`Invalid Wallet Number`);
        }
    };

    async depositFunds(despositFundsDto: DepositFundsDto) {

        const { walletNumber, walletName, transactionAmount, transactionParty } = despositFundsDto;

        // Search for wallet and validate wallet name/number
        const wallet = await this.walletRepo.findOne({
            where: {
                walletNumber,
                walletName
            }
        });

        if (wallet) {

            // Credit the Respective Wallet
            wallet.walletBalance = +wallet.walletBalance + transactionAmount;

            // Prepare and create transaction record
            const newCreditTransaction = new Transaction();

            await newCreditTransaction.generateDepositOrWithdrawalTransaction({
                wallet,
                transactionAmount,
                transactionParty,
                isDebit: false
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(wallet)
                await transactionalEntityManager.save(newCreditTransaction)
            });

            const transactionSummary = {
                walletBalance: wallet.walletBalance,
                reference: newCreditTransaction.transactionRef
            }

            return transactionSummary

        } else {

            throw new ConflictException(`Invalid Wallet name/number combinations`);
        }
    }

    async withdrawFunds(withdrawFundsDto: WithdrawFundsDto, userID: string) {

        const { walletNumber, transactionAmount, transactionParty } = withdrawFundsDto;

        // Check if the wallet exists and the wallet belongs to the user making the withdrawal
        const wallet = await this.walletRepo.findOne({
            where: {
                walletNumber,
                walletHolder: {
                    id: userID
                }
            }
        });

        if (wallet) {

            if (wallet.walletBalance < transactionAmount) {
                throw new ForbiddenException(`Unable to process transaction, Insufficient funds`)
            }

            // Deduct the transaction amount from the debit wallet
            wallet.walletBalance = +wallet.walletBalance - transactionAmount;

            // Prepare and create transaction record
            const newDebitTransaction = new Transaction();

            await newDebitTransaction.generateDepositOrWithdrawalTransaction({
                wallet,
                transactionAmount,
                transactionParty,
                isDebit: true
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(wallet)
                await transactionalEntityManager.save(newDebitTransaction)
            });

            const transactionSummary = {
                walletBalance: wallet.walletBalance,
                reference: newDebitTransaction.transactionRef
            }

            return transactionSummary;

        } else {

            throw new ConflictException(`Invalid Wallet name/number combinations`);
        }
    };

    async transferFunds(transferFundsDto: TransferFundsDto, userID: string) {

        const { creditWalletName, creditWalletNumber, debitWalletNumber, transferAmount } = transferFundsDto;

        // Search for Both Wallets
        const debitWallet = await this.walletRepo.findOne({
            where: {
                walletNumber: debitWalletNumber,
                walletHolder: {
                    id: userID
                }
            }
        });

        const creditWallet = await this.walletRepo.findOne({
            where: {
                walletNumber: creditWalletNumber,
                walletName: creditWalletName
            }
        });

        // If Both Wallets Exist
        if (creditWallet && debitWallet) {

            if (debitWallet.walletBalance < transferAmount) {
                throw new ForbiddenException(`Unable to process transaction, Insufficient funds`)
            };

            if (creditWallet.walletNumber === debitWallet.walletNumber) {
                throw new ForbiddenException('You cannot make transfers between the same wallet')
            };

            // Debit and Credit Respective Wallets
            debitWallet.walletBalance = +debitWallet.walletBalance - transferAmount;
            creditWallet.walletBalance = +creditWallet.walletBalance + transferAmount;

            // Generate Credit and Debit Transaction for both Wallets
            const newDebitTransaction = new Transaction();
            const newCreditTransaction = new Transaction();

            await newDebitTransaction.generateFundsTransferTransaction({
                debitWallet,
                creditWallet,
                transferAmount,
                isDebit: true
            });

            await newCreditTransaction.generateFundsTransferTransaction({
                debitWallet,
                creditWallet,
                transferAmount,
                isDebit: false
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(debitWallet);
                await transactionalEntityManager.save(creditWallet);
                await transactionalEntityManager.save(newDebitTransaction);
                await transactionalEntityManager.save(newCreditTransaction);
            });

            const transactionSummary = {
                walletBalance: debitWallet.walletBalance,
                reference: newDebitTransaction.transactionRef
            }

            return transactionSummary;

        } else {

            throw new ConflictException(`Invalid Wallet name/number combinations`);

        }

    }
}