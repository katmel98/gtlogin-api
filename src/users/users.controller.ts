import { Controller, Get,
         Param, Post, Put, Body, Delete, InternalServerErrorException,
         UnprocessableEntityException, BadRequestException,
         NotFoundException,
         Patch} from '@nestjs/common';

import { ApiUseTags, ApiResponse, ApiConsumes } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

@ApiUseTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    // GET /users
    @Get()
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    //   return `This action returns all users (limit: ${query.limit} items)`;
    }

    // GET /users/:id
    @Get(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findOne(@Param('id') id: string): Promise<User> {
    //   return `This action returns a #${id} user`;
        try {
            return await this.usersService.findOne(id);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    // POST /users
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
            const message = e.message;
            if ( e.name === 'ValidationError' ){
                throw new UnprocessableEntityException(message);
            }else if ( e.name === 'MongoError' ){
                throw new BadRequestException(message);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    // PATCH /users/:id
    @Put(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
        // return `This action updates a #${id} user`;
        try {
            return await this.usersService.update(id, updateUserDto);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    // DELETE /users/:id
    @Delete(':id')
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async remove(@Param('id') id: string): Promise<User> {
        // return `This action removes a #${id} user`;
        try {
            return await this.usersService.delete(id);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

}
