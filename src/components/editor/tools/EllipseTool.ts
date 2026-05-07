/**
 * @module tools/EllipseTool
 * @description Tool for creating ellipse elements.
 */

import { Ellipse } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";

export class EllipseTool extends ShapeTool {
  constructor() {
    super("ellipse");
  }

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
