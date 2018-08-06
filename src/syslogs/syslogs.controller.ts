import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('syslogs')
@Controller('syslogs')
export class SyslogsController {

    @Get()
    findAll(@Query() query) {
      return `This action returns all syslogs (limit: ${query.limit} items)`;
    }

    @Get(':id')
    findOne(@Param('id') id) {
      return `This action returns a #${id} syslog`;
    }

    @Post()
    create(@Body() createSyslogDto) {
        return 'This action adds a new syslog';
    }

    @Put(':id')
    update(@Param('id') id, @Body() updateSyslogDto) {
        return `This action updates a #${id} syslog`;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return `This action removes a #${id} syslog`;
    }

}
