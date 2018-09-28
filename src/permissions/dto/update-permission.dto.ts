import { ApiModelProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly descrip: string;

    @ApiModelProperty()
    readonly rules: Array<any>;

    @ApiModelProperty()
    updated_at: number;

}