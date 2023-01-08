import { Model, model, Schema } from "mongoose";

interface UserMethod {
    transform: () => Omit<UserI, 'password'>;
}

interface UserI {
    _id: number;
    email: string;
    username: string;
    password?: string;
    ipAddress?: string;
    initialIpAddress?: string;
}

export type UserModel = Model<UserI, {}, UserMethod>;
const userSchema = new Schema<UserI, UserModel, UserMethod>({
    _id: Number,
    email: { required: true, type: String },
    username: { required: true, type: String },
    password: { required: true, type: String },
    ipAddress: { required: true, type: String },
    initialIpAddress: { required: true, type: String }
}, { timestamps: true });

userSchema.method('transform', function () {
    const data = this as UserI;
    delete data['password'];
    delete data['ipAddress'];
    delete data['initialIpAddress'];
    return data;
});

export default model('users', userSchema);
