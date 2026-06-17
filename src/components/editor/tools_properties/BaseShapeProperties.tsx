import { useSelector } from "@tanstack/react-store";
import type { ReactNode } from "react";
import type { BlendMode } from "#/store/editor";
import { editorStore } from "#/store/editor";
import {
	ColorField,
	NumberField,
	Section,
	SelectField,
	SliderField,
} from "./fields";
import { ShadowSection } from "./ShadowSection";
import {
	applyBlendMode,
	applyFill,
	applyOpacity,
	applyStroke,
	applyStrokeAlign,
	applyStrokeCap,
	applyStrokeJoin,
	applyStrokeWidth,
} from "./selectionActions";

export interface BaseShapePropertiesProps {
	showFill?: boolean;
	showStroke?: boolean;
	showOpacity?: boolean;
	children?: ReactNode;
}

const STROKE_ALIGN_OPTIONS = [
	{ value: "center", label: "Center" },
	{ value: "inside", label: "Inside" },
	{ value: "outside", label: "Outside" },
];

const STROKE_CAP_OPTIONS = [
	{ value: "none", label: "None" },
	{ value: "round", label: "Round" },
	{ value: "square", label: "Square" },
];

const STROKE_JOIN_OPTIONS = [
	{ value: "miter", label: "Miter" },
	{ value: "round", label: "Round" },
	{ value: "bevel", label: "Bevel" },
];

const BLEND_MODE_OPTIONS: { value: BlendMode; label: string }[] = [
	{ value: "normal", label: "Normal" },
	{ value: "multiply", label: "Multiply" },
	{ value: "screen", label: "Screen" },
	{ value: "overlay", label: "Overlay" },
	{ value: "darken", label: "Darken" },
	{ value: "lighten", label: "Lighten" },
	{ value: "color-dodge", label: "Color Dodge" },
	{ value: "color-burn", label: "Color Burn" },
	{ value: "hard-light", label: "Hard Light" },
	{ value: "soft-light", label: "Soft Light" },
	{ value: "difference", label: "Difference" },
	{ value: "exclusion", label: "Exclusion" },
	{ value: "hue", label: "Hue" },
	{ value: "saturation", label: "Saturation" },
	{ value: "color", label: "Color" },
	{ value: "luminosity", label: "Luminosity" },
];

export function BaseShapeProperties({
	showFill = true,
	showStroke = true,
	showOpacity = true,
	children,
}: BaseShapePropertiesProps) {
	const fillColor = useSelector(editorStore, (s) => s.fillColor);
	const strokeColor = useSelector(editorStore, (s) => s.strokeColor);
	const strokeWidth = useSelector(editorStore, (s) => s.strokeWidth);
	const strokeAlign = useSelector(editorStore, (s) => s.strokeAlign);
	const strokeCap = useSelector(editorStore, (s) => s.strokeCap);
	const strokeJoin = useSelector(editorStore, (s) => s.strokeJoin);
	const opacity = useSelector(editorStore, (s) => s.opacity);
	const blendMode = useSelector(editorStore, (s) => s.blendMode);

	return (
		<>
			{showFill && (
				<Section title="Fill">
					<div className="col-span-full">
						<ColorField label="Color" value={fillColor} onChange={applyFill} />
					</div>
				</Section>
			)}

			{showStroke && (
				<Section title="Stroke">
					<ColorField
						label="Color"
						value={strokeColor}
						onChange={applyStroke}
					/>
					<NumberField
						label="Width"
						value={strokeWidth}
						onChange={applyStrokeWidth}
						min={0}
						max={50}
						step={0.5}
						unit="px"
					/>

					<SelectField
						label="Align"
						value={strokeAlign}
						options={STROKE_ALIGN_OPTIONS}
						onChange={(v) => applyStrokeAlign(v as typeof strokeAlign)}
					/>
					<SelectField
						label="Cap"
						value={strokeCap}
						options={STROKE_CAP_OPTIONS}
						onChange={(v) => applyStrokeCap(v as typeof strokeCap)}
					/>
					<SelectField
						label="Join"
						value={strokeJoin}
						options={STROKE_JOIN_OPTIONS}
						onChange={(v) => applyStrokeJoin(v as typeof strokeJoin)}
					/>
				</Section>
			)}

			{showOpacity && (
				<Section title="Appearance">
					<SliderField
						label="Opacity"
						value={Math.round(opacity * 100)}
						min={0}
						max={100}
						onChange={(v) => applyOpacity(v / 100)}
						displayValue={`${Math.round(opacity * 100)}%`}
					/>
					<SelectField
						label="Blend"
						value={blendMode}
						options={BLEND_MODE_OPTIONS}
						onChange={(v) => applyBlendMode(v as BlendMode)}
					/>
				</Section>
			)}

			<ShadowSection />

			{children}
		</>
	);
}
