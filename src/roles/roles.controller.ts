import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';

@ApiUseTags('roles')
@Controller('roles')
export class RolesController {
    @Get()
    @ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
    findAll(@Query() query) {
      return `This action returns all roles (limit: ${query.limit} items)`;
    }

    @Get(':id')
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
    findOne(@Param('id') id) {
      return `This action returns a #${id} role`;
    }

    @Post()
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
    create(@Body() createRoleDto) {
        return 'This action adds a new role';
    }

    @Put(':id')
    @ApiOperation({ title: 'Put a model instance and persist it into the data source.'})
    update(@Param('id') id, @Body() updateRoleDto) {
        return `This action updates a #${id} role`;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete a model instance by {{id}} from the data source.'})
    remove(@Param('id') id) {
        return `This action removes a #${id} role`;
    }
}
