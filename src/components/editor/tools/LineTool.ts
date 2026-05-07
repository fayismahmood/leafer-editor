/**
 * @module tools/LineTool
 * @description Tool for creating line elements.
 */

import { Line } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";

export class LineTool extends ShapeTool {
  constructor() {
    super("line");
  }

  create(options: ToolCreateOptions): IUI {
    const { x, y } = options;
    const defaults = this.defaults;

    return new Line({
      x,
      y,
      points: [0, 0, 0, 0],
      stroke: defaults.stroke,
      strokeWidth: defaults.strokeWidth,
      editable: defaults.editable,
    });
  }

  protected override updateDrag(
    element: IUI,
    startX: number,
    startY: number,
    curX: number,
    curY: number,
  ): void {
    element.set({
      points: [0, 0, curX - startX, curY - startY],
    });
  }
}
