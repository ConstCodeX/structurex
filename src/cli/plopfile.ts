/* -----------------------------------------------------------------------------

Structurex – Plop generators (v2)

▸ component   → Atom / Molecule / … (class + types + wrapper)

▸ hook        → reusable Hook

▸ presenter   → Presenter (DTO → ViewModel)

---------------------------------------------------------------------------*/

import path from 'node:path';
import type { AddActionConfig, NodePlopAPI } from 'plop';

interface ComponentAnswers {
  name: string;
  tier: 'atom' | 'mol' | 'org' | 'tpl' | 'pg';
  withContainer: boolean;
  withTest: boolean;
}

const TIERS = {
  atom: { folder: 'atoms', suffix: 'atom', base: 'Atom' },
  mol: { folder: 'molecules', suffix: 'mol', base: 'Molecule' },
  org: { folder: 'organisms', suffix: 'org', base: 'Organism' },
  tpl: { folder: 'templates', suffix: 'tpl', base: 'Template' },
  pg: { folder: 'pages', suffix: 'pg', base: 'Page' },
} as const;

type TierKey = keyof typeof TIERS;

export default function (plop: NodePlopAPI): void {
  /* ------------------------------------------------------------------------ /
  / Helpers para usar en las .hbs                                            /
  / ------------------------------------------------------------------------ */
  plop.setHelper('folder', (tier: TierKey) => TIERS[tier].folder);
  plop.setHelper('suffix', (tier: TierKey) => TIERS[tier].suffix);
  plop.setHelper('base', (tier: TierKey) => TIERS[tier].base);

  /* ------------------------------------------------------------------------ /
  / COMPONENT GENERATOR                                                      /
  / ------------------------------------------------------------------------ */
  plop.setGenerator('component', {
    description: 'Genera un componente Structurex (Atom/Mol/Org/…) ',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Nombre del componente (PascalCase):',
        validate: (v: string) =>
          /^[A-Z][A-Za-z0-9]+$/.test(v) || 'El nombre debe estar en PascalCase.'
      },
      {
        type: 'list',
        name: 'tier',
        message: 'Tipo de componente:',
        choices: [
          { name: 'Atom', value: 'atom' },
          { name: 'Molecule', value: 'mol' },
          { name: 'Organism', value: 'org' },
          { name: 'Template', value: 'tpl' },
          { name: 'Page', value: 'pg' },
        ],
      },
      {
        type: 'confirm',
        name: 'withContainer',
        message: '¿Desea un Container?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'withTest',
        message: '¿Desea un Test?',
        default: true,
      },
    ],
    actions: (answers): AddActionConfig[] => {
      const { tier, withContainer, withTest } = answers as ComponentAnswers;
      const { folder, suffix, base } = TIERS[tier];

      const componentDir = `src/${folder}/{{pascalCase name}}`;
      const actions: AddActionConfig[] = [];

      /* 1. types.ts */
      actions.push({
        type: 'add',
        path: `${componentDir}/types.ts`,
        templateFile: path.resolve(__dirname, 'templates/atom-types.hbs'),
      });

      /* 2. clase Atom|Molecule|… */
      actions.push({
        type: 'add',
        path: `${componentDir}/{{pascalCase name}}.${suffix}.tsx`,
        templateFile: path.resolve(__dirname, 'templates/atom-class.hbs'),
        data: { base, suffix },
      });

      /* 3. wrapper index.ts */
      actions.push({
        type: 'add',
        path: `${componentDir}/index.ts`,
        templateFile: path.resolve(__dirname, 'templates/atom-index.hbs'),
        data: { base, suffix },
      });

      /* 4. Container opcional */
      if (withContainer) {
        actions.push({
          type: 'add',
          path: `${componentDir}/{{pascalCase name}}.ctn.ts`,
          templateFile: path.resolve(__dirname, 'templates/container.hbs'),
          data: { suffix },
        });
      }

      /* 5. Test opcional */
      if (withTest) {
        actions.push({
          type: 'add',
          path: `test/${folder}/{{pascalCase name}}.test.tsx`,
          templateFile: path.resolve(__dirname, 'templates/test.hbs'),
          data: { folder, suffix },
        });
      }

      /* 6. Barrels auto‑exports */
      actions.push({
        type: 'add',
        path: `src/${folder}/index.ts`,
        skipIfExists: true,
        template: '// AUTO-EXPORTS\n',
      });
      actions.push({
        type: 'add',
        path: `src/${folder}/index.ts`,
        template: `export * from './{{pascalCase name}}';\n`,
      });

      actions.push({
        type: 'add',
        path: 'src/index.ts',
        skipIfExists: true,
        template: `export * from './config';\nexport * from './core';\n\n// AUTO-EXPORTS\n`,
      });
      actions.push({
        type: 'add',
        path: 'src/index.ts',
        template: `export * from './${folder}/{{pascalCase name}}';\n`,
      });

      return actions;
    },
  });

  /* ------------------------------------------------------------------------ /
  / HOOK GENERATOR                                                           /
  / ------------------------------------------------------------------------ */
  plop.setGenerator('hook', {
    description: 'Genera un hook reusable (useX)',
    prompts: [
      { type: 'input', name: 'name', message: 'Nombre del hook (PascalCase):' },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/hooks/use{{pascalCase name}}.ts',
        templateFile: path.resolve(__dirname, 'templates/hook.hbs'),
      },
    ],
  });

  /* ------------------------------------------------------------------------ /
  / PRESENTER GENERATOR                                                      /
  / ------------------------------------------------------------------------ */
  plop.setGenerator('presenter', {
    description: 'Genera un presenter (DTO → ViewModel)',
    prompts: [
      { type: 'input', name: 'name', message: 'Nombre del presenter (PascalCase):' },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/presenters/{{pascalCase name}}Presenter.ts',
        templateFile: path.resolve(__dirname, 'templates/presenter.hbs'),
      },
    ],
  });
}