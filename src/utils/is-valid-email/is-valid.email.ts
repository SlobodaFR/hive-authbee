import {z} from "zod";

export const isValidEmail = (email: string): boolean => {
    const schema = z.string().email();
    return schema.safeParse(email).success;
}
