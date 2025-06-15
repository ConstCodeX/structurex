/* ----------------------------------------------------------------------------- *\
   Structurex – Plop generators (v2)
   ▸ component   → Atom / Molecule / …  (class + types + wrapper + opc.)
   ▸ hook        → reusable Hook
   ▸ presenter   → Presenter (DTO → ViewModel)
\* ----------------------------------------------------------------------------- */

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

/* ========================================================================== */
/* default export (CommonJS) –  Plop exige module.exports = fn                */
/* ========================================================================== */
export = function (plop: NodePlopAPI): void {
  /* Helpers accesibles dentro de las plantillas ---------------------------- */
  plop.setHelper('folder', (t: TierKey) => TIERS[t].folder);
  plop.setHelper('suffix', (t: TierKey) => TIERS[t].suffix);
  plop.setHelper('base', (t: TierKey) => TIERS[t].base);

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
          /^[A-Z][A-Za-z0-9]+$/.test(v) || 'El nombre debe estar en PascalCase.',
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
    actions: (ans): AddActionConfig[] => {
      const { tier, withContainer, withTest } = ans as ComponentAnswers;
      const { folder, suffix, base } = TIERS[tier];

      /* Datos comunes que TODA plantilla necesita */
      const tplData = { base, suffix, folder };

      const dir = `src/${folder}/{{pascalCase name}}`;
      const acts: AddActionConfig[] = [
        /* 1. types.ts ------------------------------------------------------ */
        {
          type: 'add',
          path: `${dir}/types.ts`,
          templateFile: path.resolve(__dirname, 'templates/atom-types.hbs'),
          data: tplData,
        },
        /* 2. clase Atom|Mol|… --------------------------------------------- */
        {
          type: 'add',
          path: `${dir}/{{pascalCase name}}.${suffix}.tsx`,
          templateFile: path.resolve(__dirname, 'templates/atom-class.hbs'),
          data: tplData,
        },
        /* 3. wrapper index.ts --------------------------------------------- */
        {
          type: 'add',
          path: `${dir}/index.ts`,
          templateFile: path.resolve(__dirname, 'templates/atom-index.hbs'),
          data: tplData,
        },
      ];

      /* 4. Container opcional --------------------------------------------- */
      if (withContainer) {
        acts.push({
          type: 'add',
          path: `${dir}/{{pascalCase name}}.ctn.ts`,
          templateFile: path.resolve(__dirname, 'templates/container.hbs'),
          data: tplData,
        });
      }

      /* 5. Test opcional --------------------------------------------------- */
      if (withTest) {
        acts.push({
          type: 'add',
          path: `test/${folder}/{{pascalCase name}}.test.tsx`,
          templateFile: path.resolve(__dirname, 'templates/test.hbs'),
          data: tplData,
        });
      }

      /* 6. Barrels --------------------------------------------------------- */
      acts.push(
        {
          type: 'add',
          path: `src/${folder}/index.ts`,
          skipIfExists: true,
          template: '// AUTO-EXPORTS\n',
        },
        {
          // ⬇️  usamos 'append', pero lo casteamos para que TS no proteste
          ...({
            type: 'append',
            path: `src/${folder}/index.ts`,
            pattern: /(\/\/ AUTO-EXPORTS\n?)/,
            template: `export * from './{{pascalCase name}}';\n$1`,
          } as any),
        },
      );

      /* ------------------------------------------------------------------ */
      /* Barrel raíz (src/index.ts)                                         */
      /* ------------------------------------------------------------------ */
      acts.push(
        {
          type: 'add',
          path: 'src/index.ts',
          skipIfExists: true,
          template: `export * from './config';\nexport * from './core';\n\n// AUTO-EXPORTS\n`,
        },
        {
          ...({
            type: 'append',
            path: 'src/index.ts',
            pattern: /(\/\/ AUTO-EXPORTS\n?)/,
            template: `export * from './${folder}/{{pascalCase name}}';\n$1`,
          } as any),
        },
      );


      return acts;
    },
  });

  /* ------------------------------------------------------------------------ */
  /* HOOK GENERATOR                                                           */
  /* ------------------------------------------------------------------------ */
  plop.setGenerator('hook', {
    description: 'Genera un hook reusable (useX)',
    prompts : [{ type: 'input', name: 'name', message: 'Nombre del hook (PascalCase):' }],
    actions : [{
      type: 'add',
      path: 'src/hooks/use{{pascalCase name}}.ts',
      templateFile: path.resolve(__dirname, 'templates/hook.hbs'),
    }],
  });

  /* ------------------------------------------------------------------------ */
  /* PRESENTER GENERATOR                                                      */
  /* ------------------------------------------------------------------------ */
  plop.setGenerator('presenter', {
    description: 'Genera un presenter (DTO → ViewModel)',
    prompts : [{ type: 'input', name: 'name', message: 'Nombre del presenter (PascalCase):' }],
    actions : [{
      type: 'add',
      path: 'src/presenters/{{pascalCase name}}Presenter.ts',
      templateFile: path.resolve(__dirname, 'templates/presenter.hbs'),
    }],
  });
}