import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';


export class TransactionIdDto {

    @IsUUID(4)
    readonly transactionId: string;
};

export class TransactionRefDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(30)
    readonly transactionRef: string;
};

export class SearchAccountNumberAndDateDto {

    @IsNotEmpty()
    @IsInt()
    @Min(1000000000)
    @Max(9999999999)
    accountNumber: number;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    readonly searchDate: Date;

}