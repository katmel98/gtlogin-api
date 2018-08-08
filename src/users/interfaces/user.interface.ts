import { Document } from 'mongoose';
import { Token } from './token.interface';

export interface User extends Document {
    readonly  id: string;
    readonly name: string;
    readonly surname: string;
    readonly lastname: string;
    readonly password: string;
    readonly email: string;
    readonly tokens: Token[];
    readonly created_at: number;
    readonly updated_at: number;
}
