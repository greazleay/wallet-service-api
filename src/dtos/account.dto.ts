import { IsString, Length, IsUUID, IsInt, Min, IsNotEmpty, Max, MinLength } from 'class-validator';


export class OpenAccountDto {

    @IsNotEmpty()
    @IsString()
    @Length(3)
    accountName: string;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: 'Opening Balance must be greater than zero' })
    openingBalance: number;

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

export class DepositOrWithdrawFundsDto extends AccountNumberDto {

    @IsNotEmpty()
    @IsString()
    accountName: string

    @IsInt()
    @Min(1, { message: 'Transaction Amount must be greater than Zero' })
    transactionAmount: number;

    @IsString()
    @Length(1)
    transactionParty: string;
};

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