import { Controller, Get, Param, Post, Body, Delete,
    UnprocessableEntityException, BadRequestException, InternalServerErrorException,
    NotFoundException,
    UseGuards} from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { Group } from './interfaces/group.interface';

import { CreateGroupDto } from './dto/create-group.dto';
import { RolesDto } from '../roles/dto/roles.dto';

import { RolesService } from '../roles/roles.service';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import { GroupsDto } from './dto/groups.dto';

@ApiUseTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {

constructor(private readonly groupsService: GroupsService,
            private readonly rolesService: RolesService){}

@Get()
@UseGuards(AuthGuard('bearer'))
@ApiOperation({ title: 'Find all instances of the model matched by filter from the data source.'})
@ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
@ApiResponse({ status: 401, description: 'Unauthorized.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@ApiResponse({ status: 404, description: 'Not Found.'})
async findAll(): Promise<Group[]> {
   return this.groupsService.findAll();
}

@Get(':id')
@UseGuards(AuthGuard('bearer'))
@ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
@ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
@ApiResponse({ status: 401, description: 'Unauthorized.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@ApiResponse({ status: 404, description: 'Not Found.'})
async findOne(@Param('id') id: string): Promise<Group> {
   try {
       return await this.groupsService.findOne(id);
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
async create(@Body() createGroupDto: CreateGroupDto) {
   // return 'This action adds a new user';
   try{
       return await this.groupsService.create(createGroupDto);
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
async remove(@Param('id') id: string): Promise<Group> {
   // return `This action removes a #${id} user`;
   try {
       return await this.groupsService.delete(id);
   } catch (e){
       const message = e.message.message;
       if ( e.message.error === 'NOT_FOUND'){
           throw new NotFoundException(message);
       } else if ( e.message.error === 'ID_NOT_VALID'){
           throw new BadRequestException(message);
       }
   }
}

    // POST /groups/:id/setGroups
    @Post(':id/setGroups')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set group roles'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addGroups(@Param('id') id: string, @Body() groupsDto: GroupsDto): Promise<any> {
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

    // POST /groups/:id/setRoles
    @Post(':id/setRoles')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set group roles'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addRoles(@Param('id') id: string, @Body() rolesDto: RolesDto): Promise<Group> {
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
