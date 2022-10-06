import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsUUID,
    MinLength
} from 'class-validator';


export class IsValidEmailDto {

    @IsEmail()
    readonly email: string | undefined
}

export class CreateUserDto {

    @IsNotEmpty()
    readonly fullName: string | undefined;

    @IsEmail()
    readonly email: string | undefined;

    @IsAlphanumeric()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string | undefined;
}


export class ValidUserIdDto {

    @IsUUID(4)
    userID: string | undefined
}