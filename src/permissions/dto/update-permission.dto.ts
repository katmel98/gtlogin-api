import { RulesDto } from './rules.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class UpdatePermissionDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly descrip: string;

    @ApiModelProperty()
    readonly rules: ArrayList<any>;

    @ApiModelProperty()
    updated_at: number;

}