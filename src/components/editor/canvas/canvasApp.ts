/**
 * @module canvasApp
 * @description Initializes the Leafer-UI canvas and handles drag-to-create-frame interactions.
 */

import { App, DragEvent, Rect } from "leafer-ui";
import "@leafer-in/state";
import "@leafer-in/animate";
import { editorStore } from "#/store/editor";
import { createFrame } from "./frame";
import { forceSelectModeInSelectTool } from "#/components/editor/canvas/listeners";

/**
 * Initializes the canvas within the provided container element.
 * Sets up the Leafer-UI app, handles frame creation via drag events,
 * and manages the preview rectangle during drag operations.
 *
 * @param elm - The container HTMLDivElement to mount the canvas into
 */
export function initCanvasApp(elm: HTMLDivElement): void {
  const canvasWrapper = document.createElement("div");
  const app = new App({
    view: canvasWrapper,
    height: window.innerHeight,
    fill: "#dddddd17",
    editor: {},

  });

  let previewRect: InstanceType<typeof Rect> | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let frameCount = 0;



  forceSelectModeInSelectTool(app);
   
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







