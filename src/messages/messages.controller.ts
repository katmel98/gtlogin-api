import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('messages')
@Controller('messages')
export class MessagesController {

    @Get()
    findAll(@Query() query) {
      return `This action returns all roles (limit: ${query.limit} messages)`;
    }

    @Get(':id')
    findOne(@Param('id') id) {
      return `This action returns a #${id} message`;
    }

    @Post()
    create(@Body() createMessageDto) {
        return 'This action adds a new message';
    }

    @Put(':id')
    update(@Param('id') id, @Body() updateMessageDto) {
        return `This action updates a #${id} message`;
    }

    @Delete(':id')
    remove(@Param('id') id) {
        return `This action removes a #${id} message`;
    }

}
