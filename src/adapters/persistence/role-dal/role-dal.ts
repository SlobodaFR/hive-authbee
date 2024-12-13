import {RoleRepository} from "../../../application/repositories/role";
import {Role} from "../../../application/domains/role";

export class RoleDAL implements RoleRepository {
    getById(id: string): Promise<Role | null> {
        throw new Error("Method not implemented.");
    }

    getByUserId(userId: string): Promise<Role[]> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<Role[]> {
        throw new Error("Method not implemented.");
    }

    create(name: string): Promise<Role> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
