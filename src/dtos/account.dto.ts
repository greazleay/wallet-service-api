import { Transform } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsString,
    IsUUID,
    Length,
    Min,
    Max,
    MinLength
} from 'class-validator';


export class OpenAccountDto {

    @IsNotEmpty()
    @IsString()
    @Length(3)
    @Transform(({ value }) => value.toUppercase())
    accountName: string;

};

export class AccountIdDto {

    @IsUUID(4)
    readonly accountId: string;
};

export class AccountNumberDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1000000000)
    @Max(9999999999)
    readonly accountNumber: number;
};

export class WithdrawFundsDto extends AccountNumberDto {

    @IsInt()
    @Min(1, { message: 'Transaction Amount must be greater than Zero' })
    transactionAmount: number;

    @IsString()
    @Length(1)
    transactionParty: string;
};

export class DepositFundsDto extends WithdrawFundsDto {

    @IsNotEmpty()
    @IsString()
    accountName: string
}

export class TransferFundsDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: 'Transaction Amount must be greater than Zero' })
    transferAmount: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1000000000)
    @Max(9999999999)
    debitAccountNumber: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1000000000)
    @Max(9999999999)
    creditAccountNumber: number;

    @IsString()
    @MinLength(1, { message: 'Transfer Account Name length must be greater than Zero' })
    creditAccountName: string;
}