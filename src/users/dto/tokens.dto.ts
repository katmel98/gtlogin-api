import { ApiModelProperty } from '@nestjs/swagger';

export class TokensDto {

    @ApiModelProperty()
    readonly access: string;

    @ApiModelProperty()
    readonly token: string;

    @ApiModelProperty()
    readonly expires_in: number;

    @ApiModelProperty()
    readonly created_at: number;

    @ApiModelProperty()
    readonly expires_at: number;

}