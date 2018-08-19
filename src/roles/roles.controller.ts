import { Controller, Get, Param, Post, Body, Delete,
         UnprocessableEntityException, BadRequestException, InternalServerErrorException,
         UseGuards, 
         NotFoundException} from '@nestjs/common';

import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesService } from './roles.service';
import { Role } from './interfaces/role.interface';
import { User } from '../users/interfaces/user.interface'
import { CreateRoleDto } from './dto/create-role.dto';
import { UserRolesDto } from './dto/user-roles.dto';
import { RolesDto } from './dto/roles.dto';

@ApiUseTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService){}

    @Get()
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findOne(@Param('id') id: string): Promise<Role> {
        try {
            return await this.rolesService.findOne(id);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    @Post()
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Unprocessable Entity.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 422, description: 'Entity Validation Error.'})
    async create(@Body() createRoleDto: CreateRoleDto) {
        // return 'This action adds a new user';
        try{
            return await this.rolesService.create(createRoleDto);
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

    @Delete(':id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Delete a model instance by {{id}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The record has been successfully deleted.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async remove(@Param('id') id: string): Promise<Role> {
        // return `This action removes a #${id} user`;
        try {
            return await this.rolesService.delete(id);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    // POST /roles/setRolesToUser/:id
    @Post('addRolesToUser/:id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set user roles'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addRolesToUser(@Param('id') id: string, @Body() rolesDto: RolesDto): Promise<any> {
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

    @Post('addRolesToGroup/:id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set group roles'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addRolesToGroup(@Param('id') id: string, @Body() rolesDto: RolesDto): Promise<any> {
        try {
            return this.rolesService.setRoles('group', id, rolesDto);
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
