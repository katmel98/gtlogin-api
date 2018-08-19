import { Document } from 'mongoose';

export interface Group extends Document {
    readonly id: string;
    readonly name: string;
    readonly descrip: string;
    readonly roles: string[];
    readonly created_at: number;
    readonly updated_at: number;
}
