import { useSelector } from "@tanstack/react-store";
import { useEffect, useState } from "react";
import { editorStore } from "#/store/editor";
import { BaseShapeProperties } from "./BaseShapeProperties";
import { NumberField, Section, SelectField, ToggleField } from "./fields";
import { FontPicker } from "./fields/FontPicker";
import {
	applyFontFamily,
	applyFontSize,
	applyFontWeight,
	applyItalic,
	applyTextAlign,
	applyToSelection,
} from "./selectionActions";

const FONT_WEIGHT_OPTIONS = [
	{ value: "100", label: "Thin (100)" },
	{ value: "200", label: "Extra Light (200)" },
	{ value: "300", label: "Light (300)" },
	{ value: "400", label: "Regular (400)" },
	{ value: "500", label: "Medium (500)" },
	{ value: "600", label: "Semi Bold (600)" },
	{ value: "700", label: "Bold (700)" },
	{ value: "800", label: "Extra Bold (800)" },
	{ value: "900", label: "Black (900)" },
];

const TEXT_ALIGN_OPTIONS = [
	{ value: "left", label: "Left" },
	{ value: "center", label: "Center" },
	{ value: "right", label: "Right" },
	{ value: "justify", label: "Justify" },
];

const VERTICAL_ALIGN_OPTIONS = [
	{ value: "top", label: "Top" },
	{ value: "middle", label: "Middle" },
	{ value: "bottom", label: "Bottom" },
];

const TEXT_CASE_OPTIONS = [
	{ value: "none", label: "None" },
	{ value: "upper", label: "Uppercase" },
	{ value: "lower", label: "Lowercase" },
	{ value: "title", label: "Title Case" },
];

const TEXT_DECORATION_OPTIONS = [
	{ value: "none", label: "None" },
	{ value: "under", label: "Underline" },
	{ value: "delete", label: "Strikethrough" },
];

const TEXT_WRAP_OPTIONS = [
	{ value: "normal", label: "Normal" },
	{ value: "none", label: "No Wrap" },
	{ value: "break", label: "Break" },
];

export function TextProperties() {
	const selectedElements = useSelector(editorStore, (s) => s.selectedElements);
	const fontSize = useSelector(editorStore, (s) => s.fontSize);
	const fontFamily = useSelector(editorStore, (s) => s.fontFamily);
	const fontWeight = useSelector(editorStore, (s) => s.fontWeight);
	const italic = useSelector(editorStore, (s) => s.italic);
	const textAlign = useSelector(editorStore, (s) => s.textAlign);

	const el = selectedElements[0] as any;

	const [letterSpacing, setLetterSpacing] = useState<number>(
		el?.letterSpacing ?? 0,
	);
	const [lineHeight, setLineHeight] = useState<number>(el?.lineHeight ?? 150);
	const [verticalAlign, setVerticalAlign] = useState<string>(
		el?.verticalAlign ?? "top",
	);
	const [textCase, setTextCase] = useState<string>(el?.textCase ?? "none");
	const [textDecoration, setTextDecoration] = useState<string>(
		el?.textDecoration ?? "none",
	);
	const [textWrap, setTextWrap] = useState<string>(el?.textWrap ?? "normal");

	useEffect(() => {
		setLetterSpacing(el?.letterSpacing ?? 0);
		setLineHeight(el?.lineHeight ?? 150);
		setVerticalAlign(el?.verticalAlign ?? "top");
		setTextCase(el?.textCase ?? "none");
		setTextDecoration(el?.textDecoration ?? "none");
		setTextWrap(el?.textWrap ?? "normal");
	}, [selectedElements]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<BaseShapeProperties>
			<Section title="Font">
				<NumberField
					label="Size"
					value={fontSize}
					onChange={applyFontSize}
					min={1}
					max={999}
					unit="px"
				/>
				<div className="flex flex-col gap-1">
					<label className="text-xs text-gray-500 font-medium leading-none">
						Family
					</label>
					<FontPicker value={fontFamily} onChange={applyFontFamily} />
				</div>
				<SelectField
					label="Weight"
					value={String(fontWeight)}
					options={FONT_WEIGHT_OPTIONS}
					onChange={(v) => applyFontWeight(Number(v))}
				/>
				<ToggleField label="Italic" value={italic} onChange={applyItalic} />
			</Section>

			<Section title="Paragraph">
				<SelectField
					label="Align"
					value={textAlign}
					options={TEXT_ALIGN_OPTIONS}
					onChange={(v) => applyTextAlign(v as typeof textAlign)}
				/>
				<SelectField
					label="Vertical"
					value={verticalAlign}
					options={VERTICAL_ALIGN_OPTIONS}
					onChange={(v) => {
						setVerticalAlign(v);
						applyToSelection({ verticalAlign: v });
					}}
				/>
				<NumberField
					label="Spacing"
					value={letterSpacing}
					min={-100}
					max={500}
					step={0.5}
					unit="px"
					onChange={(v) => {
						setLetterSpacing(v);
						applyToSelection({ letterSpacing: v });
					}}
				/>
				<NumberField
					label="Line H"
					value={lineHeight}
					min={0}
					max={500}
					step={1}
					unit="%"
					onChange={(v) => {
						setLineHeight(v);
						applyToSelection({ lineHeight: { type: "percent", value: v } });
					}}
				/>
			</Section>

			<Section title="Decoration">
				<SelectField
					label="Case"
					value={textCase}
					options={TEXT_CASE_OPTIONS}
					onChange={(v) => {
						setTextCase(v);
						applyToSelection({ textCase: v });
					}}
				/>
				<SelectField
					label="Decor"
					value={textDecoration}
					options={TEXT_DECORATION_OPTIONS}
					onChange={(v) => {
						setTextDecoration(v);
						applyToSelection({ textDecoration: v });
					}}
				/>
				<SelectField
					label="Wrap"
					value={textWrap}
					options={TEXT_WRAP_OPTIONS}
					onChange={(v) => {
						setTextWrap(v);
						applyToSelection({ textWrap: v });
					}}
				/>
			</Section>
		</BaseShapeProperties>
	);
}
