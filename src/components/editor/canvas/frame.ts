/**
 * @module frame
 * @description Handles frame creation with internal drawing capabilities.
 */

import { App, Frame } from "leafer-ui";
import { getShapeTools } from "../tools";

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
      // editable: true,
    },
    x,
    y,
    width,
    height,
    
  );

  for (const tool of getShapeTools()) {
    tool.attachToFrame(frameInstance, app);
  }

  

  return frameInstance;
}
