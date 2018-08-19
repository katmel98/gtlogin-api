import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateGroupDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly descrip: string;

    @ApiModelProperty()
    updated_at: number;

}