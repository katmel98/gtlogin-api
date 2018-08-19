import { Document } from 'mongoose';
import { Token } from './token.interface';


export interface User extends Document {
    readonly  _id: string;
    readonly name: string;
    readonly surname: string;
    readonly lastname: string;
    readonly password: string;
    readonly email: string;
    readonly tokens: Token[];
    readonly roles: string[];
    readonly created_at: number;
    readonly updated_at: number;
}
