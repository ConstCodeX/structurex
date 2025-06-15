// -----------------------------------------------------------------------------
// Structurex – Core abstractions (framework-agnostic)
// -----------------------------------------------------------------------------

import type { RenderOutput } from "./config";

/*
 * -----------------------------------------------------------------------------------------------------------------
 * AtomicComponent – base of the entire hierarchy
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class AtomicComponent<TProps = unknown> {
  /**
   * Components receive their data through a strongly-typed, immutable `props` object.
   */
  protected constructor(protected readonly props: Readonly<TProps>) {}

  /**
   * Every concrete component must implement `render()` and return the host-defined
   * `RenderOutput` type (HTMLElement, string, virtual vnode, etc.).
   */
  public abstract render(): RenderOutput;
}

/*
 * -----------------------------------------------------------------------------------------------------------------
 * UIComponent – purely presentational, no side-effects
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class UIComponent<TProps = unknown> extends AtomicComponent<TProps> {}

/*
 * -----------------------------------------------------------------------------------------------------------------
 * Atomic-design tiers – semantics only (they do not add behaviour)
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class Atom<TProps = unknown> extends UIComponent<TProps> {}

export abstract class Molecule<TProps = unknown> extends UIComponent<TProps> {}

export abstract class Organism<TProps = unknown> extends UIComponent<TProps> {}

export abstract class Template<TProps = unknown> extends UIComponent<TProps> {}

export abstract class Page<TProps = unknown> extends UIComponent<TProps> {}

/*
 * -----------------------------------------------------------------------------------------------------------------
 * ContainerComponent – owns state and business logic, delegates UI to an inner
 * presentation component (composition recommended but not enforced here)
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class ContainerComponent<TState = unknown, TProps = unknown>
  extends AtomicComponent<TProps>
{
  /** Internal, immutable snapshot of the component state */
  protected state!: Readonly<TState>;

  constructor(props: Readonly<TProps>) {
    super(props);
    this.state = this.getInitialState();
  }

  /**
   * Provide the initial state for this container. Called once in the ctor.
   */
  protected abstract getInitialState(): TState;

  /**
   * Imperative setter for derived classes. A specific renderer/runtime can
   * replace this with a reactive alternative.
   */
  protected setState(partial: Partial<TState>): void {
    this.state = { ...this.state, ...partial } as TState;
  }
}

/*
 * -----------------------------------------------------------------------------------------------------------------
 * Hook – reusable, side-effect-free business logic entity
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class Hook<TOutput = unknown> {
  /** Execute the hook and return its outcome */
  public abstract execute(): TOutput;
}

/*
 * -----------------------------------------------------------------------------------------------------------------
 * Presenter – maps a raw DTO into a view-model tailored for UI consumption
 * -----------------------------------------------------------------------------------------------------------------
 */
export abstract class Presenter<TDto = unknown, TViewModel = unknown> {
  /** Transform a data-transfer object into something that a UI can consume */
  public abstract map(dto: TDto): TViewModel;
}