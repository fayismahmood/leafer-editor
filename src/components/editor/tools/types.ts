/**
 * @module tools/types
 * @description Type definitions for the tool system.
 */

import type { IUI } from "leafer-ui";
import type { ToolType } from "#/store/editor";

/**
 * Configuration options for creating a tool element.
 */
export interface ToolCreateOptions {
  /** X coordinate for the element */
  x: number;
  /** Y coordinate for the element */
  y: number;
  /** Width of the element (default: 0) */
  width?: number;
  /** Height of the element (default: 0) */
  height?: number;
}

/**
 * Default style values applied to tool elements.
 */
export interface ToolDefaultValues {
  /** Fill color */
  fill: string;
  /** Stroke color */
  stroke: string;
  /** Stroke width in pixels */
  strokeWidth: number;
  /** Element opacity (0-1) */
  opacity: number;
  /** Whether the element is editable */
  editable: boolean;
}

/**
 * Interface that all tool implementations must satisfy.
 */
export interface ITool {
  /** The tool type identifier */
  readonly type: ToolType;
  /** Default values for this tool */
  readonly defaults: ToolDefaultValues;
  /**
   * Creates a new Leafer element at the given position.
   * @param options - Position and size options
   * @returns The created Leafer UI element
   */
  create(options: ToolCreateOptions): IUI;
}
