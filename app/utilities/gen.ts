import { randomInt } from 'crypto';

export const genId = () => {
    return randomInt(111111111111, 999999999999);
};
