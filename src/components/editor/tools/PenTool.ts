import { App, DragEvent, Ellipse, Frame, Path, PointerEvent } from "leafer-ui";
import type { IUI } from "leafer-ui";
import { editorStore, setActiveTool } from "#/store/editor";
import { Tool } from "./Tool";
import type { ToolCreateOptions } from "./types";

interface Point {
  x: number;
  y: number;
}

type NodeType = "corner" | "smooth";

interface KeyPoint extends Point {
  nodeType: NodeType;
  cp1?: Point; // incoming control handle (toward this point from previous)
  cp2?: Point; // outgoing control handle (from this point toward next)
}

// Snap-to-close radius in pixels
const CLOSE_RADIUS = 8;

export class PenTool extends Tool {
  constructor() {
    super("pen");
  }

  create(options: ToolCreateOptions): IUI {
    const { x, y } = options;
    const d = this.defaults;
    return new Path({
      x,
      y,
      path: "",
      fill: d.fill,
      stroke: d.stroke,
      strokeWidth: d.strokeWidth,
      editable: d.editable,
    });
  }

  attachToFrame(frame: InstanceType<typeof Frame>, app: InstanceType<typeof App>): void {
    const d = this.defaults;

    // The committed bezier path — updated only when an anchor is confirmed
    let pathEl: InstanceType<typeof Path> | undefined;
    // Single preview segment from last anchor → cursor (separate to avoid repositioning)
    let previewEl: InstanceType<typeof Path> | undefined;
    // Temporary handle visualiser shown while the user is dragging to set a curve handle
    let handleVis: { line: InstanceType<typeof Path>; dots: InstanceType<typeof Ellipse>[] } | undefined;

    let keyPoints: KeyPoint[] = [];
    let anchorDots: InstanceType<typeof Ellipse>[] = [];
    let isDrawing = false;
    let downPos: Point | null = null;
    let pendingHandle: Point | null = null;

    // ─── Helpers ────────────────────────────────────────────────────────────

    const toLocal = (e: any): Point => ({
      x: e.x - (frame.x ?? 0),
      y: e.y - (frame.y ?? 0),
    });

    const reflect = (origin: Point, p: Point): Point => ({
      x: 2 * origin.x - p.x,
      y: 2 * origin.y - p.y,
    });

    const dist = (a: Point, b: Point) =>
      Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

    const nearFirst = (p: Point) =>
      isDrawing && keyPoints.length >= 2 && dist(p, keyPoints[0]) <= CLOSE_RADIUS;

    // ─── Path string builder (dream-num/PenTool data model) ─────────────────
    //   Each segment is either L (both endpoints are corners with no handles)
    //   or C (at least one endpoint has a handle — full cubic bezier)
    const buildPath = (pts: KeyPoint[], closed = false): string => {
      if (pts.length === 0) return "";
      let str = `M ${pts[0].x} ${pts[0].y}`;

      for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        if (prev.cp2 || curr.cp1) {
          const c1 = prev.cp2 ?? prev;
          const c2 = curr.cp1 ?? curr;
          str += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${curr.x} ${curr.y}`;
        } else {
          str += ` L ${curr.x} ${curr.y}`;
        }
      }

      if (closed && pts.length >= 2) {
        const last = pts[pts.length - 1];
        const first = pts[0];
        if (last.cp2 || first.cp1) {
          const c1 = last.cp2 ?? last;
          const c2 = first.cp1 ?? first;
          str += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${first.x} ${first.y}`;
        }
        str += " Z";
      }

      return str;
    };

