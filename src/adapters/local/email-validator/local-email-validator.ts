import {EmailValidator} from "../../../ports/input/email-validator";
import {isValidEmail} from "../../../utils/is-valid-email";

export class LocalEmailValidator implements EmailValidator {
    async isValid(email: string): Promise<boolean> {
        return Promise.resolve(isValidEmail(email));
    }
}
