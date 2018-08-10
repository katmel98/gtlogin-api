import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'users/schemas/user.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
  })

export class RolesModule {}
