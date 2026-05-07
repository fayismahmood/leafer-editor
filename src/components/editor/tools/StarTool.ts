/**
 * @module tools/StarTool
 * @description Tool for creating star elements.
 */

import { Star } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";

export class StarTool extends ShapeTool {
  constructor() {
    super("star");
  }

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
