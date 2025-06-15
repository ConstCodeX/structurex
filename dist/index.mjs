#!/usr/bin/env node

// src/cli/index.ts
import { run } from "plop";
import path from "path";
run({
  configPath: path.join(__dirname, "plopfile.js"),
  cwd: process.cwd(),
  preload: [],
  configNameSearch: [],
  configBase: void 0,
  modulePath: void 0,
  modulePackage: {},
  configFiles: {},
  config: {},
  completion: void 0
}, {}, true);
