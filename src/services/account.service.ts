import { accountRepository } from "@/data-source";
import { OpenAccountDto } from "@dtos/account.dto";
import { Account } from "@entities/account.entity";
import { User } from "@entities/user.entity";
import { NotFoundException } from "@exceptions/common.exceptions";
import { SuccessResponse } from "@helpers/successResponse";


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

        const account = await this.accountRepo.findOneBy({ accountNumber });

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

        return new SuccessResponse(201, 'Account Created Successfully', newAccount)
    }
}