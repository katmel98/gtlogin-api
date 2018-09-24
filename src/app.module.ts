import { GroupsModule } from './groups/groups.module';
import { AuthModule } from 'auth/auth.module';
import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'users/users.module';
import { PermissionsModule } from 'permissions/permissions.module';
import { RolesModule } from 'roles/roles.module';
import { MessagesModule } from 'messages/messages.module';
import { SyslogsModule } from 'syslogs/syslogs.module';
import { ProductModule } from 'products/products.module';
import { HeaderMiddleware } from 'common/middlewares/headers.middleware';

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
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HeaderMiddleware)
      .with('ApplicationModule')
      .forRoutes({ path: 'products', method: RequestMethod.ALL });
  }
}
