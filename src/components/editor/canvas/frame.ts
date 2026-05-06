/**
 * @module frame
 * @description Handles frame creation with internal drawing capabilities.
 */

import { editorStore } from "#/store/editor";
import { App, DragEvent, Frame, Rect } from "leafer-ui";
import { createActiveElement } from "../tools";
import type { IUI } from "leafer-ui";

/**
 * Creates and configures a new Frame with internal drawing capabilities.
 *
 * @param params - Configuration object for frame creation
 * @param params.x - X coordinate of the frame
 * @param params.y - Y coordinate of the frame
 * @param params.width - Width of the frame
 * @param params.height - Height of the frame
 * @param params.name - Display name for the frame
 * @param params.app - Reference to the App instance for editor access
 * @returns Configured Frame instance
 */
export function createFrame({
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
}): InstanceType<typeof Frame> {
  const frameInstance = Frame.one(
    {
      name,
      fill: "white",
    },
    x,
    y,
    width,
    height,
  );

  let actElement: IUI | undefined = undefined;
  let startX = 0;
  let startY = 0;

  frameInstance.on(DragEvent.START, (e: any) => {
    if ((app as any).editor?.leafList?.length > 0) return;
    startX = e.x - (frameInstance.x ?? 0);
    startY = e.y - (frameInstance.y ?? 0);

    actElement = createActiveElement({
      x: startX,
      y: startY,
      width: 60,
      height: 60,
    });

    if (!actElement) return;
    frameInstance.add(actElement);
  });

  frameInstance.on(DragEvent.DRAG, (e: any) => {
    if (!actElement) return;
    const curX = e.x - (frameInstance.x ?? 0);
    const curY = e.y - (frameInstance.y ?? 0);
    actElement.set({
      x: Math.min(startX, curX),
      y: Math.min(startY, curY),
      width: Math.abs(curX - startX),
      height: Math.abs(curY - startY),
    });
  });

  frameInstance.on(DragEvent.END, () => {
    actElement = undefined;
  });

  return frameInstance;
}
