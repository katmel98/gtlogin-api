import { Controller, Get, Query, Param, Post, Body, Put, Delete,
            UseGuards, NotFoundException, BadRequestException, UnprocessableEntityException, 
            InternalServerErrorException, 
            UsePipes} from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PermissionsService } from './permissions.service';

import { Permission } from './interfaces/permission.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { RulesDto } from './dto/rules.dto';
import { RuleDto } from './dto/rule.dto';
import { GenerateIdPipe } from 'common/pipes/generate-id.pipe';

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
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Find a model instance by {{id}} from the data source.'})
    @ApiResponse({ status: 200, description: 'The records has been successfully queried.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async findOne(@Param('id') id: string): Promise<Permission> {
        try {
            return await this.permissionsService.findOne(id);
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
    async create(@Body() createPermissionDto: CreatePermissionDto) {
        // return 'This action adds a new user';
        try{
            return await this.permissionsService.create(createPermissionDto);
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
    async remove(@Param('id') id: string): Promise<Permission> {
        // return `This action removes a #${id} user`;
        try {
            return await this.permissionsService.delete(id);
        } catch (e){
            const message = e.message.message;
            if ( e.message.error === 'NOT_FOUND'){
                throw new NotFoundException(message);
            } else if ( e.message.error === 'ID_NOT_VALID'){
                throw new BadRequestException(message);
            }
        }
    }

    @Post('addRulesToPermission/:id')
    @UseGuards(AuthGuard('bearer'))
    @ApiOperation({ title: 'Set permission\'s rules'})
    @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
    @ApiResponse({ status: 400, description: 'Bad Request.'})
    @ApiResponse({ status: 401, description: 'Unauthorized.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 404, description: 'Not Found.'})
    async addRolesToGroup(@Param('id') id: string, @Body(new GenerateIdPipe()) rulesDto: RulesDto): Promise<any> {
        try {
            return this.permissionsService.setRules(id, rulesDto);
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
