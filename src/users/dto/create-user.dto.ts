import { ApiModelProperty } from '@nestjs/swagger';
import { TokensDto } from './tokens.dto';

export class CreateUserDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly surname: string;

    @ApiModelProperty()
    readonly lastname: string;

    @ApiModelProperty()
    readonly password: string;

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly created_at: number;

    @ApiModelProperty()
    readonly updated_at: number;

}