import {generateString} from "./generate-string";

describe('generateString', () => {
    test('should generate a string with the given length', () => {
        expect(generateString(10)).toBeTruthy();
    });
});
