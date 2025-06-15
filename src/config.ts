/* eslint-disable @typescript-eslint/no-empty-function */
/**
 * Structurex – base configuration layer
 * -------------------------------------
 * This file lets a host application declare – at **compile time** – the
 * concrete type that every `render()` method of a Structurex component
 * will return.  The mechanism relies exclusively on TypeScript’s type
 * system; no runtime state is kept and the generated JavaScript is just
 * an empty stub.
 *
 * Usage in the consuming project:
 * ```ts
 * import { setRenderOutput } from 'structurex';
 *
 * // Suppose your render methods always return an `HTMLElement`.
 * setRenderOutput<HTMLElement>();
 *
 * // (Optional but recommended) tell the compiler globally:
 * declare module 'structurex' {
 *   interface StructurexConfig {
 *     renderOutput: HTMLElement;
 *   }
 * }
 * ```
 */

/**
 * Internal configuration contract – **do not** implement this interface
 * directly; instead augment it from the host application as shown above.
 */
export interface StructurexConfig {
  /** Placeholder for the type produced by `render()`. */
  renderOutput: unknown;
}

/**
 * Convenience alias with the selected render-output type.
 */
export type RenderOutput = StructurexConfig['renderOutput'];

/**
 * Registers the render-output type for the current project.
 *
 * The generic parameter `T` is **erased** during compilation, therefore
 * this function is a no-op at runtime – its sole purpose is to give the
 * compiler a point where `T` can be captured and validated.
 */
export function setRenderOutput<T = unknown>(): void {
  /* noop – type-level side-effect only */
}

/**
 * **For internal use only.**  Allows base classes to refer to the chosen
 * render-output type without exposing the implementation details.  The
 * function must never run; it merely provides a typed value in the type
 * space.
 */
export function getRenderOutput(): RenderOutput {
  throw new Error(
    'getRenderOutput should never be executed – it exists purely for compile-time typing.',
  );
}