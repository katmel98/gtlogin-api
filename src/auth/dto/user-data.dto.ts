import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDataDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

}