    // Single segment: last committed anchor → preview target
    const buildPreviewSeg = (to: Point, incomingCp?: Point): string => {
      if (keyPoints.length === 0) return "";
      const last = keyPoints[keyPoints.length - 1];
      if (last.cp2 || incomingCp) {
        const c1 = last.cp2 ?? last;
        const c2 = incomingCp ?? to;
        return `M ${last.x} ${last.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
      }
      return `M ${last.x} ${last.y} L ${to.x} ${to.y}`;
    };

    // ─── Visual helpers ──────────────────────────────────────────────────────

    const addAnchorDot = (pt: Point, isFirst = false) => {
      const dot = new Ellipse({
        x: pt.x - 4,
        y: pt.y - 4,
        width: 8,
        height: 8,
        fill: isFirst ? d.stroke : "white",
        stroke: d.stroke,
        strokeWidth: 1.5,
      });
      frame.add(dot);
      anchorDots.push(dot);
    };

    const showHandleVis = (anchor: Point, cp2: Point) => {
      clearHandleVis();
      const cp1 = reflect(anchor, cp2);
      const line = new Path({
        path: `M ${cp1.x} ${cp1.y} L ${anchor.x} ${anchor.y} L ${cp2.x} ${cp2.y}`,
        fill: "none",
        stroke: d.stroke,
        strokeWidth: 1,
        opacity: 0.55,
      });
      const mkDot = (p: Point) =>
        new Ellipse({ x: p.x - 3, y: p.y - 3, width: 6, height: 6, fill: d.stroke });
      const dots = [mkDot(cp1), mkDot(cp2)];
      frame.add(line);
      dots.forEach((dot) => frame.add(dot));
      handleVis = { line, dots };
    };

    const clearHandleVis = () => {
      if (!handleVis) return;
      handleVis.line.remove();
      handleVis.dots.forEach((dot) => dot.remove());
      handleVis = undefined;
    };

    const updatePreview = (to: Point, incomingCp?: Point) => {
      if (!isDrawing || keyPoints.length === 0) return;
      const seg = buildPreviewSeg(to, incomingCp);
      if (!previewEl) {
        previewEl = new Path({
          path: seg,
          fill: "none",
          stroke: d.stroke,
          strokeWidth: d.strokeWidth,
          opacity: 0.4,
          dashPattern: [5, 5],
        });
        frame.add(previewEl);
      } else {
        previewEl.set({ path: seg });
      }
    };

    const clearPreview = () => {
      previewEl?.remove();
      previewEl = undefined;
    };

    const commitPath = () => {
      pathEl?.set({ path: buildPath(keyPoints) });
    };

    // ─── Session lifecycle ───────────────────────────────────────────────────

    const startPath = (kp: KeyPoint) => {
      isDrawing = true;
      keyPoints = [kp];
      pathEl = new Path({
        path: `M ${kp.x} ${kp.y}`,
        fill: "none",
        stroke: d.stroke,
        strokeWidth: d.strokeWidth,
        editable: d.editable,
      });
      frame.add(pathEl);
      addAnchorDot(kp, true);
      document.addEventListener("keydown", onKeydown);
    };

    const finish = (closed = false) => {
      clearPreview();
      clearHandleVis();
      anchorDots.forEach((dot) => dot.remove());
      anchorDots = [];

      if (pathEl) {
        if (keyPoints.length >= 2) {
          pathEl.set({
            path: buildPath(keyPoints, closed),
            fill: closed ? d.fill : "none",
          });
          app.editor?.select(pathEl);
        } else {
          pathEl.remove();
        }
      }

      pathEl = undefined;
      keyPoints = [];
      isDrawing = false;
      downPos = null;
      pendingHandle = null;
      setActiveTool('select');
      document.removeEventListener("keydown", onKeydown);
    };

    const cancel = () => {
      clearPreview();
      clearHandleVis();
      anchorDots.forEach((dot) => dot.remove());
      anchorDots = [];
      pathEl?.remove();
      pathEl = undefined;
      keyPoints = [];
      isDrawing = false;
      downPos = null;
      pendingHandle = null;
      document.removeEventListener("keydown", onKeydown);
    };

    const onKeydown = (e: KeyboardEvent) => {
      if (!isDrawing) return;
      if (e.key === "Escape") cancel();
      else if (e.key === "Enter") finish();
    };

    // ─── Frame event listeners ───────────────────────────────────────────────

    frame.on(PointerEvent.DOWN, (e: any) => {
      if (editorStore.state.activeTool !== this.type) return;
      downPos = toLocal(e);
      pendingHandle = null;
    });

    // Hover: update preview segment + highlight first anchor when near it
    frame.on(PointerEvent.MOVE, (e: any) => {
      if (!isDrawing || keyPoints.length === 0) return;
      const cur = toLocal(e);
      const closing = nearFirst(cur);
      // Visually pulse the first dot to indicate path can be closed
      anchorDots[0]?.set({ fill: closing ? d.stroke : "white", width: closing ? 10 : 8, height: closing ? 10 : 8, x: keyPoints[0].x - (closing ? 5 : 4), y: keyPoints[0].y - (closing ? 5 : 4) });
      updatePreview(cur);
    });

    // Drag: user is pulling a bezier handle
    frame.on(DragEvent.DRAG, (e: any) => {
      if (editorStore.state.activeTool !== this.type || !downPos) return;
      const cur = toLocal(e);
      pendingHandle = cur;
      showHandleVis(downPos, cur);
      if (isDrawing && keyPoints.length > 0) {
        updatePreview(downPos, reflect(downPos, cur));
      }
    });

    // Drag end: commit a smooth (bezier) anchor
    frame.on(DragEvent.END, (e: any) => {
      if (editorStore.state.activeTool !== this.type || !downPos) return;

      if (nearFirst(downPos)) {
        finish(true);
        return;
      }

      const dragEnd = toLocal(e);
      const kp: KeyPoint = {
        x: downPos.x,
        y: downPos.y,
        nodeType: "smooth",
        cp2: dragEnd,
        cp1: reflect(downPos, dragEnd),
      };

      if (!isDrawing) {
        startPath(kp);
      } else {
        keyPoints.push(kp);
        commitPath();
        addAnchorDot(kp);
      }

      clearHandleVis();
      downPos = null;
      pendingHandle = null;
    });

    // Click (no drag): commit a sharp corner anchor
    frame.on(PointerEvent.CLICK, (e: any) => {
      if (editorStore.state.activeTool !== this.type) return;
      if (pendingHandle) return;

      const pt = toLocal(e);

      if (nearFirst(pt)) {
        finish(true);
        return;
      }

      const kp: KeyPoint = { x: pt.x, y: pt.y, nodeType: "corner" };
      if (!isDrawing) {
        startPath(kp);
      } else {
        keyPoints.push(kp);
        commitPath();
        addAnchorDot(kp);
      }
    });

    // Double-click: pop the duplicate point the second click added, then finish
    frame.on(PointerEvent.DOUBLE_CLICK, () => {
      if (!isDrawing) return;
      if (keyPoints.length > 1) {
        keyPoints.pop();
        anchorDots.at(-1)?.remove();
        anchorDots.pop();
      }
      finish();
    });
  }
}
