import { EditorHelper } from "@leafer-in/editor";
import { useSelector } from "@tanstack/react-store";
import {
	BringToFront,
	ChevronUp,
	Crop,
	Group,
	Lock,
	LockOpen,
	SendToBack,
	Trash2,
	Ungroup,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { editorStore } from "#/store/editor";
import { getCanvasApp } from "#/utils/appInstance";

type MaskType = "path" | "pixel" | "grayscale" | "clipping" | "clipping-path";

const MASK_OPTIONS: { type: MaskType; label: string }[] = [
	{ type: "path", label: "Path" },
	{ type: "pixel", label: "Pixel" },
	{ type: "grayscale", label: "Grayscale" },
	{ type: "clipping", label: "Clipping" },
	{ type: "clipping-path", label: "Clipping Path" },
];

export function ActionBar() {
	const selectedElements = useSelector(editorStore, (s) => s.selectedElements);

	if (selectedElements.length === 0) return null;

	const app = getCanvasApp();
	if (!app) return null;

	const allLocked = selectedElements.every((el) => el.locked);
	const multiSelected = selectedElements.length > 1;
	const hasGroup = selectedElements.some((el) => el.isBranch);

	function handleDelete() {
		for (const el of selectedElements) {
			el.remove();
		}
		app?.editor?.cancel();
	}

	function handleToggleLock() {
		const locked = !allLocked;
		for (const el of selectedElements) {
			el.locked = locked;
		}
		app?.editor?.update();
	}

	function handleBringToFront() {
		EditorHelper.toTop([...selectedElements]);
	}

	function handleSendToBack() {
		EditorHelper.toBottom([...selectedElements]);
	}

	function handleGroup() {
		app?.editor?.group();
	}

	function handleUngroup() {
		app?.editor?.ungroup();
	}

	function handleMask(type: MaskType) {
		const group = app?.editor?.group();
		if (!group) return;
		const children = (
			group as unknown as { children?: { mask: boolean | string }[] }
		).children;
		if (children?.length) {
			children[0].mask = type;
		}
	}

	return (
		<div className="absolute top-3 left-3 z-10 flex items-center gap-0.5 p-1 bg-white border border-gray-200 shadow-lg rounded-lg">
			{multiSelected && (
				<>
					<ActionButton
						icon={<Group className="w-4 h-4" />}
						title="Group"
						onClick={handleGroup}
					/>
					<MaskPopover onSelect={handleMask} />
					<div className="w-px h-5 bg-gray-200 mx-0.5" />
				</>
			)}
			{hasGroup && (
				<>
					<ActionButton
						icon={<Ungroup className="w-4 h-4" />}
						title="Ungroup"
						onClick={handleUngroup}
					/>
					<div className="w-px h-5 bg-gray-200 mx-0.5" />
				</>
			)}
			<ActionButton
				icon={<BringToFront className="w-4 h-4" />}
				title="Bring to Front"
				onClick={handleBringToFront}
			/>
			<ActionButton
				icon={<SendToBack className="w-4 h-4" />}
				title="Send to Back"
				onClick={handleSendToBack}
			/>
			<div className="w-px h-5 bg-gray-200 mx-0.5" />
			<ActionButton
				icon={
					allLocked ? (
						<Lock className="w-4 h-4" />
					) : (
						<LockOpen className="w-4 h-4" />
					)
				}
				title={allLocked ? "Unlock" : "Lock"}
				onClick={handleToggleLock}
			/>
			<div className="w-px h-5 bg-gray-200 mx-0.5" />
			<ActionButton
				icon={<Trash2 className="w-4 h-4 text-red-500" />}
				title="Delete"
				onClick={handleDelete}
			/>
		</div>
	);
}

function MaskPopover({ onSelect }: { onSelect: (type: MaskType) => void }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

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

	return (
		<div ref={ref} className="relative">
			<div className="flex cursor-pointer">
				<button
					type="button"
					title="Mask"
					className="flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
					onClick={() => onSelect("path")}
				>
					<Crop className="w-4 h-4" />
				</button>
				<button
					type="button"
					onClick={() => setOpen((prev) => !prev)}
					className="h-8 flex items-center ml-0.5 rounded hover:bg-gray-100"
				>
					<ChevronUp className="my-auto" size={12} />
				</button>
			</div>
			{open && (
				<div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 flex flex-col gap-0.5 z-20 min-w-[140px]">
					<span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 py-1">
						Mask Type
					</span>
					{MASK_OPTIONS.map(({ type, label }) => (
						<button
							key={type}
							type="button"
							className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
							onClick={() => {
								onSelect(type);
								setOpen(false);
							}}
						>
							<span className="flex-1 text-left">{label}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

function ActionButton({
	icon,
	title,
	onClick,
}: {
	icon: React.ReactNode;
	title: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			title={title}
			className="flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
			onClick={onClick}
		>
			{icon}
		</button>
	);
}
