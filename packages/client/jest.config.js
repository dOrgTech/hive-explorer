const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  clearMocks: true,
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^components/(.*)$': '<rootDir>/components/$1',
    '^constants/(.*)$': '<rootDir>/constants/$1',
    '^styles/(.*)$': '<rootDir>/styles/$1',
    '^types/(.*)$': '<rootDir>/types/$1',
    '^utils/(.*)$': '<rootDir>/utils/$1'
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: '<rootDir>/reports/client-coverage'
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
