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
 */
export abstract class Tool implements ITool {
  /** The tool type identifier */
  readonly type: ToolType;

  /** Default values for this tool, loaded from defaultToolValues */
  readonly defaults: ToolDefaultValues;

  constructor(type: ToolType) {
    this.type = type;
    this.defaults = defaultToolValues[type];
  }

  /**
   * Creates a new Leafer element at the given position.
   * Must be implemented by subclasses.
   */
  abstract create(options: ToolCreateOptions): IUI;

  /**
   * Merges default values with provided overrides.
   */
  protected mergeDefaults(overrides: Partial<ToolDefaultValues> = {}): ToolDefaultValues {
    return { ...this.defaults, ...overrides };
  }
}
