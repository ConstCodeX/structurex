/**
 * @structurex/eslint-config
 * Reglas de arquitectura para proyectos que consumen Structurex.
 *
 * Uso (en el proyecto del usuario):
 *   npm i -D eslint @structurex/eslint-config eslint-plugin-boundaries
 *   // eslint.config.js
 *   import structurex from '@structurex/eslint-config';
 *   export default [structurex];
 */

import path from 'node:path';

/**
 * Helper para convertir patrones de capa en reglas allow/element.
 */
function layer(type, pattern, allowed) {
  return {
    element: { type, pattern },
    rule: { from: type, allow: allowed },
  };
}

const layers = [
  layer('atoms', 'src/atoms/*', ['atoms']),
  layer('molecules', 'src/molecules/*', ['atoms', 'molecules']),
  layer('organisms', 'src/organisms/*', ['atoms', 'molecules', 'organisms']),
  layer('templates', 'src/templates/*', ['atoms', 'molecules', 'organisms', 'templates']),
  layer('pages', 'src/pages/*', ['atoms', 'molecules', 'organisms', 'templates', 'pages']),
  // lógica
  layer('hooks', 'src/**/hooks/*', ['atoms', 'molecules', 'organisms', 'templates', 'pages', 'hooks']),
  layer('presenters', 'src/**/presenters/*', ['presenters']),
  layer('containers', 'src/**/containers/*', ['atoms', 'molecules', 'organisms', 'templates', 'pages', 'hooks', 'presenters']),
];

export default {
  plugins: {
    boundaries: require('eslint-plugin-boundaries'),
  },
  rules: {
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: layers.map((l) => l.rule),
      },
    ],
  },
  settings: {
    'boundaries/elements': layers.map((l) => l.element),
    'import/resolver': {
      node: { extensions: ['.js', '.ts', '.tsx'] },
    },
  },
};
