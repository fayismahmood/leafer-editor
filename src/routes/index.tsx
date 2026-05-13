import { createFileRoute } from "@tanstack/react-router";
import { ActionBar } from "#/components/ActionBar";
import { LeaferCanvas } from "#/components/LeaferCanvas";
import { PropertiesPanel } from "#/components/PropertiesPanel";
import { Toolbar } from "#/components/Toolbar";

export const Route = createFileRoute("/")({ component: EditorPage });

function EditorPage() {
	return (
		<div className="flex h-screen w-screen overflow-hidden">
			<Toolbar />
			<div className="flex-1 relative overflow-hidden">
				<ActionBar />
				<LeaferCanvas />
			</div>
			<PropertiesPanel />
		</div>
	);
}
