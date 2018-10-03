import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class PermissionsDto {

    @ApiModelProperty()
    readonly permissions: ArrayList<string>;

}