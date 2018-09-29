import { RuleDto } from './rule.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import * as ArrayList from 'arraylist';

export class RulesDto {

    @ApiModelProperty()
    readonly rules: ArrayList<RuleDto>;

}