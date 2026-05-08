/**
 * @module tools
 * @description Tool registry and exports for the editor tool system.
 */

import { editorStore, type ToolType } from "#/store/editor";
import type { ITool, ToolCreateOptions, ToolDefaultValues } from "./types";
import { defaultToolValues } from "./defaults";
import { RectTool } from "./RectTool";
import { EllipseTool } from "./EllipseTool";
import { LineTool } from "./LineTool";
import { TextTool } from "./TextTool";
import { StarTool } from "./StarTool";
import { PenTool } from "./PenTool";
import { Circle, Frame, ImageIcon, Minus, MousePointer2, PenLine, Square, Star, Type } from "lucide-react";

// Re-export types and classes
export type { ITool, ToolCreateOptions, ToolDefaultValues };
export { defaultToolValues };
export { Tool } from "./Tool";
export { ShapeTool } from "./ShapeTool";
export { RectTool } from "./RectTool";
export { EllipseTool } from "./EllipseTool";
export { LineTool } from "./LineTool";
export { TextTool } from "./TextTool";
export { StarTool } from "./StarTool";
export { PenTool } from "./PenTool";

const toolRegistry: Partial<Record<ToolType, ITool>> = {
  rect: new RectTool(),
  ellipse: new EllipseTool(),
  line: new LineTool(),
  pen: new PenTool(),
  text: new TextTool(),
  star: new StarTool(),
};

/**
 * Retrieves the tool instance for the given tool type.
 *
 * @param type - The tool type to retrieve
 * @returns The tool instance, or undefined if not registered
 */
export function getTool(type: ToolType): ITool | undefined {
  return toolRegistry[type];
}

/**
 * Creates a new element using the specified tool.
 *
 * @param type - The tool type to use
 * @param options - Position and size options
 * @returns The created element, or undefined if tool not found
 */
export function createToolElement(
  type: ToolType,
  options: ToolCreateOptions
): ReturnType<ITool["create"]> | undefined {
  const tool = getTool(type);
  return tool?.create(options);
}



export function createActiveElement(options: ToolCreateOptions) {
  const activeTool = editorStore.state.activeTool
  if(activeTool){
    return createToolElement(activeTool, options)
  }
}

type FrameTool = ITool & { attachToFrame: (frame: any, app: any) => void };

export function getShapeTools(): FrameTool[] {
  return Object.values(toolRegistry).filter(
    (tool): tool is FrameTool => typeof (tool as any).attachToFrame === "function"
  );
}



interface ToolButton {
  tool: ToolType
  label: string
  icon: React.ReactNode
  shortcut?: string
}

interface ToolGroup {
  label: string
  tools: ToolButton[]
}

export const toolGroups: ToolGroup[] = [
  {
    label: 'Selection',
    tools: [
      { tool: 'select', label: 'Select', icon: <MousePointer2 size={20} />, shortcut: 'V' },
    ],
  },
  {
    label: 'Shapes',
    tools: [
      { tool: 'rect', label: 'Rectangle', icon: <Square size={20} />, shortcut: 'R' },
      { tool: 'ellipse', label: 'Ellipse', icon: <Circle size={20} />, shortcut: 'O' },
      { tool: 'star', label: 'Star', icon: <Star size={20} />, shortcut: 'S' },
      { tool: 'line', label: 'Line', icon: <Minus size={20} />, shortcut: 'L' },
      { tool: 'pen', label: 'Pen', icon: <PenLine size={20} />, shortcut: 'P' },
    ],
  },
  {
    label: 'Content',
    tools: [
      { tool: 'text', label: 'Text', icon: <Type size={20} />, shortcut: 'T' },
      { tool: 'image', label: 'Image', icon: <ImageIcon size={20} />, shortcut: 'I' },
    ],
  },
  {
    label: 'Layout',
    tools: [
      { tool: 'frame', label: 'Frame', icon: <Frame size={20} />, shortcut: 'F' },
    ],
  },
]