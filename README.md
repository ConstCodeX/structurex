# Structurex

**Structurex** is a framework‑agnostic, strongly‑typed toolkit for building scalable UI design systems with a clean architecture mindset.

- ✨ Atomic Design hierarchy (Atom → Molecule → Organism → Template → Page)
- 🧩 Clear split between presentation (`UIComponent`) and business logic (`ContainerComponent`)
- 🛠 CLI generator for boilerplate‑free components, containers and tests
- 🛡 Architecture rules enforced via an ESLint preset (`@structurex/eslint-config`)
- 🏗 No runtime dependency on React, Vue, Svelte… — integrate with any renderer

---

## 1 · Installation

```bash
npm i structurex         # runtime library
npm i -D eslint @structurex/eslint-config eslint-plugin-boundaries  # (optional) rules
```

---

## 2 · Bootstrapping in your project

Pick *once* where your `render()` methods will output — a DOM node, a virtual‑dom tree, Markdown… it’s your call.

```ts
// structurex.config.ts (top‑level of your code‑base)
import { setRenderOutput } from 'structurex';

setRenderOutput<HTMLElement>();  // or React.ReactNode, string, VNode, …
```

> The generic is erased at runtime; it only drives TypeScript.

Add the file to `tsconfig.json` so it’s included in compilation.

---

## 3 · Scaffolding components

The library ships with an interactive Plop generator:

```bash
npx structurex component
```

It will ask:

1. Component name (PascalCase)
2. Tier — atom | mol | org | tpl | pg
3. Add a `Container` file?
4. Add a Jest test?

Structurex then creates the proper folder hierarchy, barrels (`index.ts`), tests inside `test/<tier>/`, and keeps `src/index.ts` auto‑exporting everything.

---

## 4 · Core classes at a glance

```ts
import { Atom, ContainerComponent, Hook, Presenter } from 'structurex';

/* Atom ------------------------------------------------------------------*/
export interface ButtonProps {
  label: string;
}

export class Button extends Atom<ButtonProps> {
  public render() {
    return document.createTextNode(this.props.label);
  }
}

/* Container -------------------------------------------------------------*/
export interface CounterState { value: number }

export class CounterContainer extends ContainerComponent<CounterState, {}> {
  protected getInitialState(): CounterState { return { value: 0 }; }
  public increment() { this.setState({ value: this.state.value + 1 }); }
  public render() { return String(this.state.value); }
}

/* Hook ------------------------------------------------------------------*/
export class UseDate extends Hook<Date> {
  public execute() { return new Date(); }
}

/* Presenter -------------------------------------------------------------*/
export class UserPresenter extends Presenter<UserDto, UserVM> {
  public map(dto: UserDto): UserVM { return { fullName: `${dto.first} ${dto.last}` }; }
}
```

---

## 5 · Enforcing architecture with ESLint

```bash
npm i -D eslint @structurex/eslint-config eslint-plugin-boundaries
```

Create `eslint.config.js` at repo root:

```js
import structurex from '@structurex/eslint-config';

export default [structurex];   // add other configs as needed
```

Your editor will now warn if:

- An **Atom** imports a Molecule or Organism.
- A **hook** lives in `atoms/`.
- Any layer breaks the dependency rule defined by Atomic Design.

---

Contributions welcome! Open an issue or PR on GitHub.

---

## License

MIT © 2025 Víctor Larco

