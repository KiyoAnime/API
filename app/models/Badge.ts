import { model, Model, Schema } from "mongoose";

export interface BadgeI {
    _id: number;
    label: string;
    color: string;
    public: boolean;
}

export type BadgeModel = Model<BadgeI>;
const badgeSchema = new Schema<BadgeI, BadgeModel>({
    _id: Number,
    label: { required: true, type: String },
    color: { required: true, type: String },
    public: { required: true, type: Boolean }
});

export default model('badges', badgeSchema);
