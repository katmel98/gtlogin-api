import { Controller, Param, Get, Post, Body,
         UnprocessableEntityException, BadRequestException,
         InternalServerErrorException, UseGuards, ReflectMetadata } from '@nestjs/common';
import { Product } from './interfaces/product.interface';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'common/guards/roles.guard';

@ApiUseTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
    constructor(private productService: ProductsService) {}

    @Get()
    @ReflectMetadata('data', { resource: 'products', method: 'query' })
    // @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    getProducts(): Promise<Product[]> {
      return this.productService.findAll();
    }

    @Get(':name')
    // @UseGuards(AuthGuard('jwt'))
    getProductByName(@Param('name') name: string): Promise<Product> {
      return this.productService.findByName(name);
    }

    @Post()
    @ReflectMetadata('data', { resource: 'products', method: 'create' })
    @ApiOperation({ title: 'Create a new instance of the model and persist it into the data source.' })
    @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
    @ApiResponse({ status: 400, description: 'Unprocessable Entity.'})
    @ApiResponse({ status: 403, description: 'Forbidden.'})
    @ApiResponse({ status: 422, description: 'Entity Validation Error.'})
    async create(@Body() createProductDto: CreateProductDto) {
      if (createProductDto && createProductDto.name && createProductDto.descrip) {
        try{
          return await this.productService.create(createProductDto);
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
  }
}