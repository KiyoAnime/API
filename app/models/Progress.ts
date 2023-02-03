import { model, Model, Schema } from 'mongoose';

export interface ProgressI {
    _id: number;
    user: number;
    anime: number;
    episode: number;
    progress: number;
}

export type ProgressModel = Model<ProgressI>;
// prettier-ignore
const progressSchema = new Schema<ProgressI, ProgressModel>({
    _id: Number,
    user: { required: true, type: Number },
    anime: { required: true, type: Number },
    episode: { required: true, type: Number },
    progress: { required: true, type: Number }
}, { timestamps: true });

export default model('progress', progressSchema);
