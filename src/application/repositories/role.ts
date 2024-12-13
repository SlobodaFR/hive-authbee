import {Role} from "../domains/role";

export interface RoleRepository {
    getById(id: string): Promise<Role | null>;

    getByUserId(userId: string): Promise<Role[]>;

    getAll(): Promise<Role[]>;

    create(name: string): Promise<Role>;

    delete(id: string): Promise<void>;
}
