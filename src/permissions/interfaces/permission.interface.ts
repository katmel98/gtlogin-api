import { Document } from 'mongoose';
import { Rule } from './rule.interface';

export interface Permission extends Document {
    readonly id: string;
    readonly name: string;
    readonly descrip: string;
    readonly rules: Rule[];
    readonly created_at: number;
    readonly updated_at: number;
}
