import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import { AbstractEntity } from '@entities/abstract.entity';
import { Wallet } from '@entities/wallet.entity';
import { ENV } from '@config/configuration';
import { Role } from '@interfaces/user.interface';


@Entity()
export class User extends AbstractEntity {

    @Column('varchar', {
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Exclude()
    @Column('varchar', {
        length: 255,
        nullable: false
    })
    password: string;

    @Column('varchar')
    fullName: string;

    @Column('datetime', { nullable: true })
    lastLogin: Date;

    @Column('set', {
        enum: Role,
        default: [Role.USER]
    })
    roles: Role[];

    @OneToMany(() => Wallet, wallet => wallet.walletHolder,
        { cascade: ['remove'] }
    )
    wallets: Wallet[];

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