/**
 * @module tools/TextTool
 * @description Tool for creating text elements.
 */

import { App, Text } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";
 


 
export class TextTool extends ShapeTool {
  constructor() {
    super("text");
  }

  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 0, height = 0 } = options;
    const defaults = this.defaults;

    const elm= new Text({
      x,
      y,
      width,
      height,
      text: "Text",
      fill: defaults.fill,
      
      fontSize: 24,
      editable: defaults.editable,
    });

 
    return elm;
  }

  protected override onCreated(element: IUI, app: InstanceType<typeof App>): void {
    super.onCreated(element, app);
    (app as any).editor?.openInnerEditor(element);
  }
}
