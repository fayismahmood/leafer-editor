import { useRef, useState, useEffect } from "react";
import { Frame } from "lucide-react";
import { useSelector } from "@tanstack/react-store";
import { editorStore, setActiveTool } from "#/store/editor";
import { getCanvasApp } from "#/utils/appInstance";
import { createFrame } from "./editor/canvas/frame";

interface FramePreset {
  label: string;
  width: number;
  height: number;
}

const PAPER_PRESETS: FramePreset[] = [
  { label: "A4", width: 595, height: 842 },
  { label: "A3", width: 842, height: 1191 },
  { label: "A5", width: 420, height: 595 },
  { label: "US Letter", width: 612, height: 792 },
  { label: "US Legal", width: 612, height: 1008 },
  { label: "Tabloid", width: 792, height: 1224 },
  { label: "Business Card", width: 252, height: 144 },
];

const SCREEN_PRESETS: FramePreset[] = [
  { label: "Desktop HD", width: 1920, height: 1080 },
  { label: "Desktop", width: 1440, height: 900 },
  { label: "Tablet", width: 768, height: 1024 },
  { label: "Phone", width: 375, height: 812 },
  { label: "Instagram Post", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "Facebook Post", width: 1200, height: 630 },
  { label: "Facebook Cover", width: 1640, height: 624 },
  { label: "Twitter Post", width: 1200, height: 675 },
  { label: "LinkedIn Post", width: 1200, height: 627 },
  { label: "YouTube Thumbnail", width: 1280, height: 720 },
];

let frameCounter = 0;

export function FramePopover({ shortcut }: { shortcut?: string }) {
  const activeTool = useSelector(editorStore, (s) => s.activeTool);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = activeTool === "frame";

  useEffect(() => {
    if (!open) return;
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  function handlePreset(preset: FramePreset) {
    const app = getCanvasApp();
    if (!app) return;

    frameCounter += 1;
    const vw = app.width || 1440;
    const vh = app.height || 900;
    const x = Math.max(20, (vw - preset.width) / 2);
    const y = Math.max(20, (vh - preset.height) / 2);

    const frame = createFrame({
      x,
      y,
      width: preset.width,
      height: preset.height,
      name: `${preset.label} ${frameCounter}`,
      app,
    });
    app.tree.add(frame);
    setOpen(false);
    setActiveTool("select");
  }

  function handleCustom() {
    setActiveTool("frame");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        title={shortcut ? `Frame (${shortcut})` : "Frame"}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Frame size={20} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 flex flex-col gap-0.5 z-20 min-w-[220px] max-h-[420px] overflow-y-auto">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
            Paper
          </span>
          {PAPER_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => handlePreset(preset)}
            >
              <span className="flex-1 text-left">{preset.label}</span>
              <span className="text-[10px] text-gray-400 font-mono">
                {preset.width}×{preset.height}
              </span>
            </button>
          ))}

          <div className="border-t border-gray-100 my-1" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
            Screen &amp; Social
          </span>
          {SCREEN_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => handlePreset(preset)}
            >
              <span className="flex-1 text-left">{preset.label}</span>
              <span className="text-[10px] text-gray-400 font-mono">
                {preset.width}×{preset.height}
              </span>
            </button>
          ))}

          <div className="border-t border-gray-100 my-1" />
          <button
            type="button"
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
            onClick={handleCustom}
          >
            <span className="flex-1 text-left">Custom Size</span>
            <span className="text-[10px] text-blue-400">Drag to draw</span>
          </button>
        </div>
      )}
    </div>
  );
}
