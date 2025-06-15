"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/cli/plopfile.ts
var plopfile_exports = {};
__export(plopfile_exports, {
  default: () => plopfile_default
});
module.exports = __toCommonJS(plopfile_exports);
var import_node_path = __toESM(require("path"));
var TIERS = {
  atom: { folder: "atoms", suffix: "atom", base: "Atom" },
  mol: { folder: "molecules", suffix: "mol", base: "Molecule" },
  org: { folder: "organisms", suffix: "org", base: "Organism" },
  tpl: { folder: "templates", suffix: "tpl", base: "Template" },
  pg: { folder: "pages", suffix: "pg", base: "Page" }
};
function plopfile_default(plop) {
  plop.setHelper("folder", (tier) => TIERS[tier].folder);
  plop.setHelper("suffix", (tier) => TIERS[tier].suffix);
  plop.setHelper("base", (tier) => TIERS[tier].base);
  plop.setGenerator("component", {
    description: "Genera un componente Structurex",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre del componente (PascalCase):",
        validate: (v) => /^[A-Z][A-Za-z0-9]+$/.test(v) || "El nombre debe estar en PascalCase."
      },
      {
        type: "list",
        name: "tier",
        message: "Tipo de componente:",
        choices: [
          { name: "Atom", value: "atom" },
          { name: "Molecule", value: "mol" },
          { name: "Organism", value: "org" },
          { name: "Template", value: "tpl" },
          { name: "Page", value: "pg" }
        ]
      },
      {
        type: "confirm",
        name: "withContainer",
        message: "\xBFDesea un Container?",
        default: false
      },
      {
        type: "confirm",
        name: "withTest",
        message: "\xBFDesea un Test?",
        default: true
      }
    ],
    actions: (answers) => {
      const { tier, withContainer, withTest } = answers;
      const { folder, suffix, base } = TIERS[tier];
      const componentDir = `src/${folder}/{{pascalCase name}}`;
      const actions = [];
      actions.push({
        type: "add",
        path: `${componentDir}/{{pascalCase name}}.${suffix}.tsx`,
        templateFile: import_node_path.default.resolve(__dirname, "templates/component.hbs"),
        data: { base }
      });
      if (withContainer) {
        actions.push({
          type: "add",
          path: `${componentDir}/{{pascalCase name}}.ctn.ts`,
          templateFile: import_node_path.default.resolve(__dirname, "templates/container.hbs"),
          data: { suffix }
        });
      }
      if (withTest) {
        actions.push({
          type: "add",
          path: `test/${folder}/{{pascalCase name}}.test.tsx`,
          templateFile: import_node_path.default.resolve(__dirname, "templates/test.hbs"),
          data: { folder, suffix }
        });
      }
      actions.push({
        type: "add",
        path: `${componentDir}/index.ts`,
        skipIfExists: true,
        template: `export * from './{{pascalCase name}}.${suffix}';
`
      });
      actions.push({
        type: "add",
        path: `src/${folder}/index.ts`,
        skipIfExists: true,
        template: "// AUTO-EXPORTS\n"
      });
      actions.push({
        type: "add",
        path: `src/${folder}/index.ts`,
        template: `export * from './{{pascalCase name}}';
`
      });
      actions.push({
        type: "add",
        path: "src/index.ts",
        skipIfExists: true,
        template: `export * from './config';
export * from './core';

// AUTO-EXPORTS
`
      });
      actions.push({
        type: "add",
        path: "src/index.ts",
        template: `export * from './${folder}/{{pascalCase name}}';
`
      });
      return actions;
    }
  });
}
