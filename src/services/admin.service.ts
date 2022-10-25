import { userRepository, transactionRepository, walletRepository } from '@/data-source';
import { Transaction } from '@entities/transaction.entity';
import { NotFoundException } from '@exceptions/common.exceptions';
import { getCacheKey, setCacheKey } from '@config/cache';


export class AdminService {

    private readonly transactionRepo: typeof transactionRepository = transactionRepository;
    private readonly userRepo: typeof userRepository = userRepository;
    private readonly walletRepo: typeof walletRepository = walletRepository;

    public async findAllTransactions() {

        const value = await getCacheKey('all_transactions');

        if (value) return { fromCache: true, allTransactions: JSON.parse(value) }

        const allTransactions = await this.transactionRepo.find({
            order: {
                createdAt: 'DESC'
            }
        });

        if (allTransactions.length) {

            await setCacheKey('all_transactions', allTransactions);

            return { fromCache: false, allTransactions };

        } else {

            throw new NotFoundException('No Transactions on the Server');

        }

    };

    public async findTransactionById(id: string) {

        const value = await getCacheKey(`admin/transactions/${id}`);

        if (value) return { fromCache: true, user: JSON.parse(value) };

        const transaction = await this.transactionRepo.findOne({
            relations: {
                wallet: true,
            },
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                transactionAmount: true,
                transactionMode: true,
                transactionRef: true,
                transactionStatus: true,
                transactionType: true,
                walletBalance: true,
                wallet: {
                    id: true,
                    walletName: true,
                    walletNumber: true,
                }
            },
            where: { id }
        });

        if (transaction) {

            await setCacheKey(`admin/transactions/${id}`, transaction);

            return { fromCache: false, transaction };

        } else {

            throw new NotFoundException(`Transaction with ID: ${id} not found on this server`)
        }
    };

    public async findAllUsers() {

        const value = await getCacheKey('all_users');

        if (value) return { fromCache: true, allUsers: JSON.parse(value) }

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

        if (allUsers.length) {

            await setCacheKey('all_users', allUsers);

            return { fromCache: false, allUsers };

        } else {

            throw new NotFoundException('No Users on the Server');

        }
    }

    public async findUserById(id: string) {

        const value = await getCacheKey(`admin/users/${id}`);

        if (value) return { fromCache: true, user: JSON.parse(value) };

        const user = await this.userRepo.findOne({
            relations: {
                wallets: true,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                lastLogin: true,
                roles: true,
                createdAt: true,
                updatedAt: true,
                wallets: {
                    id: true,
                    createdAt: true,
                    walletName: true,
                    walletNumber: true,
                    walletBalance: true
                }
            },
            where: { id }
        });

        if (user) {

            await setCacheKey(`admin/users/${id}`, user);

            return { fromCache: false, user };

        } else {

            throw new NotFoundException(`User with ID: ${id} not found on this Server`)
        }
    };

    public async findAllWallets() {

        const value = await getCacheKey('all_wallets');

        if (value) return { fromCache: true, allWallets: JSON.parse(value) }

        const allWallets = await this.walletRepo.find({
            select: {
                id: true,
                walletNumber: true,
                walletName: true,
                walletBalance: true,
                createdAt: true,
                updatedAt: true
            },
            order: {
                createdAt: 'DESC'
            }
        });

        if (allWallets.length) {

            await setCacheKey('all_wallets', allWallets);

            return { fromCache: false, allWallets };

        } else {

            throw new NotFoundException('No Wallets on the Server');

        }

    };

    public async findWalletById(id: string) {

        const value = await getCacheKey(`admin/wallets/${id}`);

        if (value) return { fromCache: true, wallet: JSON.parse(value) };

        const wallet = await this.walletRepo.findOne({
            relations: {
                transactions: true,
                walletHolder: true
            },
            select: {
                id: true,
                walletName: true,
                walletNumber: true,
                walletBalance: true,
                createdAt: true,
                updatedAt: true,
                walletHolder: {
                    id: true,
                    email: true,
                    fullName: true
                },
                transactions: {
                    id: true,
                    createdAt: true,
                    transactionAmount: true,
                    transactionRef: true,
                    transactionMode: true,
                    transactionType: true
                }
            },
            where: { id }
        });

        if (wallet) {

            await setCacheKey(`admin/wallets/${id}`, wallet);

            return wallet;

        } else {

            throw new NotFoundException(`Wallet with ID: ${id} not found on this server`)
        }

    }
}