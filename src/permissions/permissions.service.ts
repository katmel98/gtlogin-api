import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './interfaces/permission.interface';

@Injectable()
export class PermissionsService {

    constructor(@InjectModel('Permission') private readonly permissionModel: Model<Permission>) {}

    // FINDALL
    async findAll(): Promise<Permission[]> {
        return await this.permissionModel.find();
    }

}
