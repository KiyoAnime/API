export default (): string => {
    let callback = '';
    switch (process.argv[2]) {
        case '--dev':
            callback = 'http://127.0.0.1:3000/callback/discord'
            break;

        case '--canary':
            callback = 'https://canary.kiyo.moe/callback/discord'
            break;

        default:
            callback = 'https://kiyo.moe/callback/discord';
            break;
    };
    return callback;
};
