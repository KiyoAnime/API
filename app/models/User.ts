import { Model, model, Schema, Types } from "mongoose";

interface UserMethods {
    transform: () => SafeUserI;
    getProfile: () => ProfileI;
}

export interface UserI {
    _id: number;
    email: string;
    avatar?: string;
    username: string;
    password?: string;
    ipAddress?: string;
    profileName: string;
    initialIpAddress?: string;
    config: {
        publicEmail: boolean;
        publicProfile: boolean;
    };
    profile: {
        bio?: string;
        badges?: Types.Array<number>;
        gradient: { start: string; end: string; };
    };
}

export type ProfileI = Omit<SafeUserI, 'config'>;
export type SafeUserI = Omit<UserI, 'password' | 'ipAddress' | 'initialIpAddress'>;

export type UserModel = Model<UserI, {}, UserMethods>;
const userSchema = new Schema<UserI, UserModel, UserMethods>({
    _id: Number,
    email: { required: true, type: String },
    avatar: { required: false, type: String },
    username: { required: true, type: String },
    password: { required: true, type: String },
    ipAddress: { required: true, type: String },
    profileName: { required: true, type: String },
    initialIpAddress: { required: true, type: String },
    config: {
        publicEmail: { required: true, type: Boolean, default: false },
        publicProfile: { required: true, type: Boolean, default: true }
    },
    profile: {
        bio: { required: false, type: String },
        badges: { required: false, type: [Number] },
        gradient: {
            start: { required: true, type: String, default: '#0c0c0c' },
            end: { required: true, type: String, default: '#0c0c0c' }
        }
    }
}, { timestamps: true });

userSchema.method('getProfile', function () {
    const data = this as UserI;
    return {
        _id: data._id,
        email: data.config.publicEmail ? data.email : undefined,
        avatar: data.avatar,
        username: data.username,
        profileName: data.profileName,
        profile: {
            bio: data.profile.bio,
            badges: data.profile.badges,
            gradient: data.profile.gradient
        }
    };
});

userSchema.method('transform', function () {
    const data = this as UserI;
    return {
        _id: data._id,
        email: data.email,
        avatar: data.avatar,
        username: data.username,
        profileName: data.profileName,
        config: {
            publicEmail: data.config.publicEmail,
            publicProfile: data.config.publicProfile
        },
        profile: {
            bio: data.profile.bio,
            badges: data.profile.badges,
            gradient: data.profile.gradient
        }
    };
});

export default model('users', userSchema);
