import { Column, Entity } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { AbstractEntity } from './abstract.entity';


@Entity()
export class ResetToken extends AbstractEntity {

    @Column('varchar', {
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Column('varchar', { nullable: false })
    token: string;

    @Column('datetime', { nullable: false })
    expiry: Date;

    public async generateResetToken(): Promise<string> {
        const code = randomBytes(32).toString('hex').toUpperCase();
        this.token = await hash(code, 10);
        this.expiry = new Date(Date.now() + 300000);
        await this.save();
        return code;
    }

    public async isResetTokenValid(code: string): Promise<boolean> {
        const isValidToken: boolean = await compare(code, this.token);
        const tokenNotExpired: boolean = (Date.now() - new Date(this.expiry).getTime()) < 300000;
        return (isValidToken && tokenNotExpired);
    }
}