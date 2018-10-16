import { RolesService } from './../roles/roles.service';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesDto } from '../roles/dto/roles.dto';
import { Role } from 'roles/interfaces/role.interface';
import { Permission } from 'permissions/interfaces/permission.interface';
import { Group } from 'groups/interfaces/group.interface';

@Injectable()
export class UsersService {
  saltRounds: any;
  constructor(@InjectModel('User') private readonly userModel: Model<User>,
              @InjectModel('Role') private readonly roleModel: Model<Role>,
              @InjectModel('Group') private readonly groupModel: Model<Group>,
              @InjectModel('Permission') private readonly permissionModel: Model<Permission>) {}

  getUserModel() {
    return this.userModel;
  }

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      if ( !createdUser.name ){
        createdUser.name = '';
      }
      if ( !createdUser.lastname ){
        createdUser.lastname = '';
      }
      if ( !createdUser.surname ){
        createdUser.surname = '';
      }
      let user = await createdUser.save();
      user = _.pick(user, ['_id', 'name', 'surname', 'lastname', 'email', 'created_at', 'update_at']);
      return user;
    } catch (e) {
        if ( e.name === 'MongoError') {
          throw new HttpException(
            {
              error: 'ENTITY_VALIDATION_ERROR',
              message: `${createUserDto.email} already exists`,
              status: HttpStatus.UNPROCESSABLE_ENTITY,
            },
            422,
          );
        } else {
          return e;
        }
    }
  }

  // FINDALL
  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  // FINDONE
  async findOne(id: string): Promise<User> {
      if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.NOT_FOUND}, 400);
      }
      try {

      return this.userModel.findOne({
        _id: id,
      }).then( (res) => {
        if ( !res ) {
          throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
        }
        return res;
      } );

    } catch (e) {
      throw e;
    }
  }

  // FIND BY EMAIL
  async getUserByEmail(user_email: string): Promise<User> {
    try {
      return await this.userModel.findOne({
        email: user_email,
      }).then( (res) => {
        if ( !res ) {
          throw new HttpException({ error: 'NOT_FOUND', message: `${user_email} not found`, status: HttpStatus.NOT_FOUND}, 404);
        }
        const user = _.pick(res, ['_id', 'name', 'surname', 'lastname', 'email', 'password', 'tokens', 'created_at', 'update_at']);
        return user;
      } );
    } catch (e) {
      throw e;
    }
  }

  // FIND BY TOKEN
  async getUserByToken(token: string): Promise<User> {
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        console.log('SE HA GENERADO UN ERROR ...');
        console.log(e);
        return Promise.reject();
    }
    const user = await this.userModel.findOne({
      'email': decoded.user.email,
      'tokens.access': 'auth',
      'tokens.token': token,
    });

    return user;

  }

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
      }
      try {
          const date = moment().valueOf();
          updateUserDto.updated_at = date;
          const resp = await this.userModel.updateOne({
            _id: id,
          }, {
            $set: updateUserDto,
          });
          if ( resp.nModified === 0 ){
            throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
          } else {
            let user = await this.userModel.findOne({ _id: id });
            user = _.pick(user, ['_id', 'name', 'surname', 'lastname', 'email', 'created_at', 'update_at']);
            return user;
          }
      } catch (e) {
        if ( e.message.error === 'NOT_FOUND' ){
          throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
        } else {
          throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
      }
  }

  // DELETE
  async delete(id: string): Promise<User> {
    if ( !ObjectID.isValid(id) ){
      throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
    }
    try {
      let user = await this.userModel.findOneAndRemove({
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

  // DELETE TOKEN FROM USER
  async removeToken(token: string): Promise<any> {
    try {
      let decoded;
      let User;
      try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
      } catch (e) {
          console.log('ERROR DE REMOVE_CLEAR TOKEN EN EL USERSERVICE');
          console.log(e);
          return Promise.reject();
      }
      const resp = await this.userModel.update({
        $pull: {
            tokens: { token },
        },
      });
      if ( resp.nModified === 0 ){
        throw new HttpException({ error: 'NOT_FOUND', message: `TOKEN ${token} not found`, status: HttpStatus.NOT_FOUND}, 404);
      } else {
        User = await this.userModel.findOne({ email: decoded.user.email });
        User.logged_in = false;
        User.last_logout = moment().valueOf();

        await this.update(User._id, User);

        const response = {statusCode: 200, message: `Token removed from user ${decoded.user.email}.`};
        return response;
      }
    } catch (e) {
      if ( e.message.error === 'NOT_FOUND' ){
        throw new HttpException({ error: 'NOT_FOUND', message: `TOKEN ${token} not found`, status: HttpStatus.NOT_FOUND}, 404);
      } else {
        throw new HttpException({error: 'TOKEN_NOT_VALID', message: `TOKEN ${token} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
      }
    }

  }

  // SET USER ROLES
  async setRoles(id: string, rolesDto: RolesDto): Promise<User> {
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
              roles: rolesDto.roles,
          },
        });
        if ( resp.nModified === 0 ){
          throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
        } else {
          let user = await this.userModel.findOne({ _id: id });
          user = _.pick(user, ['_id', 'email', 'roles', 'created_at', 'updated_at']);
          return user;
        }
    } catch (e) {
      if ( e.message.error === 'NOT_FOUND' ){
        throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
      } else {
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
      }
    }
}

  async getHash(password: string): Promise<string>  {
    this.saltRounds = 16;
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password, hash): Promise<boolean>  {
    return bcrypt.compare(password, hash);
  }

  async findUserExistsByEmail(user_email: string): Promise<User> {
    return this.userModel.findOne({
      email: user_email,
    }).then( (res) => {
      if ( res ) {
        return true;
      }
      return false;
    } );
  }

  async findUserPermissionsById(id: string): Promise<any> {
    const user = await this.userModel.findOne({ _id: id });
    // const result;
    const result_roles: Array<string> = [];
    const result_groups: Array<string> = [];
    let user_permissions = [];

    const roles = user.roles;
    const groups = user.groups;

    try {

      // VERIFICANDO PERMISOS DE LOS ROLES ASIGNADOS AL USUARIO
      if (roles.length > 0) {
        for ( const role_value of roles ) {
          // SE RECORREN LOS POSIBLES ROLES DEL USUARIO
          let roles_permissions;
          const name = role_value;
          let R = await this.roleModel.findOne({ name });
          R = _.pick(R, ['_id', 'permissions']);
          if ( R.permissions ) {
            roles_permissions = JSON.parse(JSON.stringify(R.permissions));
          }
          if ( roles_permissions.length > 0) {
            for (const item of roles_permissions) {
              result_roles.push(item);
            }
          }
        }
      }
      // VERIFICANDO LOS PERMISOS ASIGNADOS A LOS GRUPOS A LOS QUE PERTENECE EL USUARIO
      if (groups.length > 0) {
        for ( const group_value of groups ) {
          // SE RECORREN LOS POSIBLES GRUPOS DEL USUARIO
          let group_permissions;
          const group_name = group_value;
          let groups_roles = await this.groupModel.findOne({ name: group_name });
          groups_roles = _.pick(groups_roles, ['_id', 'roles']);
          if (_.size(groups_roles.roles) > 0) {
            for ( const role_value of groups_roles.roles ) {
              // SE RECORREN LOS POSIBLES ROLES DEL GRUPO
              const name = role_value;
              let G = await this.roleModel.findOne({ name });
              G = _.pick(G, ['_id', 'permissions']);
              if ( G.permissions ) {
                group_permissions = JSON.parse(JSON.stringify(G.permissions));
              }
            }
            if ( group_permissions.length > 0) {
              for (const item of group_permissions) {
                result_groups.push(item);
              }
            }
          }
        }
      }

      if ( (result_roles.length > 0) || (result_groups.length > 0)) {

        const search_permissions = _.union(result_roles, result_groups);

        for ( const item of search_permissions ) {
          // SE RECORREN LOS IDS DE PERMISOS
          let result_permission = await this.permissionModel.findOne({ _id: item });
          result_permission = _.pick(result_permission, ['_id', 'rules']);
          for (const element of result_permission.rules){
            // SE RECORREN LOS ARRAYS DE REGLAS DE LOS PERMISOS Y SE ESCOGEN SOLO LOS QUE TENGAN EFFECT = 'ALLOW'
            // if ( element.effect === 'allow' ) {
              const object = {
                resource: element.resource,
                effect: element.effect,
                method: element.method,
                id: element._id.toString(),
              };
              user_permissions.push(object);
            // }
          }
        }
      }
    } catch ( e ) {
      console.log(e);
    }
    user_permissions = _.uniqBy(user_permissions, 'id');

    return user_permissions;
  }

}