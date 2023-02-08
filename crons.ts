import cache from "@/helpers/cache";
import { schedule } from "node-cron";

export default (app: Instance) => {
    schedule('0 */12 * * *', async () => {
        await cache(app);
    });
};
