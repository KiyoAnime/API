export default () => {
    if (!process.env.REDIS_URL) {
        console.error('Please specify a REDIS_URL environment variable.');
        process.exit(0);
    }
    if (!process.env.MONGO_URL) {
        console.error('Please specify a MONGO_URL environment variable.');
        process.exit(0);
    }
    if (!process.env.APP_SECRET) {
        console.error('Please specify a APP_SECRET environment variable.');
        process.exit(0);
    }
    if (!process.env.DISCORD_SECRET) {
        console.error('Please specify a DISCORD_SECRET environment variable.');
        process.exit(0);
    }
};
