import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './interfaces/permission.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RulesDto } from './dto/rules.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RuleDto } from './dto/rule.dto';

@Injectable()
export class PermissionsService {

    constructor(@InjectModel('Permission') private readonly permissionModel: Model<Permission>) {}

    // FINDALL
    async findAll(): Promise<Permission[]> {
        return await this.permissionModel.find();
    }

    // FINDONE
    async findOne(id: string): Promise<Permission> {
        if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.NOT_FOUND}, 400);
        }
        try {

        return this.permissionModel.findOne({
        _id: id,
        }).then( (res) => {
                if ( !res ) {
                    throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
                }
                return res;
            },
        );

        } catch (e) {
            throw e;
        }
    }

    // CREATE
    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        try {
        const createdPermission = new this.permissionModel(createPermissionDto);
        let permission = await createdPermission.save();
        permission = _.pick(permission, ['_id', 'name', 'descrip', 'rules', 'created_at', 'update_at']);
        return permission;
        } catch (e) {
            return e;
        }
    }

    // DELETE
    async delete(id: string): Promise<Permission> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            let permission = await this.permissionModel.findOneAndRemove({
                _id: id,
            });
            if ( !permission ) {
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            }
            permission = _.pick(permission, ['_id', 'name', 'surname', 'lastname', 'email']);
            return permission;
        } catch (e) {
            if ( e.message.error === 'NOT_FOUND' ){
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
            }
        }
    }

    // SET USER ROLES
    async setRules(id: string, rulesDto: RulesDto): Promise<Permission> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            const date = moment().valueOf();
            let resp;
            resp = await this.permissionModel.updateOne({
                _id: id,
            }, {
                $set: {
                    update_at: date,
                    rules: rulesDto,
                },
            });
            if ( resp.nModified === 0 ){
              throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                let permission = await this.permissionModel.findOne({ _id: id });
                permission = _.pick(permission, ['_id', 'name', 'descrip', 'rules', 'created_at', 'updated_at']);
                return permission;
            }
        } catch (e) {
          if ( e.message.error === 'NOT_FOUND' ){
            throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
          } else {
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
          }
        }
    }

}
