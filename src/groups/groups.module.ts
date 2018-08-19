
import { RolesModule } from './../roles/roles.module';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupsController } from './groups.controller';

import { GroupsService } from './groups.service';

import { GroupSchema } from './schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }]),
    forwardRef(() => RolesModule),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [ GroupsService ],
})

export class GroupsModule {}
