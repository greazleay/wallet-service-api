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

    @Transform(({ value }) => String(value).toUpperCase())
    @Length(3)
    @IsString()
    @IsNotEmpty()
    accountName: string;

};

export class AccountIdDto {

    @IsUUID(4)
    readonly accountId: string;
};

export class AccountNumberDto {

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    readonly accountNumber: number;
};

export class WithdrawFundsDto extends AccountNumberDto {

    @Min(1, { message: 'Transaction Amount must be greater than Zero' })
    @IsInt()
    transactionAmount: number;

    @Length(4)
    @IsString()
    transactionParty: string;
};

export class DepositFundsDto extends WithdrawFundsDto {

    @Transform(({ value }) => String(value).toUpperCase())
    @IsString()
    @IsNotEmpty()
    accountName: string
}

export class TransferFundsDto {

    @Min(1, { message: 'Transaction Amount must be greater than Zero' })
    @IsInt()
    @IsNotEmpty()
    transferAmount: number;

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    debitAccountNumber: number;

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    creditAccountNumber: number;

    @Transform(({ value }) => String(value).toUpperCase())
    @MinLength(2, { message: 'Transfer Account Name Must have more than 1 character' })
    @IsString()
    creditAccountName: string;
}