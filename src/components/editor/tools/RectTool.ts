/**
 * @module tools/RectTool
 * @description Tool for creating rectangle elements.
 */

import { Rect } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

/**
 * Creates editable rectangle elements on the canvas.
 *
 * @example
 * ```ts
 * const rectTool = new RectTool();
 * const rect = rectTool.create({ x: 10, y: 10, width: 100, height: 80 });
 * ```
 */
export class RectTool extends Tool {
  constructor() {
    super("rect");
  }

  /**
   * Creates a new Rect element at the specified position.
   *
   * @param options - Position and size options
   * @returns Configured Rect instance
   */
  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 0, height = 0 } = options;
    const defaults = this.defaults;

    return new Rect({
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
