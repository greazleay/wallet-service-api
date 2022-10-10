import { accountRepository, entityManager } from '@/data-source';
import { Transaction } from '@entities/transaction.entity';
import {
    DepositFundsDto,
    OpenAccountDto,
    TransferFundsDto,
    WithdrawFundsDto
} from '@dtos/account.dto';
import { Account } from '@entities/account.entity';
import { User } from '@entities/user.entity';
import {
    ConflictException,
    ForbiddenException,
    NotFoundException
} from '@exceptions/common.exceptions';
import { SuccessResponse } from '@helpers/successResponse';


export class AccountService {


    private readonly accountRepo: typeof accountRepository = accountRepository;

    public async findAll(): Promise<SuccessResponse> {

        const allAccounts = await this.accountRepo.find({
            select: {
                accountNumber: true,
                accountName: true,
                accountBalance: true,
                createdAt: true
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (allAccounts.length) {

            return new SuccessResponse(200, 'All Accounts', allAccounts);

        } else {

            throw new NotFoundException('No Accounts on the Server');

        }
    };

    public async findOneById(id: string): Promise<SuccessResponse> {

        const account = await this.accountRepo.findOneBy({ id });

        if (account) {

            return new SuccessResponse(200, 'Account Details', account);

        } else {

            throw new NotFoundException(`Account with ID: ${id} not found on this server`)
        }

    }

    public async findOneByAccountNumber(accountNumber: number, userID: string): Promise<SuccessResponse> {

        const account = await this.accountRepo.findOne({
            relations: {
                transactions: true
            },
            where: {
                accountNumber,
                accountHolder: {
                    id: userID
                }
            },
        });

        if (account) {

            return new SuccessResponse(200, 'Account Details', account);

        } else {

            throw new ForbiddenException(`Invalid Account Number`)
        }

    }

    public async findByUser(userID: string) {

        const userAccounts = await this.accountRepo.find({
            select: {
                accountName: true,
                accountNumber: true,
                accountBalance: true,
                createdAt: true
            },
            where: {
                accountHolder: { id: userID }
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (userAccounts.length) {

            return new SuccessResponse(200, 'All Accounts for User', userAccounts)

        } else {

            throw new NotFoundException('User has not opened any accounts')
        }
    };

    public async openNewAccount(openAccountDto: OpenAccountDto, user: User) {

        const { accountName } = openAccountDto;

        // Check if the user has an existing account with the same account name
        const accountNameExists = (await this.accountRepo.find({
            select: {
                accountName: true,
            },
            where: {
                accountHolder: { id: user.id }
            },
        })).some(account => account.accountName === accountName);

        if (accountNameExists) throw new ConflictException(`User has an existing account with name ${accountName}`)

        const allAccountNumbers = (await this.accountRepo.find({
            select: {
                accountNumber: true,
            }
        })).map(account => account.accountNumber);

        const newAccount = new Account();

        newAccount.accountName = accountName;
        newAccount.accountNumber = await newAccount.generateAccountNumber(allAccountNumbers);
        newAccount.accountHolder = user

        await this.accountRepo.save(newAccount);

        return new SuccessResponse(201, 'Account Created Successfully', newAccount);
    }

    public async checkAccountBalance(accountNumber: number, userID: string) {

        const account = await this.accountRepo
            .createQueryBuilder('account')
            .leftJoinAndSelect('account.accountHolder', 'accountHolder')
            .where('account.accountNumber = :accountNumber', { accountNumber })
            .andWhere('accountHolder.id = :userID', { userID })
            .select(['account.accountBalance'])
            .getOne();

        if (account) {

            return new SuccessResponse(200, `Balance on account ${accountNumber}`, account.accountBalance)

        } else {

            throw new ForbiddenException(`Invalid Account Number`);
        }
    };

    async depositFunds(despositFundsDto: DepositFundsDto) {

        const { accountNumber, accountName, transactionAmount, transactionParty } = despositFundsDto;

        // Search for account and validate account name/number
        const account = await this.accountRepo.findOne({
            where: {
                accountNumber,
                accountName
            }
        });

        if (account) {

            // Credit the Respective Account
            account.accountBalance = +account.accountBalance + transactionAmount;

            // Prepare and create transaction record
            const newCreditTransaction = new Transaction();

            await newCreditTransaction.generateDepositOrWithdrawalTransaction({
                account,
                transactionAmount,
                transactionParty,
                isDebit: false
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(account)
                await transactionalEntityManager.save(newCreditTransaction)
            });

            const transactionSummary = {
                accountBalance: account.accountBalance,
                reference: newCreditTransaction.transactionRef
            }

            return new SuccessResponse(200, 'Deposit Successful', transactionSummary);

        } else {

            throw new ConflictException(`Invalid Account name/number combinations`);
        }
    }

    async withdrawFunds(withdrawFundsDto: WithdrawFundsDto, userID: string) {

        const { accountNumber, transactionAmount, transactionParty } = withdrawFundsDto;

        // Check if the account exists and the account belongs to the user making the withdrawal
        const account = await this.accountRepo.findOne({
            where: {
                accountNumber,
                accountHolder: {
                    id: userID
                }
            }
        });

        if (account) {

            if (account.accountBalance < transactionAmount) {
                throw new ForbiddenException(`Unable to process transaction, Insufficient funds`)
            }

            // Deduct the transaction amount from the debit account
            account.accountBalance = +account.accountBalance - transactionAmount;

            // Prepare and create transaction record
            const newDebitTransaction = new Transaction();

            await newDebitTransaction.generateDepositOrWithdrawalTransaction({
                account,
                transactionAmount,
                transactionParty,
                isDebit: true
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(account)
                await transactionalEntityManager.save(newDebitTransaction)
            });

            const transactionSummary = {
                accountBalance: account.accountBalance,
                reference: newDebitTransaction.transactionRef
            }

            return new SuccessResponse(200, 'Withdrawal Successful', transactionSummary);

        } else {

            throw new ConflictException(`Invalid Account name/number combinations`);
        }
    };

    async transferFunds(transferFundsDto: TransferFundsDto, userID: string) {

        const { creditAccountName, creditAccountNumber, debitAccountNumber, transferAmount } = transferFundsDto;

        // Search for Both Accounts
        const debitAccount = await this.accountRepo.findOne({
            where: {
                accountNumber: debitAccountNumber,
                accountHolder: {
                    id: userID
                }
            }
        });

        const creditAccount = await this.accountRepo.findOne({
            where: {
                accountNumber: creditAccountNumber,
                accountName: creditAccountName
            }
        });

        // If Both Accounts Exist
        if (creditAccount && debitAccount) {

            if (debitAccount.accountBalance < transferAmount) {
                throw new ForbiddenException(`Unable to process transaction, Insufficient funds`)
            };

            if (creditAccount.accountNumber === debitAccount.accountNumber) {
                throw new ForbiddenException('You cannot make transfers between the same account')
            };

            // Debit and Credit Respective Accounts
            debitAccount.accountBalance = +debitAccount.accountBalance - transferAmount;
            creditAccount.accountBalance = +creditAccount.accountBalance + transferAmount;

            // Generate Credit and Debit Transaction for both Accounts
            const newDebitTransaction = new Transaction();
            const newCreditTransaction = new Transaction();

            await newDebitTransaction.generateFundsTransferTransaction({
                debitAccount,
                creditAccount,
                transferAmount,
                isDebit: true
            });

            await newCreditTransaction.generateFundsTransferTransaction({
                debitAccount,
                creditAccount,
                transferAmount,
                isDebit: false
            });

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(debitAccount);
                await transactionalEntityManager.save(creditAccount);
                await transactionalEntityManager.save(newDebitTransaction);
                await transactionalEntityManager.save(newCreditTransaction);
            });

            const transactionSummary = {
                accountBalance: debitAccount.accountBalance,
                reference: newDebitTransaction.transactionRef
            }

            return new SuccessResponse(200, 'Funds Transfer Successful', transactionSummary);

        } else {

            throw new ConflictException(`Invalid Account name/number combinations`);

        }

    }
}