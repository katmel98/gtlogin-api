import { Document } from 'mongoose';

export interface Token extends Document {
    readonly access: string;
    readonly token: string;
    readonly expires_in: number;
    readonly created_at: number;
    readonly expires_at: number;
}
