import {isValidEmail} from "./is-valid.email";

describe('is-valid-email', () => {
    test('should return false for invalid email', () => {
        expect(isValidEmail("")).toBe(false);
        expect(isValidEmail("foobar")).toBe(false);
    });
    test('should return true for valid email', () => {
        expect(isValidEmail("foo@b.ar")).toBe(true);
    });
});
