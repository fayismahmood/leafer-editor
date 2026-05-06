/**
 * @module tools/StarTool
 * @description Tool for creating star elements.
 */

import { Star } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

/**
 * Creates editable star elements on the canvas.
 *
 * @example
 * ```ts
 * const starTool = new StarTool();
 * const star = starTool.create({ x: 10, y: 10, width: 100, height: 100 });
 * ```
 */
export class StarTool extends Tool {
  constructor() {
    super("star");
  }

  /**
   * Creates a new Star element at the specified position.
   *
   * @param options - Position and size options
   * @returns Configured Star instance
   */
  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 100, height = 100 } = options;
    const defaults = this.defaults;

    
    return new Star({
      x,
      y,
      width,
      height,
      fill: defaults.fill,
      stroke: defaults.stroke,
      strokeWidth: defaults.strokeWidth,
      editable: defaults.editable,
    });
  }
}
