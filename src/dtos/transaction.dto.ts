import { Transform } from 'class-transformer';
import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsString,
    IsUUID,
    Max,
    Min,
    MinLength
} from 'class-validator';


export class TransactionIdDto {

    @IsUUID(4)
    readonly transactionId: string;
};

export class TransactionRefDto {

    @MinLength(30)
    @IsString()
    @IsNotEmpty()
    readonly transactionRef: string;
};

export class SearchWalletNumberAndDateDto {

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    walletNumber: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    readonly searchDate: Date;

}

export class SearchWalletNumberAndDateRangeDto {

    @Max(9999999999)
    @Min(1000000000)
    @IsInt()
    @IsNotEmpty()
    walletNumber: number;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    readonly startDate: Date;

    @Transform(({ value }) => new Date(value))
    @IsDate()
    @IsNotEmpty()
    readonly endDate: Date;

}