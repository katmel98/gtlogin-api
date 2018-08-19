import { RolesModule } from './../roles/roles.module';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { GroupsModule } from '../groups/groups.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      forwardRef(() => RolesModule),
      forwardRef(() => GroupsModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
  })

export class UsersModule {}
