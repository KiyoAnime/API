import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type RegisterRequest = FastifyRequest<{ Body: { email: string; username: string; password: string; } }>;
export default (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    
};
