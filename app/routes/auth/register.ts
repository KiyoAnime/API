import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getXataClient, XataClient } from "@xata";
import { hashSync } from 'bcrypt';
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import { sign } from 'jsonwebtoken';
import { genId } from "@/utilities/gen";
import User, { UserModel } from "@/models/User";

export type RegisterRequest = FastifyRequest<{ Body: { email: string; username: string; password: string; } }>;
export default async (app: FastifyInstance, req: RegisterRequest, res: FastifyReply) => {
    const xata = getXataClient();

    await validate(xata, req, res);
    //await validateMongo(User, req, res);
    const password = hashSync(req.body.password, 16);
    const uid = genId();
    // const user = await User.create({
    //     _id: uid,
    //     password: password,
    //     ip_address: req.ip,
    //     email: req.body.email,
    //     username: req.body.username,
    //     initial_ip_address: req.ip
    // });
    const user = await xata.db.users.create({
        uid: uid,
        password: password,
        ip_address: req.ip,
        created_at: new Date,
        updated_at: new Date,
        email: req.body.email,
        username: req.body.password,
        register_ip_address: req.ip
    });

    const token = sign(uid.toString(), process.env.APP_SECRET!);
    return success(res, user, { key: 'token', value: token });
};

async function validate(xata: XataClient, req: RegisterRequest, res: FastifyReply) {
    const existingIp = await xata.db.users.filter({ ip_address: req.ip }).getFirst();
    if (existingIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'An account with this ip address already exists.');
    const existingEmail = await xata.db.users.filter({ email: req.body.email }).getFirst();
    if (existingEmail) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Email is already registed.');
    const existingUsername = await xata.db.users.filter({ username: req.body.username }).getFirst();
    if (existingUsername) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Username is already registered.');
    const existingRegisterIp = await xata.db.users.filter({ register_ip_address: req.ip }).getFirst();
    if (existingRegisterIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'An account with this ip address already exists.');
};

async function validateMongo(user: UserModel, req: RegisterRequest, res: FastifyReply) {
    const existingIp = await user.exists({ ip_address: req.ip });
    if (existingIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'An account with this ip address already exists.');
    const existingEmail = await user.exists({ email: req.body.email });
    if (existingEmail) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Email is already registed.');
    const existingUsername = await user.exists({ username: req.body.username });
    if (existingUsername) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'Username is already registered.');
    const existingRegisterIp = await user.exists({ initial_ip_address: req.ip });
    if (existingRegisterIp) return badRequest(res, 'ERR.DUPLICATE_ACCOUNT', 'An account with this ip address already exists.');
};
