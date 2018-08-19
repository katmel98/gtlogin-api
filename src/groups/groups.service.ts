import * as moment from 'moment';
import * as _ from 'lodash';

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';

import { Group } from './interfaces/group.interface';

import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
    constructor( @InjectModel('Group') private readonly groupModel: Model<Group> ) {}

    getGroupModel() {
        return this.groupModel;
    }

    // CREATE
    async create(createGroupDto: CreateGroupDto): Promise<Group> {
        try {
        const createdGroup = new this.groupModel(createGroupDto);
        let group = await createdGroup.save();
        group = _.pick(group, ['_id', 'name', 'descrip', 'created_at', 'update_at']);
        return group;
        } catch (e) {
            return e;
        }
    }

    // FINDALL
    async findAll(): Promise<Group[]> {
        return await this.groupModel.find();
    }

    // FINDONE
    async findOne(id: string): Promise<Group> {
        if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.NOT_FOUND}, 400);
        }
        try {

        return this.groupModel.findOne({
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
    async delete(id: string): Promise<Group> {
        if ( !ObjectID.isValid(id) ){
            throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
        }
        try {
            const group = await this.groupModel.findOneAndRemove({
                _id: id,
            });
            if ( !group ) {
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            }
            // User = _.pick(User, ['_id', 'name', 'surname', 'lastname', 'email']);
            return group;
        } catch (e) {
            if ( e.message.error === 'NOT_FOUND' ){
                throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
            } else {
                throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
            }
        }

    }

    // SET USER Groups
    // async setGroups(id: string, rolesDto: RolesDto): Promise<Group> {
    //     if ( !ObjectID.isValid(id) ){
    //         throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
    //     }
    //     try {
    //         console.log(rolesDto);
    //         const date = moment().valueOf();
    //         const resp = await this.userModel.updateOne({
    //           _id: id,
    //         }, {
    //           $set: {
    //               updated_at: date,
    //               roles: rolesDto.roles,
    //           },
    //         });
    //         if ( resp.nModified === 0 ){
    //           throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
    //         } else {
    //           let User = await this.userModel.findOne({ _id: id });
    //           User = _.pick(User, ['_id', 'email', 'roles', 'groups', 'created_at', 'updated_at']);
    //           return User;
    //         }
    //     } catch (e) {
    //       if ( e.message.error === 'NOT_FOUND' ){
    //         throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
    //       } else {
    //         throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
    //       }
    //     }
    // }

}
