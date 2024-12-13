import {Role} from "./role";
import {Token} from "./token";

export type User = {
    id: string;
    email: string;
    tokens?: Token[];
    roles?: Role[];
}
