import {TokenGenerator} from "../../../ports/input/token-generator";
import {generateString} from "../../../utils/generate-string";

export class LocalTokenGenerator implements TokenGenerator {
    async generateToken(): Promise<string> {
        return Promise.resolve(generateString());
    }
}
