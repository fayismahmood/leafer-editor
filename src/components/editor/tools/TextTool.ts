/**
 * @module tools/TextTool
 * @description Tool for creating text elements.
 */

import { Text } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

/**
 * Creates editable text elements on the canvas.
 *
 * @example
 * ```ts
 * const textTool = new TextTool();
 * const text = textTool.create({ x: 10, y: 10 });
 * ```
 */
export class TextTool extends Tool {
  readonly type = "text" as const;

  /**
   * Creates a new Text element at the specified position.
   *
   * @param options - Position and size options
   * @returns Configured Text instance
   */
  create(options: ToolCreateOptions): IUI {
    const { x, y } = options;
    const defaults = this.defaults;

    return new Text({
      x,
      y,
      text: "Text",
      fill: defaults.fill,
      fontSize: 24,
      editable: defaults.editable,
    });
  }
}
