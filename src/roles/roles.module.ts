import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleSchema } from './schemas/role.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
      forwardRef(() => UsersModule),
      forwardRef(() => GroupsModule),
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
  })

export class RolesModule {}
