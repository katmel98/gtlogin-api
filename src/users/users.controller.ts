import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags } from '../../node_modules/@nestjs/swagger';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
    @Get()
    findAll(@Query() query) {
      return `This action returns all users (limit: ${query.limit} items)`;
    }

    @Get(':id')
    findOne(@Param('id') id) {
      return `This action returns a #${id} user`;
    }

    @Post()
    create(@Body() createUserDto) {
        return 'This action adds a new user';
    }

    @Put(':id')
    update(@Param('id') id, @Body() updateUserDto) {
        return `This action updates a #${id} user`;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return `This action removes a #${id} user`;
    }

}
