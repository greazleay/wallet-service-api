import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsString,
    IsUUID,
    MinLength
} from 'class-validator';


export class IsValidEmailDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    readonly fullName: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string | undefined;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsAlphanumeric()
    @IsNotEmpty()
    readonly password: string;
}

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    readonly fullName: string; 
}


export class ValidUserIdDto {

    @IsUUID(4)
    @IsNotEmpty()
    userID: string;
}