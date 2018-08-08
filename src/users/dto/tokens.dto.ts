import { ApiModelProperty } from '@nestjs/swagger';

export class TokensDto {

    @ApiModelProperty()
    readonly access: string;

    @ApiModelProperty()
    readonly token: string;

}