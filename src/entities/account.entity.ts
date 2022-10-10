import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { User } from '@entities/user.entity';
import { Transaction } from '@entities/transaction.entity';


@Entity()
export class Account extends AbstractEntity {

    @Column('varchar')
    accountName: string

    @Column('int', { unique: true })
    accountNumber: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    accountBalance: number;

    @ManyToOne(() => User, user => user.accounts)
    accountHolder: User

    @OneToMany(() => Transaction, (transactions) => transactions.account)
    transactions: Transaction[];

    public async generateAccountNumber(accountNumbers: number[]): Promise<number> {

        let accoutNumber: number = 1000000000 + Math.floor(Math.random() * 1000000000);

        while (accountNumbers.indexOf(accoutNumber) !== -1) {
            accoutNumber = 1000000000 + Math.floor(Math.random() * 1000000000);
        }

        return accoutNumber;
    };
}