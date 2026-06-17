import { useEffect, useState } from "react";
import { useSelector } from "@tanstack/react-store";
import { editorStore, setFontFamily, setFontSize, setFontWeight, setItalic, setTextAlign } from "#/store/editor";
import { BaseShapeProperties } from "./BaseShapeProperties";
import { NumberField, Section, SelectField, ToggleField } from "./fields";
import { FontPicker } from "./fields/FontPicker";
import { applyToSelection } from "./selectionActions";

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

export function RichTextProperties() {
  const selectedElements = useSelector(editorStore, (s) => s.selectedElements);
  const fontSize = useSelector(editorStore, (s) => s.fontSize);
  const fontFamily = useSelector(editorStore, (s) => s.fontFamily);
  const fontWeight = useSelector(editorStore, (s) => s.fontWeight);
  const italic = useSelector(editorStore, (s) => s.italic);
  const textAlign = useSelector(editorStore, (s) => s.textAlign);

  const el = selectedElements[0] as any;
  const [htmlContent, setHtmlContent] = useState(el?.text ?? "");

  useEffect(() => {
    setHtmlContent(el?.text ?? "");
  }, [selectedElements]);

  function applyHtmlContent(html: string) {
    setHtmlContent(html);
    applyToSelection({ text: html });
  }

  return (
    <BaseShapeProperties>
      <Section title="HTML Content">
        <textarea
          className="w-full min-h-[120px] p-2 text-xs font-mono border border-gray-200 rounded resize-y focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={htmlContent}
          onChange={(e) => applyHtmlContent(e.target.value)}
          placeholder="<p>Enter HTML...</p>"
        />
      </Section>

      <Section title="Font">
        <NumberField
          label="Size"
          value={fontSize}
          onChange={(v) => {
            setFontSize(v);
            applyToSelection({ fontSize: v });
          }}
          min={1}
          max={999}
          unit="px"
        />
        <div className="col-span-full flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-medium leading-none">
            Family
          </label>
          <FontPicker
            value={fontFamily}
            onChange={(v) => {
              setFontFamily(v);
              applyToSelection({ fontFamily: v });
            }}
          />
        </div>
        <SelectField
          label="Weight"
          value={String(fontWeight)}
          options={FONT_WEIGHT_OPTIONS}
          onChange={(v) => {
            setFontWeight(Number(v));
            applyToSelection({ fontWeight: Number(v) });
          }}
        />
        <ToggleField
          label="Italic"
          value={italic}
          onChange={(v) => {
            setItalic(v);
            applyToSelection({ italic: v });
          }}
        />
      </Section>

      <Section title="Paragraph">
        <SelectField
          label="Align"
          value={textAlign}
          options={TEXT_ALIGN_OPTIONS}
          onChange={(v) => {
            setTextAlign(v as typeof textAlign);
            applyToSelection({ textAlign: v });
          }}
        />
      </Section>
    </BaseShapeProperties>
  );
}
