import { model, Model, Schema } from "mongoose";

export interface WatchlistI {
    end?: Date;
    _id: number;
    start?: Date;
    user: number;
    anime: number;
    status: 'dropped' | 'planning' | 'paused' | 'watching' | 'rewatching' | 'completed';
}

export type WatchlistModel = Model<WatchlistI>;
// prettier-ignore
const watchlistSchema = new Schema<WatchlistI, WatchlistModel>({
    _id: Number,
    user: { required: true, type: Number },
    anime: { required: true, type: Number },
    status: { required: true, type: String },
    end: { required: false, type: Date },
    start: { required: false, type: Date }
}, { timestamps: true });

export default model('watchlists', watchlistSchema);
