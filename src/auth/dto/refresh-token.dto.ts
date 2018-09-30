import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshTokenDto {

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly refreshToken: string;

}