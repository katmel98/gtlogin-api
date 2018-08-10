import { RolesService } from 'roles/roles.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { RoleSchema } from 'roles/schemas/role.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
    ],
    controllers: [UsersController],
    providers: [UsersService, RolesService],
    exports: [UsersService],
  })

export class UsersModule {}
