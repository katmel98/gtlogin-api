import { Controller, Get, Query, Param, Post, Body, Put, Delete, HttpException, HttpStatus, InternalServerErrorException, UnprocessableEntityException, ConflictException, BadRequestException } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@ApiUseTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    //   return `This action returns all users (limit: ${query.limit} items)`;
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    findOne(@Param('id') id) {
      return `This action returns a #${id} user`;
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Unprocessable Entity.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 422, description: 'Entity Validation Error.'})
    async create(@Body() createUserDto: CreateUserDto) {
        // return 'This action adds a new user';
        try{
            return await this.usersService.create(createUserDto);
        } catch (e) {
            if ( e.name === 'ValidationError' ){
                throw new UnprocessableEntityException(e.message);
            }else if ( e.name === 'MongoError' ){
                throw new BadRequestException(e.message);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    @Put(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    update(@Param('id') id, @Body() updateUserDto) {
        return `This action updates a #${id} user`;
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    remove(@Param('id') id) {
        return `This action removes a #${id} user`;
    }

}
