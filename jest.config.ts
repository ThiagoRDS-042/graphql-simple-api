import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  bail: true,
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFilesAfterEnv: ["<rootDir>/test/utils/jest-after-env.ts"],
  collectCoverageFrom: ["./src/**/use-cases/*.ts", "./src/**/entities/*.ts"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  maxWorkers: 1,
};

export default config;
