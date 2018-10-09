import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// import { TokensDto } from './tokens.dto';

export class CreateUserDto {

    @IsNotEmpty()
    @ApiModelProperty()
    readonly name: string;

    @IsNotEmpty()
    @ApiModelProperty()
    readonly surname: string;

    @IsNotEmpty()
    @ApiModelProperty()
    readonly lastname: string;

    @IsNotEmpty()
    @ApiModelProperty()
    readonly password: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly created_at: number;

    @ApiModelProperty()
    readonly updated_at: number;

}