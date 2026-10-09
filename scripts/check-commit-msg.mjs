#!/usr/bin/env node
/** Conventional-commit message check (lefthook commit-msg). */
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) process.exit(0);
const msg = readFileSync(file, "utf8").trim();
if (!/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?: .+/.test(msg)) {
  console.error(
    "Commit message must be conventional: (feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert): <subject>"
  );
  process.exit(1);
}
