import * as moment from 'moment';
import * as _ from 'lodash';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';

import { Role } from './interfaces/role.interface';
import { User } from '../users/interfaces/user.interface';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserRolesDto } from './dto/user-roles.dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel('Role') private readonly roleModel: Model<Role>,
                @InjectModel('User') private readonly userModel: Model<User>) {}

    // CREATE
    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        try {
        const createdRole = new this.roleModel(createRoleDto);
        let Role = await createdRole.save();
        Role = _.pick(Role, ['_id', 'name', 'descrip', 'created_at', 'update_at']);
        return Role;
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
            let User = await this.roleModel.findOneAndRemove({
                _id: id,
            });
            if ( !User ) {
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            }
            User = _.pick(User, ['_id', 'name', 'surname', 'lastname', 'email']);
            return User;
        } catch (e) {
            if ( e.message.error === 'NOT_FOUND' ){
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
            }
        }

    }

    // SET USER ROLES
    async setRoles(id: string, userRolesDto: UserRolesDto): Promise<User> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            const date = moment().valueOf();
            const resp = await this.userModel.updateOne({
              _id: id,
            }, {
              $set: {
                  updated_at: date,
                  roles: userRolesDto.roles,
              },
            });
            if ( resp.nModified === 0 ){
              throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
              let User = await this.userModel.findOne({ _id: id });
              User = _.pick(User, ['_id', 'email', 'roles', 'created_at', 'updated_at']);
              return User;
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
