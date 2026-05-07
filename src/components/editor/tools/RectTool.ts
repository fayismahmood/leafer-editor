/**
 * @module tools/RectTool
 * @description Tool for creating rectangle elements.
 */

import { Rect } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";

export class RectTool extends ShapeTool {
  constructor() {
    super("rect");
  }

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
