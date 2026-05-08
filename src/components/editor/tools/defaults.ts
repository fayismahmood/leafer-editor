/**
 * @module tools/defaults
 * @description Default values for each tool type.
 */

import type { ToolDefaultValues } from "./types";
import type { ToolType } from "#/store/editor";

/**
 * Base default values shared across all tools.
 */
const baseDefaults: ToolDefaultValues = {
  fill: "#4A90D9",
  stroke: "#333333",
  strokeWidth: 2,
  opacity: 1,
  editable: true,
};

/**
 * Tool-specific default value overrides.
 * Each key corresponds to a ToolType from the editor store.
 */
export const defaultToolValues: Record<ToolType, ToolDefaultValues> = {
  select: { ...baseDefaults },
  pen: {
    ...baseDefaults,
    fill: "none",
    stroke: "#333333",
    strokeWidth: 2,
  },
  rect: {
    ...baseDefaults,
    fill: "#4A90D9",
    stroke: "#2C6FB5",
    strokeWidth: 2,
  },
  ellipse: {
    ...baseDefaults,
    fill: "#E85D75",
    stroke: "#B9445A",
    strokeWidth: 2,
  },
  line: {
    ...baseDefaults,
    fill: "transparent",
    stroke: "#333333",
    strokeWidth: 2,
  },
  text: {
    ...baseDefaults,
    fill: "#333333",
    stroke: "transparent",
    strokeWidth: 0,
  },
  frame: {
    ...baseDefaults,
    fill: "#FFFFFF",
    stroke: "#CCCCCC",
    strokeWidth: 1,
  },
  star: {
    ...baseDefaults,
    fill: "#F5A623",
    stroke: "#C4841D",
    strokeWidth: 2,
  },
  image: {
    ...baseDefaults,
    fill: "transparent",
    stroke: "transparent",
    strokeWidth: 0,
  },
};
