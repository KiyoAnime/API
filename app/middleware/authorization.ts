import User from "@/models/User";
import unauthorized from "@/res/unauthorized";
import { FastifyReply, FastifyRequest } from "fastify";
import { verify } from "jsonwebtoken";

export default async (req: FastifyRequest, res: FastifyReply) => {
    if (!req.headers.authorization) return unauthorized(res, 'ERR.AUTHORIZATION.UNDEFINED', 'The authorization header was not provided.');
    const authHeader = req.headers.authorization.replace('Bearer ', '');
    verify(authHeader, process.env.APP_SECRET!, (err, _decoded) => {
        if (err) return unauthorized(res, 'ERR.AUTHORIZATION.INVALID', 'The provided authorization token is invalid.');
    });
};
