import { App } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { HTMLText } from "@leafer-in/html";
import { ShapeTool } from "./ShapeTool";
import type { ToolCreateOptions } from "./types";

const DEFAULT_RICH_TEXT = `<h1 style="margin:0;font-size:28px;font-weight:700;">Heading</h1><p style="margin:8px 0 0;font-size:16px;line-height:1.6;">Rich text with <strong>bold</strong>, <em>italic</em>, and <u>underline</u>.</p>`;

export class RichTextTool extends ShapeTool {
  constructor() {
    super("richtext");
  }

  create(options: ToolCreateOptions): IUI {
    const { x, y, width = 320 } = options;
    const defaults = this.defaults;

    return new HTMLText({
      x,
      y,
      width,
      text: DEFAULT_RICH_TEXT,
      editable: defaults.editable,
      editInner: "TextEditor",
      fill: defaults.fill,
      editConfig: { editSize: "scale" },
    }) as unknown as IUI;
  }

  protected override onCreated(element: IUI, app: InstanceType<typeof App>): void {
    super.onCreated(element, app);
    (app as any).editor?.openInnerEditor(element);
  }
}
