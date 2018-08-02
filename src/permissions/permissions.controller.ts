import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags } from '../../node_modules/@nestjs/swagger';

@ApiUseTags('permissions')
@Controller('permissions')
export class PermissionsController {

    @Get()
    findAll(@Query() query) {
      return `This action returns all roles (limit: ${query.limit} permissions)`;
    }

    @Get(':id')
    findOne(@Param('id') id) {
      return `This action returns a #${id} permission`;
    }

    @Post()
    create(@Body() createPermissionDto) {
        return 'This action adds a new permission';
    }

    @Put(':id')
    update(@Param('id') id, @Body() updatePermissionDto) {
        return `This action updates a #${id} permission`;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return `This action removes a #${id} permission`;
    }

}
