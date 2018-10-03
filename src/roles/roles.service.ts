import { UsersService } from './../users/users.service';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';

import { Role } from './interfaces/role.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesDto } from './dto/roles.dto';
import { GroupsService } from '../groups/groups.service';
import { PermissionsDto } from './dto/permissions.dto';

@Injectable()
export class RolesService {
    userModel: any;
    groupModel: any;
    constructor( @InjectModel('Role') private readonly roleModel: Model<Role>,
                 private readonly usersService: UsersService,
                 private readonly groupsService: GroupsService ) {
                     this.userModel = this.usersService.getUserModel();
                     this.groupModel = this.groupsService.getGroupModel();
                 }

    // CREATE
    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        try {
        const createdRole = new this.roleModel(createRoleDto);
        let role = await createdRole.save();
        role = _.pick(role, ['_id', 'name', 'descrip', 'created_at', 'update_at']);
        return role;
        } catch (e) {
            return e;
        }
    }

    // FINDALL
    async findAll(): Promise<Role[]> {
        return await this.roleModel.find();
    }

    // FINDONE
    async findOne(id: string): Promise<Role> {
        if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.NOT_FOUND}, 400);
        }
        try {

            return this.roleModel.findOne({
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

    // DELETE
    async delete(id: string): Promise<Role> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            let user = await this.roleModel.findOneAndRemove({
                _id: id,
            });
            if ( !user ) {
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            }
            user = _.pick(user, ['_id', 'name', 'surname', 'lastname', 'email']);
            return user;
        } catch (e) {
            if ( e.message.error === 'NOT_FOUND' ){
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
            }
        }

    }

    // SET USER ROLES
    async setRoles(type: string, id: string, rolesDto: RolesDto): Promise<any> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            const date = moment().valueOf();
            let resp;
            if ( type === 'user' ){
                resp = await this.userModel.updateOne({
                    _id: id,
                }, {
                    $set: {
                        updated_at: date,
                        roles: rolesDto.roles,
                    },
                });
            } else if ( type === 'group' ){
                resp = await this.groupModel.updateOne({
                    _id: id,
                }, {
                    $set: {
                        updated_at: date,
                        roles: rolesDto.roles,
                    },
                });
            }
            if ( resp.nModified === 0 ){
              throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                if ( type === 'user' ) {
                    let user = await this.userModel.findOne({ _id: id });
                    user = _.pick(user, ['_id', 'email', 'roles', 'created_at', 'updated_at']);
                    return user;
                } else if ( type === 'group' ) {
                    const group = await this.groupModel.findOne({ _id: id });
                    return group;
                }
            }
        } catch (e) {
          if ( e.message.error === 'NOT_FOUND' ){
            throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
          } else {
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
          }
        }
    }

    // SET USER ROLES
    async setPermissions(id: string, permissionsDto: PermissionsDto): Promise<any> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            const date = moment().valueOf();
            let resp;
            resp = await this.roleModel.updateOne({
                _id: id,
            }, {
                $set: {
                    updated_at: date,
                    permissions: permissionsDto.permissions,
                },
            });
            if ( resp.nModified === 0 ){
              throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                let role = await this.roleModel.findOne({ _id: id });
                role = _.pick(role, ['_id', 'name', 'descrip', 'permissions', 'created_at', 'updated_at']);
                return role;
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
