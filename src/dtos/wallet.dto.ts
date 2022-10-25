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


export class CreateWalletDto {

    @Transform(({ value }) => String(value).toUpperCase())
    @Length(3)
    @IsString()
    @IsNotEmpty()
    walletName: string;

};

export class WalletIdDto {

    @IsUUID(4)
    readonly walletId: string;
};

export class WalletNumberDto {

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    readonly walletNumber: number;
};

export class WithdrawFundsDto extends WalletNumberDto {

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
    walletName: string
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
    debitWalletNumber: number;

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    creditWalletNumber: number;

    @Transform(({ value }) => String(value).toUpperCase())
    @MinLength(2, { message: 'Transfer Wallet Name Must have more than 1 character' })
    @IsString()
    creditWalletName: string;
}