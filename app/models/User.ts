import { Model, model, Schema, Types } from "mongoose";

interface UserMethod {
    transform: () => SafeUserI;
}

export interface UserI {
    _id: number;
    email: string;
    avatar?: string;
    username: string;
    password?: string;
    ipAddress?: string;
    profileName?: string;
    initialIpAddress?: string;
    badges: Types.Array<number>;
}

export type SafeUserI = Omit<UserI, 'password' | 'ipAddress' | 'initialIpAddress'>;
export type UserModel = Model<UserI, {}, UserMethod>;
const userSchema = new Schema<UserI, UserModel, UserMethod>({
    _id: Number,
    email: { required: true, type: String },
    avatar: { required: false, type: String },
    badges: { required: true, type: [Number] },
    username: { required: true, type: String },
    password: { required: true, type: String },
    ipAddress: { required: true, type: String },
    profileName: { required: false, type: String },
    initialIpAddress: { required: true, type: String }
}, { timestamps: true });

userSchema.method('transform', function () {
    const data = this as UserI;
    return {
        _id: data._id,
        email: data.email,
        avatar: data.avatar,
        badges: data.badges,
        username: data.username,
        profileName: data.profileName
    };
});

export default model('users', userSchema);
