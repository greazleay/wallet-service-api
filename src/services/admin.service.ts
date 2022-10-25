import { userRepository, transactionRepository, walletRepository } from '@/data-source';
import { Transaction } from '@entities/transaction.entity';
import { User } from '@entities/user.entity';
import { Wallet } from '@entities/wallet.entity';
import { NotFoundException } from '@exceptions/common.exceptions';


export class AdminService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;
    private readonly userRepo: typeof userRepository = userRepository;
    private readonly walletRepo: typeof walletRepository = walletRepository;

    public async findAllTransactions(): Promise<Transaction[]> {

        const allTransactions = await this.transactionRepo.find({
            order: {
                createdAt: 'DESC'
            }
        });

        if (allTransactions.length) {

            return allTransactions;

        } else {

            throw new NotFoundException('No Transactions on the Server');

        }
    };

    public async findTransactionById(id: string): Promise<Transaction> {

        const transaction = await this.transactionRepo.findOne({
            relations: {
                wallet: true,
            },
            where: { id }
        });

        if (transaction) {

            return transaction;

        } else {

            throw new NotFoundException(`Transaction with ID: ${id} not found on this server`)
        }
    };

    public async findAllUsers(): Promise<User[]> {

        const allUsers = await this.userRepo.find({
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true
            },
            order: {
                createdAt: 'DESC'
            }
        })

        return allUsers;
    }

    public async findUserById(id: string): Promise<User> {

        const user = await this.userRepo.findOne({
            relations: {
                wallets: true,
            },
            where: { id }
        });

        if (user) {

            return user;

        } else {

            throw new NotFoundException(`User with ID: ${id} not found on this Server`)
        }
    };

    public async findAllWallets(): Promise<Wallet[]> {

        const allWallets = await this.walletRepo.find({
            select: {
                walletNumber: true,
                walletName: true,
                walletBalance: true,
                createdAt: true
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (allWallets.length) {

            return allWallets;

        } else {

            throw new NotFoundException('No Wallets on the Server');

        }
    };

    public async findWalletById(id: string): Promise<Wallet> {

        const wallet = await this.walletRepo.findOne({
            relations: {
                transactions: true,
                walletHolder: true
            },
            where: { id }
        });

        if (wallet) {

            return wallet;

        } else {

            throw new NotFoundException(`Wallet with ID: ${id} not found on this server`)
        }

    }
}