import { Document } from 'mongoose';

export interface Token extends Document {
    readonly access: string;
    readonly token: string;
}
