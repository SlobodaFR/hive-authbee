import { randomBytes } from 'crypto';

export const generateString = (length= 32): string => {
    return randomBytes(length).toString('base64');
}
