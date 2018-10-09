import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @IsNotEmpty()
    @ApiModelProperty()
    readonly password: string;

}