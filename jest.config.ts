import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'app/api/**/route.{ts,tsx}',
    '!app/api/auth/**/*.{ts,tsx}',
    'lib/utils.ts'
  ],
}
 
export default createJestConfig(config)
