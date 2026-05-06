/**
 * @module tools/Tool
 * @description Base abstract class for all tool implementations.
 */

import type { IUI } from "leafer-ui";
import type { ToolType } from "#/store/editor";
import type { ITool, ToolCreateOptions, ToolDefaultValues } from "./types";
import { defaultToolValues } from "./defaults";

/**
 * Abstract base class for editor tools.
 * Provides common functionality and enforces the ITool contract.
 *
 * @example
 * ```ts
 * class RectTool extends Tool {
 *   readonly type = 'rect';
 *   create(options) { return new Rect({ ... }); }
 * }
 * ```
 */
export abstract class Tool implements ITool {
  /** The tool type identifier */
  abstract readonly type: ToolType;

  /** Default values for this tool, loaded from defaultToolValues */
  readonly defaults: ToolDefaultValues;

  constructor() {    
    this.defaults = defaultToolValues[this.type];
  }

  /**
   * Creates a new Leafer element at the given position.
   * Must be implemented by subclasses.
   *
   * @param options - Position and size options
   * @returns The created Leafer UI element
   */
  abstract create(options: ToolCreateOptions): IUI;

  /**
   * Merges default values with provided overrides.
   *
   * @param overrides - Partial values to override defaults
   * @returns Merged tool default values
   */
  protected mergeDefaults(overrides: Partial<ToolDefaultValues> = {}): ToolDefaultValues {
    return { ...this.defaults, ...overrides };
  }
}
