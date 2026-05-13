import { useEffect, useRef } from "react";
import { applyCanvas } from "./editor/editorCanvas";

export function LeaferCanvas() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (containerRef.current) {
			applyCanvas(containerRef.current);
		}
	}, []);

	return (
		<div
			ref={containerRef}
			className="w-full h-full overflow-hidden bg-[#f0f0f0]"
			style={{ touchAction: "none" }}
		/>
	);
}
