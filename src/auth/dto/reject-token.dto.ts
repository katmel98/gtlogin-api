import { ApiModelProperty } from '@nestjs/swagger';

export class RejectTokenDto {

    @ApiModelProperty()
    readonly token: string;

}