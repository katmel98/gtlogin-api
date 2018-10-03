import { Document } from 'mongoose';
import { Permission } from 'permissions/interfaces/permission.interface';

export interface Role extends Document {
    readonly  _id: string;
    readonly name: string;
    readonly descrip: string;
    readonly permissions: string[];
    readonly created_at: number;
    readonly updated_at: number;
}
