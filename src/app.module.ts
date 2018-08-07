import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { PermissionsModule } from 'permissions/permissions.module';
import { RolesModule } from 'roles/roles.module';
import { MessagesModule } from 'messages/messages.module';
import { SyslogsModule } from 'syslogs/syslogs.module';

@Module({
  imports: [
              MongooseModule.forRoot('mongodb://localhost:27017/gtlogin'),
              UsersModule,
              PermissionsModule,
              RolesModule,
              MessagesModule,
              SyslogsModule,
            ],
  controllers: [],
  providers: [],
})
export class AppModule {}
