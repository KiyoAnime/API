import User from "@/models/User";
import badRequest from "@/res/badRequest";
import success from "@/res/success";
import { compareSync } from "bcrypt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { sign } from "jsonwebtoken";

export type LoginRequest = FastifyRequest<{ Body: { email: string; password: string; } }>;
export default async (app: FastifyInstance, req: LoginRequest, res: FastifyReply) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return badRequest(res, 'ERR.PARAM_INVALID', 'The provided email does not match any accounts.');
    const passCheck = compareSync(req.body.password, user.password!);
    if (!passCheck) return badRequest(res, 'ERR.PARAM_INVALID', 'Incorrect password provided.');
    const token = sign(user._id.toString(), process.env.APP_SECRET!);
    return success(res, { key: 'token', value: token }, { key: 'token', value: token });
};
