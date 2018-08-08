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
              ProductModule,
              UsersModule,
              PermissionsModule,
              RolesModule,
              MessagesModule,
              SyslogsModule,
            ],
  providers: [],
})
export class AppModule {}
