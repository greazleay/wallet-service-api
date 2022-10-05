import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from '@entities/abstract.entity';
import { User } from '@entities/user.entity';
import { Transaction } from '@entities/transaction.entity';


@Entity()
export class Account extends AbstractEntity {

    @Column('varchar')
    accountName!: string

    @Column('int', { unique: true })
    accountNumber!: number;

    @Column('decimal', { precision: 15, scale: 2, default: 0 })
    accountBalance!: number;

    @ManyToMany(() => User, user => user.accounts)
    @JoinTable()
    accountHolder!: User[]

    @OneToMany(() => Transaction, (transactions) => transactions.fromAccount)
    transactions!: Transaction[];
}