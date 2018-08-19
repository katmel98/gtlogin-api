import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class UpdateUserDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly surname: string;

    @ApiModelProperty()
    readonly lastname: string;

    @ApiModelProperty()
    readonly roles: ArrayList<string>;

    @ApiModelProperty()
    updated_at: number;

}