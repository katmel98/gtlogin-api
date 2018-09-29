import { Document } from 'mongoose';

export interface Rule extends Document {
    readonly resource: string;
    readonly effect: string;
    readonly method: string;
}
