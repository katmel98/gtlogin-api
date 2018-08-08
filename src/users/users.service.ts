import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  saltRounds: any;
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // CREATE
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (e) {
        return e;
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
      return this.userModel.findOne({
        email: user_email,
      }).then( (res) => {
        if ( !res ) {
          throw new HttpException({ error: 'NOT_FOUND', message: `${user_email} not found`, status: HttpStatus.NOT_FOUND}, 404);
        }
        return res;
      } );
  } catch (e) {
    throw e;
  }
}

  // UPDATE
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
      if ( !ObjectID.isValid(id) ){
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
      }
      try {
          const resp = await this.userModel.updateOne({
            _id: id,
          }, {
            $set: updateUserDto,
          });
          if ( resp.nModified === 0 ){
            throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found or entity not modified`, status: HttpStatus.NOT_FOUND}, 404);
          } else {
            return this.userModel.findOne({
              _id: id,
            });
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
      const User = await this.userModel.findOneAndRemove({
        _id: id,
      });
      if ( !User ) {
          throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
      }
      return User;
    } catch (e) {
      if ( e.message.error === 'NOT_FOUND' ){
        throw new HttpException({ error: 'NOT_FOUND', message: `ID ${id} not found`, status: HttpStatus.NOT_FOUND}, 404);
      } else {
        throw new HttpException({error: 'ID_NOT_VALID', message: `ID ${id} is not valid`, status: HttpStatus.BAD_REQUEST}, 400);
      }
    }

  }

  // FIND ONE USER BY TOKEN
  findOneByToken(token: string) {}

  // USERS SELF DATA
  me() {}

  async getHash(password: string): Promise<string>  {
    this.saltRounds = 16;
    return bcrypt.hash(password, this.saltRounds);
  }

  async compareHash(password, hash): Promise<boolean>  {
    return bcrypt.compare(password, hash);
  }

}