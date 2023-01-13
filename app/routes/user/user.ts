import Badge, { BadgeI } from "@/models/Badge";
import success from "@/res/success";
import getUser from "@/utilities/getUser";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async (app: FastifyInstance, req: FastifyRequest, res: FastifyReply) => {
    const user = await getUser(req);
    let badges: BadgeI[] = [];
    if (user?.badges[0]) {
        for (const badge of user.badges) {
            const badgeItem = await Badge.findById(badge);
            if (badgeItem) badges.push(badgeItem);
        };
    }
    return success(res, Object.assign(user!, { badges: badges }));
};
