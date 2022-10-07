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
import { ConflictException, ForbiddenException, NotFoundException } from '@exceptions/common.exceptions';
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
                debitTransactions: true,
                creditTransactions: true
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
            where: {
                accountHolder: { id: userID }
            },
            select: {
                accountName: true,
                accountNumber: true,
                accountBalance: true,
                createdAt: true
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

        // Search for account and add transaction amout to account balance
        const creditAccount = await this.accountRepo.findOne({
            where: {
                accountNumber,
                accountName
            }
        });

        if (creditAccount) {

            // Credit the Respective Account
            creditAccount.accountBalance = +creditAccount.accountBalance + transactionAmount;

            // Prepare and create transaction record
            const newCreditTransaction = new Transaction();

            await newCreditTransaction.generateDepositTransaction(creditAccount, transactionAmount, transactionParty)

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(creditAccount)
                await transactionalEntityManager.save(newCreditTransaction)
            });

            const transactionSummary = {
                accountBalance: creditAccount.accountBalance,
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
        const debitAccount = await this.accountRepo.findOne({
            where: {
                accountNumber,
                accountHolder: {
                    id: userID
                }
            }
        });

        if (debitAccount) {

            if (debitAccount.accountBalance < transactionAmount) {
                throw new ForbiddenException(`Unable to process transaction, Insufficient funds`)
            }

            // Deduct the transaction amount from the debit account
            debitAccount.accountBalance = +debitAccount.accountBalance - transactionAmount;

            // Prepare and create transaction record
            const newDebitTransaction = new Transaction();

            await newDebitTransaction.generateWithdrawalTransaction(debitAccount, transactionAmount, transactionParty)

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(debitAccount)
                await transactionalEntityManager.save(newDebitTransaction)
            });

            const transactionSummary = {
                accountBalance: debitAccount.accountBalance,
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

            await newDebitTransaction.generateFundsTransferTransaction(debitAccount, creditAccount, transferAmount, true)
            await newCreditTransaction.generateFundsTransferTransaction(debitAccount, creditAccount, transferAmount, false)

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