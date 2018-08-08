import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly surname: string;

    @ApiModelProperty()
    readonly lastname: string;

    @ApiModelProperty()
    updated_at: number;


}