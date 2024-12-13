import {User} from "../domains/user";

export interface UserRepository {
    upsert(email: string): Promise<User>;
}
