import { Module } from '@nestjs/common';
import { SyslogsController } from './syslogs.controller';

@Module({
    imports: [],
    controllers: [SyslogsController],
    providers: [],
  })

  export class SyslogsModule {}
