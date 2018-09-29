import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';
import { ObjectID } from 'mongodb';

@Injectable()
export class GenerateIdPipe implements PipeTransform<any> {
  transform(value: Array<any>, metadata: ArgumentMetadata): Array<any> {
    let id;
    value['rules'].forEach((item) => {

        if ( !(item.hasOwnProperty('_id')) ){
            id = new ObjectID();
            item._id = id;
        }
    });
    return value['rules'];
  }
}