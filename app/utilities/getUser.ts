import User from "@/models/User";
import { FastifyRequest } from "fastify";
import { decode } from "jsonwebtoken";

export default async (req: FastifyRequest) => {
    const authHeader = req.headers.authorization!.replace('Bearer ', '');
    const userId = decode(authHeader) as string;
    const user = await User.findById(parseInt(userId));
    if (!user) return;
    return user.transform();
};
