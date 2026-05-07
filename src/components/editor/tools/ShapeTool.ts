import { App, DragEvent, Frame } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { editorStore } from "#/store/editor";
import { Tool } from "./Tool";

export abstract class ShapeTool extends Tool {
  attachToFrame(frame: InstanceType<typeof Frame>, app: InstanceType<typeof App>): void {
    let actElement: IUI | undefined;
    let startX = 0;
    let startY = 0;

    frame.on(DragEvent.START, (e: any) => {
      if (editorStore.state.activeTool !== this.type) return;
      if ((app as any).editor?.leafList?.length > 0) return;
      startX = e.x - (frame.x ?? 0);
      startY = e.y - (frame.y ?? 0);
      actElement = this.create({ x: startX, y: startY, width: 0, height: 0 });
      if (!actElement) return;
      frame.add(actElement);
      app.editor?.select(actElement);
    });

    frame.on(DragEvent.DRAG, (e: any) => {
      if (!actElement) return;
      const curX = e.x - (frame.x ?? 0);
      const curY = e.y - (frame.y ?? 0);
      this.updateDrag(actElement, startX, startY, curX, curY);
    });

    frame.on(DragEvent.END, () => {
      if (actElement) this.onCreated(actElement, app);
      actElement = undefined;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onCreated(_element: IUI, _app: InstanceType<typeof App>): void {}

  protected updateDrag(
    element: IUI,
    startX: number,
    startY: number,
    curX: number,
    curY: number,
  ): void {
    element.set({
      x: Math.min(startX, curX),
      y: Math.min(startY, curY),
      width: Math.abs(curX - startX),
      height: Math.abs(curY - startY),
    });
  }
}
