import { Document } from 'mongoose';

export interface Permission extends Document {
    readonly id: string;
    readonly name: string;
    readonly descrip: string;
    readonly rules: string[];
    readonly created_at: number;
    readonly updated_at: number;
}
