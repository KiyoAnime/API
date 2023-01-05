import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { hashSync } from 'bcrypt';
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import { sign } from 'jsonwebtoken';
import { genId } from "@/utilities/gen";
import User from "@/models/User";

export type RegisterRequest = FastifyRequest<{ Body: { email: string; username: string; password: string; } }>;
export default async (app: FastifyInstance, req: RegisterRequest, res: FastifyReply) => {
    // const existingIp = await User.exists({ ip_address: req.ip });
    // if (existingIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', '');
    const existingEmail = await User.exists({ email: req.body.email });
    if (existingEmail) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Email is already in use.');
    const existingUsername = await User.exists({ username: req.body.username });
    if (existingUsername) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Username is already in use.');
    // const existingRegisterIp = await User.exists({ initial_ip_address: req.ip });
    // if (existingRegisterIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', '');

    const password = hashSync(req.body.password, 16);
    const id = genId();
    await User.create({
        _id: id,
        ipAddress: req.ip,
        password: password,
        email: req.body.email,
        initialIpAddress: req.ip,
        username: req.body.username,
    });

    const token = sign(id.toString(), process.env.APP_SECRET!);
    return success(res, null, { key: 'token', value: token });
};
