/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@utils$': '<rootDir>/src/utils/index.ts',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@domains/(.*)$': '<rootDir>/src/domains/$1',
        '^@externalServices/(.*)$': '<rootDir>/src/externalServices/$1'
    },
};
