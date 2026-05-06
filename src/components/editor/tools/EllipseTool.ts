/**
 * @module tools/EllipseTool
 * @description Tool for creating ellipse elements.
 */

import { Ellipse } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

/**
 * Creates editable ellipse elements on the canvas.
 *
 * @example
 * ```ts
 * const ellipseTool = new EllipseTool();
 * const ellipse = ellipseTool.create({ x: 10, y: 10, width: 100, height: 80 });
 * ```
 */
export class EllipseTool extends Tool {
  readonly type = "ellipse" as const;

  /**
   * Creates a new Ellipse element at the specified position.
   *
   * @param options - Position and size options
   * @returns Configured Ellipse instance
   */
  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 0, height = 0 } = options;
    const defaults = this.defaults;

    return new Ellipse({
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
