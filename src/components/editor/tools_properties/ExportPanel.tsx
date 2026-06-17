import "@leafer-in/export";
import { useSelector } from "@tanstack/react-store";
import { Download, FileImage, FileJson, Globe, Image, ImageDown, LayoutPanelTop } from "lucide-react";
import { useState } from "react";
import { editorStore } from "#/store/editor";
import { getCanvasApp } from "#/utils/appInstance";
import {
	NumberField,
	Section,
	SelectField,
	SliderField,
	ToggleField,
} from "./fields";

type ExportFormat = "png" | "jpg" | "webp" | "bmp" | "json" | "canvas";

const FORMAT_OPTIONS = [
	{ value: "png", label: "PNG", icon: Image },
	{ value: "jpg", label: "JPG", icon: FileImage },
	{ value: "webp", label: "WebP", icon: Globe },
	{ value: "bmp", label: "BMP", icon: ImageDown },
	{ value: "json", label: "JSON", icon: FileJson },
	{ value: "canvas", label: "Canvas", icon: LayoutPanelTop },
];

function dataURLtoBlob(dataURL: string): Blob {
	const parts = dataURL.split(",");
	const mime = parts[0].match(/:(.*?);/)?.[1] ?? "image/png";
	const bstr = atob(parts[1]);
	const n = bstr.length;
	const u8arr = new Uint8Array(n);
	for (let i = 0; i < n; i++) {
		u8arr[i] = bstr.charCodeAt(i);
	}
	return new Blob([u8arr], { type: mime });
}

function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function ExportPanel() {
	const selectedElements = useSelector(editorStore, (s) => s.selectedElements);

	const [format, setFormat] = useState<ExportFormat>("png");
	const [quality, setQuality] = useState(0.92);
	const [scale, setScale] = useState(1);
	const [pixelRatio, setPixelRatio] = useState(1);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [fill, setFill] = useState("#ffffff");
	const [trim, setTrim] = useState(false);
	const [screenshot, setScreenshot] = useState(false);
	const [padding, setPadding] = useState(0);
	const [exporting, setExporting] = useState(false);

	const showQuality = format === "jpg" || format === "webp";

	const handleExport = async () => {
		const app = getCanvasApp();
		if (!app) return;

		setExporting(true);
		try {
			const options: Record<string, unknown> = {};

			if (showQuality) options.quality = quality;
			if (scale !== 1) options.scale = scale;
			if (pixelRatio !== 1) options.pixelRatio = pixelRatio;
			if (width > 0 || height > 0) {
				options.size = {
					...(width > 0 ? { width } : {}),
					...(height > 0 ? { height } : {}),
				};
			}
			if (fill && fill !== "#ffffff") options.fill = fill;
			if (trim) options.trim = true;
			if (screenshot) options.screenshot = true;
			if (padding > 0) options.padding = padding;

			const target =
				screenshot || selectedElements.length === 0 ? app : selectedElements[0];

			const result = await target.export(format, options as never);
			const data = (result as unknown as { data: string }).data;

			if (!data) {
				alert("Export returned no data.");
				return;
			}

			const ext = format === "jpg" ? "jpeg" : format;
			const mimeMap: Record<string, string> = {
				png: "image/png",
				jpg: "image/jpeg",
				webp: "image/webp",
				bmp: "image/bmp",
				json: "application/json",
				canvas: "image/png",
			};
			const mime = mimeMap[format] ?? "image/png";

			if (format === "json") {
				const blob = new Blob([JSON.stringify(data, null, 2)], { type: mime });
				downloadBlob(blob, `export.${format}`);
			} else {
				const base64 = data as string;
				if (!base64.startsWith("data:")) {
					const blob = dataURLtoBlob(`data:${mime};base64,${base64}`);
					downloadBlob(blob, `export.${ext}`);
				} else {
					const blob = dataURLtoBlob(base64);
					downloadBlob(blob, `export.${ext}`);
				}
			}
		} catch (error) {
			console.error("Export failed:", error);
			alert("Export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<Section title="Format">
				<SelectField
					label="Type"
					value={format}
					options={FORMAT_OPTIONS}
					onChange={(v) => setFormat(v as ExportFormat)}
				/>
			</Section>

			{showQuality && (
				<Section title="Quality">
					<SliderField
						label="Quality"
						value={quality}
						min={0}
						max={1}
						step={0.01}
						onChange={setQuality}
					/>
				</Section>
			)}

			<Section title="Scale & Size">
				<NumberField
					label="Scale"
					value={scale}
					min={0.1}
					max={10}
					step={0.1}
					onChange={setScale}
				/>
				<NumberField
					label="Pixel ratio"
					value={pixelRatio}
					min={1}
					max={4}
					step={1}
					onChange={setPixelRatio}
				/>
				<NumberField
					label="Width"
					value={width}
					min={0}
					onChange={setWidth}
					unit="px"
				/>
				<NumberField
					label="Height"
					value={height}
					min={0}
					onChange={setHeight}
					unit="px"
				/>
			</Section>

			<Section title="Background">
				<div className="flex items-center gap-3">
					<label
						htmlFor="export-fill"
						className="text-xs text-gray-500 w-14 shrink-0 font-medium leading-none"
					>
						Fill
					</label>
					<input
						id="export-fill"
						type="text"
						value={fill}
						onChange={(e) => setFill(e.target.value)}
						className="flex-1 h-7 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 min-w-0
              focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
					/>
					<input
						type="color"
						value={fill}
						onChange={(e) => setFill(e.target.value)}
						className="w-7 h-7 rounded border border-gray-200 cursor-pointer shrink-0"
					/>
				</div>
				<NumberField
					label="Padding"
					value={padding}
					min={0}
					onChange={setPadding}
					unit="px"
				/>
			</Section>

			<Section title="Options">
				<ToggleField label="Trim" value={trim} onChange={setTrim} />
				<ToggleField
					label="Screenshot"
					value={screenshot}
					onChange={setScreenshot}
				/>
			</Section>

			<div className="px-5 pt-2 pb-6">
				<button
					type="button"
					onClick={handleExport}
					disabled={exporting}
					className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 active:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Download size={14} />
					{exporting ? "Exporting..." : "Export"}
				</button>
			</div>
		</div>
	);
}
