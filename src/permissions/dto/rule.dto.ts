import { ApiModelProperty } from '@nestjs/swagger';

export class RuleDto {

    @ApiModelProperty()
    readonly resource: string;

    @ApiModelProperty()
    readonly effect: string;

    @ApiModelProperty()
    readonly method: string;

}