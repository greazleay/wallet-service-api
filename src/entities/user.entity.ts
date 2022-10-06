import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import { AbstractEntity } from '@entities/abstract.entity';
import { Account } from '@entities/account.entity';
import { ENV } from '@config/configuration';


@Entity()
export class User extends AbstractEntity {

    @Column('varchar', {
        length: 255,
        nullable: false,
        unique: true
    })
    email!: string;

    @Exclude()
    @Column('varchar', {
        length: 255,
        nullable: false
    })
    password!: string;

    @Column('varchar')
    fullName!: string;

    @Column('datetime', { nullable: true })
    lastLogin!: Date;

    @OneToMany(() => Account, account => account.accountHolder)
    accounts!: Account[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }

    public async isPasswordValid(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }

    public async generateToken() {

        const payload = {
            aud: "lendsqr-task",
            iss: "lendsqr-task",
            sub: this.id,
            name: this.fullName,
            email: this.email,
            lastLogin: this.lastLogin,
        };

        return sign(payload, ENV.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    }

}