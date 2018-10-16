import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// import { TokensDto } from './tokens.dto';

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    @ApiModelProperty()
    email: string;

    @IsNotEmpty()
    @ApiModelProperty()
    readonly password: string;

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly lastname: string;

    @ApiModelProperty()
    readonly surname: string;

    @ApiModelProperty()
    readonly created_at: number;

    @ApiModelProperty()
    readonly updated_at: number;

}