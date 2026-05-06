/**
 * @module tools/LineTool
 * @description Tool for creating line elements.
 */

import { Line } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

/**
 * Creates editable line elements on the canvas.
 *
 * @example
 * ```ts
 * const lineTool = new LineTool();
 * const line = lineTool.create({ x: 10, y: 10, width: 100, height: 0 });
 * ```
 */
export class LineTool extends Tool {
  readonly type = "line" as const;

  /**
   * Creates a new Line element at the specified position.
   * Uses width/height to determine the end point.
   *
   * @param options - Position and size options
   * @returns Configured Line instance
   */
  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 0, height = 0 } = options;
    const defaults = this.defaults;

    return new Line({
      x,
      y,
      points: [0, 0, width, height],
      stroke: defaults.stroke,
      strokeWidth: defaults.strokeWidth,
      editable: defaults.editable,
    });
  }
}
