import { Model, model, Schema } from "mongoose";

interface UserModelI {
    _id: number;
    email: string;
    username: string;
    password: string;
    ip_address: string;
    initial_ip_address: string;
}

export type UserModel = Model<UserModelI>;
const userSchema = new Schema<UserModelI>({
    _id: Number,
    email: { required: true, type: String },
    username: { required: true, type: String },
    password: { required: true, type: String },
    ip_address: { required: true, type: String },
    initial_ip_address: { required: true, type: String }
}, { timestamps: true });

export default model('users', userSchema);
