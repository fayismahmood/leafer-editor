import { App, DragEvent, Frame, Leafer, Rect } from "leafer-ui";
import "@leafer-in/state";
import "@leafer-in/animate";
import { Editor } from "@leafer-in/editor";
import { editorStore } from "#/store/editor";
export function applyCanvas(elm: HTMLDivElement) {
  const canvasWrapper = document.createElement("div");
  const app = new App({
    view: canvasWrapper,
    height: window.innerHeight,
    fill: "#ea0c0c",
    editor: {},  
  });

  let previewRect: InstanceType<typeof Rect> | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let frameCount = 0;

  app.on(DragEvent.START, (e: any) => {
    if (editorStore.state.activeTool !== 'frame') return;
    dragStartX = e.x;
    dragStartY = e.y;
    previewRect = new Rect({
      x: dragStartX,
      y: dragStartY,
      width: 0,
      height: 0,
      fill: "rgba(0, 120, 255, 0.1)",
      stroke: "#0078ff",
      strokeWidth: 1,
    });
    app.tree.add(previewRect);
  });

  app.on(DragEvent.DRAG, (e: any) => {
    if (!previewRect) return;
    const curX = e.x;
    const curY = e.y;
    previewRect.set({
      x: Math.min(dragStartX, curX),
      y: Math.min(dragStartY, curY),
      width: Math.abs(curX - dragStartX),
      height: Math.abs(curY - dragStartY),
    });
  });

  app.on(DragEvent.END, (e: any) => {
    if (!previewRect) return;
    const x = Math.min(dragStartX, e.x);
    const y = Math.min(dragStartY, e.y);
    const width = Math.abs(e.x - dragStartX);
    const height = Math.abs(e.y - dragStartY);
    previewRect.remove();
    previewRect = null;
    if (width < 4 || height < 4) return;
    frameCount += 1;
    const frame = createFrame({ x, y, width, height, name: `Frame ${frameCount}`, app });
    app.tree.add(frame);
  });

  elm.appendChild(canvasWrapper);
}

function createFrame({
  x,
  y,
  width,
  height,
  name,
  app,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  app: InstanceType<typeof App>;
}) {
  const Frame1 = Frame.one(
    {
      name,
      fill: "white",
    },
    x,
    y,
    width,
    height,
  );

  let drawingRect: InstanceType<typeof Rect> | null = null;
  let startX = 0;
  let startY = 0;

  Frame1.on(DragEvent.START, (e: any) => {
    if ((app as any).editor?.leafList?.length > 0) return;
    startX = e.x - (Frame1.x ?? 0);
    startY = e.y - (Frame1.y ?? 0);

    drawingRect = new Rect({
     editable: true,
      x: startX,
      y: startY,
      width: 0,
      height: 0,
      fill: "rgba(0, 120, 255, 0.2)",
      stroke: "#0078ff",
      strokeWidth: 1,
    });
    Frame1.add(drawingRect);
  });

  Frame1.on(DragEvent.DRAG, (e: any) => {
    if (!drawingRect) return;
    const curX = e.x - (Frame1.x ?? 0);
    const curY = e.y - (Frame1.y ?? 0);
    drawingRect.set({
      x: Math.min(startX, curX),
      y: Math.min(startY, curY),
      width: Math.abs(curX - startX),
      height: Math.abs(curY - startY),
    });
  });

  Frame1.on(DragEvent.END, () => {
    drawingRect = null;
  });

  return Frame1;
}
