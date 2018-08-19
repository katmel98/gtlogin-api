import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class GroupsDto {

    @ApiModelProperty()
    readonly groups: ArrayList<string>;

}