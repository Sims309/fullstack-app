import type { Config } from 'jest';

const config: Config = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json'  // Assure-toi que ce fichier existe et inclut les tests
    }]
  },
  moduleNameMapper: {
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@middleware/(.*)$': '<rootDir>/src/routes/middleware/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/$1'
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts'
  ],
  // Optionnel : pour afficher les tests en détail lors du run
  verbose: true
};

export default config;
