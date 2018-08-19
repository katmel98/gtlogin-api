import { ApiModelProperty } from '@nestjs/swagger';

export class UserRolesDto {

    @ApiModelProperty()
    readonly roles: Array<any>;

}