import { randomInt } from "crypto"

export const genId = () => {
    return randomInt(0o0, 9999999999);
};
