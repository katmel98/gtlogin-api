import { Controller, Get, Request,
         Param, Post, Put, Body, Delete, InternalServerErrorException,
         UnprocessableEntityException, BadRequestException,
         NotFoundException, UseGuards, Req,
         } from '@nestjs/common';

import { ApiUseTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { RolesDto } from '../roles/dto/roles.dto';
import { GroupsService } from '../groups/groups.service';
import { GroupsDto } from '../groups/dto/groups.dto';
import { RolesGuard } from 'common/guards/roles.guard';

@ApiUseTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {

    constructor(private readonly usersService: UsersService,
                private readonly rolesService: RolesService,
                private readonly groupsService: GroupsService){}

    // GET /users
    @Get()
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    //   return `This action returns all users (limit: ${query.limit} items)`;
    }

    // GET /users/:id
    @Get(':id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
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
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Unprocessable Entity.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
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
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Put a model instance and persist it into the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
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
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Delete a model instance by {{id}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
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
    @Get('/me/info')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Obtains self user data'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    info(@Req() request: Request) {
        return request['user'];
    }

    @Post('reset')
    @ApiOperation({ title: 'Reset password for a user with email.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async reset() {
        return `Reset Password`;
    }

    @Post('reset-password')
    @ApiOperation({ title: 'Reset user\'s password via a password-reset token.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async resetPassword() {
        return `Reset Password Reset`;
    }

    @Put('update-password')
    @ApiOperation( { title: 'Allows a logged user to change his/her password.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    async updatePassword() {
        return `Update Password`;
    }

    // DELETE /users/me/:token
    @Delete('/me/:token')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Delete a model instance\'s token by {{token}} from user.'})
    @ApiResponse({ status: 200, description: 'The token has been successfully removed.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async removeToken(@Param('token') token: string): Promise<any> {
        // return `This action removes a #${id} user`;
        try {
            return await this.usersService.removeToken(token);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    // GET /users/getUserByEmail/:email
    @Get('/getUserByEmail/:email')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find a model instance by {{email}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
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

    // GET /users/getUserByToken/:token
    @Get('/getUserByToken/:token')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find a model instance by {{token}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully queried.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async getUserByToken(@Param('token') token: string): Promise<User> {
        try {
            return await this.usersService.getUserByToken(token);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    // POST /users/:id/setGroups
    @Post(':id/setGroups')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set user groups'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addGroups(@Param('id') id: string, @Body() groupsDto: GroupsDto): Promise<User> {
        try {
            return this.groupsService.setGroups(id, groupsDto);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }

    }
    

    // POST /users/:id/setRoles
    @Post(':id/setRoles')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set user roles'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addRoles(@Param('id') id: string, @Body() rolesDto: RolesDto): Promise<User> {
        try {
            return this.rolesService.setRoles('user', id, rolesDto);
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
