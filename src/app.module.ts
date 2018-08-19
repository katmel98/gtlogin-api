import { GroupsModule } from './groups/groups.module';
import { AuthModule } from 'auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { PermissionsModule } from 'permissions/permissions.module';
import { RolesModule } from 'roles/roles.module';
import { MessagesModule } from 'messages/messages.module';
import { SyslogsModule } from 'syslogs/syslogs.module';
import { ProductModule } from 'products/products.module';

@Module({
  imports: [
              MongooseModule.forRoot('mongodb://localhost:27017/gtlogin'),
              AuthModule,
              UsersModule,
              GroupsModule,
              RolesModule,
              PermissionsModule,
              MessagesModule,
              SyslogsModule,
              ProductModule,
            ],
  providers: [],
})
export class AppModule {}
