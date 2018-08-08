import { Controller, Get,
         Param, Post, Put, Body, Delete, InternalServerErrorException,
         UnprocessableEntityException, BadRequestException,
         NotFoundException, UseGuards,
         } from '@nestjs/common';

import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';

import { AuthGuard } from '@nestjs/passport';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService){}

    // GET /users
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    //   return `This action returns all users (limit: ${query.limit} items)`;
    }

    // GET /users/:id
    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
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
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
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

    // PUT /users/:id
    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Put a model instance and persist it into the data source.'})
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
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Delete a model instance by {{id}} from the data source.'})
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

    // GET /users/me
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Obtains self user data'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async me() {
        return `Push login`;
    }

    @Post('login')
    @ApiOperation({ title: 'Login a user with username/email and password.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async login() {
        return `Push login`;
    }

    @Post('logout')
    @ApiOperation({ title: 'Logout a user with access token.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async logout() {
        return `Push logout`;
    }

    @Post('reset')
    @ApiOperation({ title: 'Reset password for a user with email.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async reset() {
        return `Reset Password`;
    }

    @Post('reset-password')
    @ApiOperation({ title: 'Reset user\'s password via a password-reset token.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async resetPassword() {
        return `Reset Password Reset`;
    }

    @Put('update-password')
    @ApiOperation( { title: 'Allows a logged user to change his/her password.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async updatePassword() {
        return `Update Password`;
    }

    // GET /users/getUserByEmail/:email
    @Get('/getUserByEmail/:email')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Find a model instance by {{email}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        try {
            return await this.usersService.getUserByEmail(email);
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
