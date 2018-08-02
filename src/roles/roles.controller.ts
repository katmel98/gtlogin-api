import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags } from '../../node_modules/@nestjs/swagger';

@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
    @Get()
    findAll(@Query() query) {
      return `This action returns all roles (limit: ${query.limit} items)`;
    }

    @Get(':id')
    findOne(@Param('id') id) {
      return `This action returns a #${id} role`;
    }

    @Post()
    create(@Body() createRoleDto) {
        return 'This action adds a new role';
    }

    @Put(':id')
    update(@Param('id') id, @Body() updateRoleDto) {
        return `This action updates a #${id} role`;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return `This action removes a #${id} role`;
    }
}
