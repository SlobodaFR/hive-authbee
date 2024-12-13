/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  coverageProvider: "v8",
  coverageDirectory: "unit-coverage",
  collectCoverage: true,
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};
