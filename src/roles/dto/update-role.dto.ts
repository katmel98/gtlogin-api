import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateRoleDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly descrip: string;

    @ApiModelProperty()
    updated_at: number;

}