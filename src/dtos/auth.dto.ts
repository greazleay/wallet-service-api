import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';


export class ValidEmailDto {

    @IsEmail({ message: 'Please enter a valid email address' })
    readonly email: string;
}

export class LoginUserDto extends ValidEmailDto {

    @MinLength(6, { message: 'Password must be at least six characters long' })
    @IsString()
    @IsNotEmpty()
    password: string

}

export class ChangePasswordDto {

    @MinLength(6, { message: 'Current Password must be at least six characters long' })
    @IsString()
    readonly currentPassword: string;

    @MinLength(6, { message: 'New Password must be at least six characters long' })
    @IsString()
    readonly newPassword: string;
}

export class ResetPasswordDto extends ValidEmailDto {

    @IsString()
    @Length(6, 6, { message: 'Verification Must be six characters in length' })
    token: string

    @IsString()
    @MinLength(6, { message: 'New Password must be at least six characters long' })
    readonly newPassword: string;

}