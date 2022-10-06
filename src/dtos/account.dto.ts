import { IsString, Length, IsUUID, IsInt, Min, IsNotEmpty, Max } from 'class-validator';


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