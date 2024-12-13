import {UserRepository} from "../../../application/repositories/user";
import {User} from "../../../application/domains/user";
import {PrismaClient} from "@prisma/client";

export class UserDAL implements UserRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    upsert(email: string): Promise<User> {
        return this.prismaClient.user.upsert({
            where: {
                email
            },
            create: {
                email
            },
            update: {}
        });
    }
}
