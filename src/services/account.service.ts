import { accountRepository, entityManager } from '@/data-source';
import { Transaction } from '@entities/transaction.entity';
import { DepositOrWithdrawFundsDto, OpenAccountDto } from '@dtos/account.dto';
import { Account } from '@entities/account.entity';
import { User } from '@entities/user.entity';
import { ConflictException, ForbiddenException, NotFoundException } from '@exceptions/common.exceptions';
import { SuccessResponse } from '@helpers/successResponse';


export class AccountService {


    private readonly accountRepo: typeof accountRepository = accountRepository;

    public async findAll(): Promise<SuccessResponse> {

        const allAccounts = await this.accountRepo.find({
            select: {
                accountName: true,
                accountNumber: true,
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

    public async findOneByAccountNumber(accountNumber: number): Promise<SuccessResponse> {

        const account = await this.accountRepo.findOne({
            where: { accountNumber },
            relations: {
                debitTransactions: true,
                creditTransactions: true
            }
        },);

        if (account) {

            return new SuccessResponse(200, 'Account Details', account);

        } else {

            throw new NotFoundException(`Account with Account Number: ${accountNumber} not found on this server`)
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

        const { accountName, openingBalance } = openAccountDto;

        const allAccounts = (await this.accountRepo.find()).map(account => account.accountNumber);

        const newAccount = new Account();

        newAccount.accountName = accountName;
        newAccount.accountNumber = await newAccount.generateAccountNumber(allAccounts);
        newAccount.accountBalance = openingBalance;
        newAccount.accountHolder = user

        await this.accountRepo.save(newAccount);

        return new SuccessResponse(201, 'Account Created Successfully', newAccount);
    }

    public async checkAccountBalance(accountNumber: number, userId: string) {

        const account = await this.accountRepo.findOne({
            where: {
                accountNumber,
                accountHolder: {
                    id: userId
                }
            }
        });

        if (account) {

            return new SuccessResponse(200, `Balance on account ${accountNumber}`, account.accountBalance)

        } else {

            throw new ForbiddenException(`Invalid user/account number combination`);
        }
    };

    async depositFunds(transactionInfo: DepositOrWithdrawFundsDto) {

        const { accountNumber, accountName, transactionAmount, transactionParty } = transactionInfo;

        // Search for account and add transaction amout to account balance
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
            const newTransaction = new Transaction();

            await newTransaction.generateDepositTransaction(account, transactionAmount, transactionParty)

            await entityManager.transaction(async transactionalEntityManager => {
                await transactionalEntityManager.save(account)
                await transactionalEntityManager.save(newTransaction)
            });

            return new SuccessResponse(200, 'Deposit Successful', { reference: newTransaction.transactionRef });

        } else {

            throw new ConflictException(`Invalid Account name/number combinations`);
        }
    }
}