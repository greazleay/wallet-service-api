import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { User } from '@entities/user.entity';
import { Transaction } from '@entities/transaction.entity';


@Entity()
export class Wallet extends AbstractEntity {

    @Column('varchar')
    walletName: string

    @Column('int', { unique: true })
    walletNumber: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    walletBalance: number;

    @ManyToOne(() => User, user => user.wallets)
    walletHolder: User

    @OneToMany(() => Transaction, (transactions) => transactions.wallet,
        { cascade: ['remove'] }
    )
    transactions: Transaction[];

    public async generateWalletNumber(walletNumbers: number[]): Promise<number> {

        let walletNumber: number = 1000000000 + Math.floor(Math.random() * 1000000000);

        if (walletNumbers.indexOf(walletNumber) !== -1) {
            walletNumber = await this.generateWalletNumber(walletNumbers)
        }

        return walletNumber;
    };
}