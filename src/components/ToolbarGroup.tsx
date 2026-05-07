import { useRef, useState, useEffect } from "react";
import type { ToolType } from "#/store/editor";
import { ToolbarButton } from "./ToolbarButton";
import { ChevronUp } from "lucide-react";

interface ToolItem {
  tool: ToolType;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

interface ToolbarGroupProps {
  label: string;
  tools: ToolItem[];
  activeTool: ToolType;
  onSelect: (tool: ToolType) => void;
}

export function ToolbarGroup({
  label,
  tools,
  activeTool,
  onSelect,
}: ToolbarGroupProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeInGroup = tools.find((t) => t.tool === activeTool);
  const displayed = activeInGroup ?? tools[0];
  const isGroupActive = !!activeInGroup;

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

  if (tools.length === 1) {
    return (
      <ToolbarButton
        tool={tools[0].tool}
        label={tools[0].label}
        icon={tools[0].icon}
        shortcut={tools[0].shortcut}
        isActive={activeTool === tools[0].tool}
        onClick={() => onSelect(tools[0].tool)}
      />
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex cursor-pointer">
        <button
          type="button"
          title={`${label}${displayed.shortcut ? ` — ${displayed.label} (${displayed.shortcut})` : ""}`}
          className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            isGroupActive
              ? "bg-blue-500 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => {
            if (!isGroupActive) onSelect(displayed.tool);
          }}
        >
          {displayed.icon}
        </button>

        <div
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          className="h-8 flex  ml-0.5 rounded hover:bg-gray-100  top-0 right-0"
        >
          <ChevronUp className="my-auto" size={12} />
        </div>
      </div>

      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 flex flex-col gap-0.5 z-20 min-w-[140px]">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
            {label}
          </span>
          {tools.map(({ tool, label: toolLabel, icon, shortcut }) => {
            const isActive = activeTool === tool;
            return (
              <button
                key={tool}
                type="button"
                className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => {
                  onSelect(tool);
                  setOpen(false);
                }}
              >
                <span className="flex items-center justify-center w-5 h-5 shrink-0">
                  {icon}
                </span>
                <span className="flex-1 text-left">{toolLabel}</span>
                {shortcut && (
                  <kbd
                    className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                      isActive
                        ? "bg-blue-400 text-blue-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
