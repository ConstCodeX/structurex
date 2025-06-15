#!/usr/bin/env node
import { run } from 'plop';
import path from 'node:path';
run({
  configPath: path.join(__dirname, 'plopfile.js'),
  cwd: process.cwd(),
  preload: [],
  configNameSearch: [],
  configBase: undefined,
  modulePath: undefined,
  modulePackage: {},
  configFiles: {},
  config: {},
  completion: undefined
}, {}, true);