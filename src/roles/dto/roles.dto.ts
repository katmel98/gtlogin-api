import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class RolesDto {

    @ApiModelProperty()
    readonly roles: ArrayList<string>;

}