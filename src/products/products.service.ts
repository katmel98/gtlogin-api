import { CreateProductDto } from './dto/create-product.dto';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
    constructor( @InjectModel('Product') private readonly productModel: Model<Product>) {}

    async create(product: CreateProductDto): Promise<Product> {
        try {
            const createdProduct = new this.productModel(product);
            return await createdProduct.save();
        } catch (e) {
            return e;
        }
    }

    async findAll(): Promise<Product[]> {
        return await this.productModel.find();
    }

    async findByName(name: string): Promise<Product> {
        const result = await this.productModel.find({ name });
        return result[0];
    }
}
