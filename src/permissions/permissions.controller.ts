import { Controller, Get, Query, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsService } from './permissions.service';
import { Permission } from './interfaces/permission.interface';

@ApiUseTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService){}

    @Get()
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findAll(): Promise<Permission[]> {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
    findOne(@Param('id') id) {
      return `This action returns a #${id} permission`;
    }

    @Post()
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
    create(@Body() createPermissionDto) {
        return 'This action adds a new permission';
    }

    @Put(':id')
    @ApiOperation({ title: 'Put a model instance and persist it into the data source.'})
    update(@Param('id') id, @Body() updatePermissionDto) {
        return `This action updates a #${id} permission`;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete a model instance by {{id}} from the data source.'})
    remove(@Param('id') id) {
        return `This action removes a #${id} permission`;
    }

}
