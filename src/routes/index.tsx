import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Circle,
	Crop,
	Download,
	Edit3,
	Frame,
	Grid3X3,
	ImageIcon,
	Layers,
	Minus,
	MousePointer2,
	MoveDiagonal,
	Palette,
	PenLine,
	Shapes,
	SlidersHorizontal,
	Sparkles,
	Square,
	Star,
	Type,
	Zap,
} from "lucide-react";
import { RiArrowRightLine, RiGithubFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col">
			<Nav />

			<main>
				<Hero />
				<Stats />
				<ToolShowcase />
				<Workflow />
				<Capabilities />
				<CTASection />
			</main>

			<Footer />
		</div>
	);
}

/* ─── Navigation ─── */
function Nav() {
	return (
		<header className="animate-in fade-in slide-in-from-top-2 duration-500 sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center border border-border bg-primary motion-safe:animate-float">
						<Edit3 className="size-3.5 text-primary-foreground" />
					</div>
					<span className="text-xs font-semibold tracking-widest uppercase">
						Leafer Editor
					</span>
				</div>
				<div className="flex items-center gap-3">
					<a
						href="https://github.com"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						<RiGithubFill className="size-4" />
					</a>
					<Link to="/edit">
						<Button variant="outline" size="sm">
							Open Editor
							<RiArrowRightLine className="size-3" />
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}

/* ─── Hero ─── */
function Hero() {
	return (
		<section className="relative overflow-hidden border-b border-border">
			<FloatingShapes />
			<GeometricBackground />

			<div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
				<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6 flex items-center gap-2 rounded-none border border-border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
					<Sparkles className="size-3 text-primary motion-safe:animate-pulse-soft" />
					<span>Now in public beta</span>
				</div>

				<h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 font-heading max-w-2xl text-5xl font-bold tracking-tight leading-tight">
					Design{" "}
					<span className="bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">
						vector graphics
					</span>{" "}
					<br />
					right in your browser.
				</h1>

				<p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
					A fast, open-source 2D design editor powered by Leafer UI. Draw shapes,
					edit text, manage layers, and export to production-ready formats — all
					with zero setup.
				</p>

				<div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 mt-10 flex flex-wrap items-center justify-center gap-3">
					<Link to="/edit">
						<Button variant="default" size="lg" className="gap-2">
							Start Designing
							<ArrowRight className="size-4" />
						</Button>
					</Link>
					<Link to="/edit">
						<Button variant="outline" size="lg">
							Open Demo Canvas
						</Button>
					</Link>
				</div>

				<div className="animate-in fade-in zoom-in-95 duration-700 delay-500 mt-16 w-full max-w-3xl">
					<EditorPreview />
				</div>
			</div>
		</section>
	);
}

function FloatingShapes() {
	return (
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden"
			aria-hidden="true"
		>
			<Square
				className="animate-float-slow absolute top-1/4 left-[10%] size-8 -rotate-12 text-primary/15 stroke-1"
				style={{ animationDelay: "0s" }}
			/>
			<Circle
				className="animate-float absolute top-[15%] right-[15%] size-10 text-muted-foreground/10 stroke-1"
				style={{ animationDelay: "1.5s" }}
			/>
			<Star
				className="animate-float-slow absolute bottom-1/3 left-[5%] size-6 rotate-12 text-primary/10 stroke-1"
				style={{ animationDelay: "3s" }}
			/>
			<Minus
				className="animate-float absolute top-[10%] right-[30%] size-16 rotate-45 text-muted-foreground/8 stroke-1"
				style={{ animationDelay: "4.5s" }}
			/>
			<Frame
				className="animate-float-slow absolute bottom-[25%] right-[8%] size-12 -rotate-6 text-primary/10 stroke-1"
				style={{ animationDelay: "2s" }}
			/>
			<Type
				className="animate-float absolute top-[40%] left-[85%] size-7 text-muted-foreground/10 stroke-1"
				style={{ animationDelay: "5s" }}
			/>
		</div>
	);
}

function GeometricBackground() {
	return (
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.06]"
			aria-hidden="true"
		>
			<svg width="100%" height="100%">
				<defs>
					<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
						<path
							d="M 40 0 L 0 0 0 40"
							fill="none"
							stroke="currentColor"
							strokeWidth="1"
						/>
					</pattern>
				</defs>
				<title>Grid pattern</title>
				<rect width="100%" height="100%" fill="url(#grid)" />
			</svg>
		</div>
	);
}

function EditorPreview() {
	return (
		<div className="group relative overflow-hidden rounded-none border border-border bg-muted/30 p-2 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-center gap-1.5 border-b border-border px-3 pb-2">
				<div className="size-2 rounded-full bg-red-400 motion-safe:animate-pulse" />
				<div
					className="size-2 rounded-full bg-yellow-400 motion-safe:animate-pulse"
					style={{ animationDelay: "0.2s" }}
				/>
				<div
					className="size-2 rounded-full bg-green-400 motion-safe:animate-pulse"
					style={{ animationDelay: "0.4s" }}
				/>
				<span className="ml-2 text-[10px] text-muted-foreground">
					Untitled — Leafer Editor
				</span>
			</div>
			<div className="relative flex h-48 items-center justify-center bg-background/50">
				<div
					className="absolute inset-0 opacity-[0.04]"
					style={{
						backgroundImage:
							"radial-gradient(circle, currentColor 1px, transparent 1px)",
						backgroundSize: "20px 20px",
					}}
				/>
				<div className="relative flex flex-wrap items-center justify-center gap-6 opacity-40">
					<Square className="animate-float size-16 rotate-12 text-primary stroke-1" />
					<Circle
						className="animate-float-slow size-12 text-muted-foreground stroke-1"
						style={{ animationDelay: "1s" }}
					/>
					<Star
						className="animate-float size-14 -rotate-6 text-primary stroke-1"
						style={{ animationDelay: "2s" }}
					/>
					<Minus
						className="animate-float-slow size-20 rotate-45 text-muted-foreground stroke-1"
						style={{ animationDelay: "0.5s" }}
					/>
					<Frame
						className="animate-float size-16 text-primary stroke-1"
						style={{ animationDelay: "3s" }}
					/>
					<Type
						className="animate-float-slow size-12 text-muted-foreground stroke-1"
						style={{ animationDelay: "1.5s" }}
					/>
				</div>
			</div>
		</div>
	);
}

/* ─── Stats ─── */
function Stats() {
	return (
		<section className="animate-reveal-up border-b border-border bg-muted/20">
			<div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center divide-x divide-border px-6 py-14">
				{[
					{ value: "100%", label: "Open Source" },
					{ value: "Canvas", label: "Vector Rendering" },
					{ value: "9+", label: "Built-in Tools" },
					{ value: "Export", label: "6 Formats" },
				].map((stat) => (
					<div
						key={stat.label}
						className="flex flex-col items-center px-10 py-4 text-center transition-transform hover:scale-105"
					>
						<span className="font-heading text-2xl font-bold tabular-nums tracking-tight motion-safe:animate-pulse-soft">
							{stat.value}
						</span>
						<span className="mt-1 text-xs text-muted-foreground">
							{stat.label}
						</span>
					</div>
				))}
			</div>
		</section>
	);
}

/* ─── Tool Showcase ─── */
function ToolShowcase() {
	return (
		<section className="border-b border-border">
			<div className="mx-auto max-w-5xl px-6 py-24">
				<div className="animate-reveal-up mb-12 flex flex-col items-center gap-3 text-center">
					<div className="inline-flex items-center gap-2 rounded-none border border-border px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
						<Shapes className="size-3" />
						Toolkit
					</div>
					<h2 className="font-heading text-3xl font-bold tracking-tight">
						Everything you need to create
					</h2>
					<p className="max-w-lg text-sm text-muted-foreground">
						A focused set of vector tools that cover the full design workflow.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{[
						{ icon: MousePointer2, label: "Select", shortcut: "V" },
						{ icon: Square, label: "Rectangle", shortcut: "R" },
						{ icon: Circle, label: "Ellipse", shortcut: "O" },
						{ icon: Minus, label: "Line", shortcut: "L" },
						{ icon: Star, label: "Star", shortcut: "" },
						{ icon: PenLine, label: "Pen", shortcut: "P" },
						{ icon: Type, label: "Text", shortcut: "T" },
						{ icon: Frame, label: "Frame", shortcut: "F" },
						{ icon: ImageIcon, label: "Image", shortcut: "" },
					].map(({ icon: Icon, label, shortcut }) => (
						<div
							key={label}
							className="animate-reveal-scale group flex items-center gap-3 rounded-none border border-border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/30 hover:shadow-sm"
						>
							<div className="flex size-8 shrink-0 items-center justify-center border border-border bg-background transition-colors group-hover:border-primary/30">
								<Icon className="size-3.5 text-primary transition-transform duration-200 group-hover:scale-110" />
							</div>
							<div className="flex flex-1 items-center justify-between">
								<span className="text-xs font-medium">{label}</span>
								{shortcut && (
									<kbd className="rounded-none border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:bg-background">
										{shortcut}
									</kbd>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Workflow ─── */
function Workflow() {
	return (
		<section className="border-b border-border bg-muted/20">
			<div className="mx-auto max-w-5xl px-6 py-24">
				<div className="animate-reveal-up mb-16 flex flex-col items-center gap-3 text-center">
					<div className="inline-flex items-center gap-2 rounded-none border border-border px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
						<Zap className="size-3" />
						Workflow
					</div>
					<h2 className="font-heading text-3xl font-bold tracking-tight">
						From blank canvas to final export
					</h2>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{[
						{
							step: "01",
							icon: Edit3,
							title: "Create & Draw",
							desc: "Pick a tool, click on the canvas, and start drawing. Drag to create shapes, frames, and text blocks with pixel-perfect precision.",
						},
						{
							step: "02",
							icon: SlidersHorizontal,
							title: "Style & Arrange",
							desc: "Adjust fill colors, strokes, shadows, and blend modes. Group elements, control z-order, lock, and align with ease.",
						},
						{
							step: "03",
							icon: Download,
							title: "Export & Ship",
							desc: "Export individual elements or entire frames as PNG, JPG, WebP, BMP, JSON, or Canvas — ready for production.",
						},
					].map(({ step, icon: Icon, title, desc }, i) => (
						<div
							key={step}
							className={`animate-reveal-up-stagger-${i + 1} group relative flex flex-col gap-4 rounded-none border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md`}
						>
							<span className="absolute top-3 right-4 font-heading text-4xl font-bold text-muted/30 transition-colors group-hover:text-primary/10">
								{step}
							</span>
							<div className="flex size-9 items-center justify-center border border-border bg-background transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
								<Icon className="size-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary-foreground" />
							</div>
							<div>
								<h3 className="text-sm font-semibold">{title}</h3>
								<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
									{desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── Capabilities ─── */
function Capabilities() {
	return (
		<section className="border-b border-border">
			<div className="mx-auto max-w-5xl px-6 py-24">
				<div className="animate-reveal-up mb-16 flex flex-col items-center gap-3 text-center">
					<div className="inline-flex items-center gap-2 rounded-none border border-border px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground">
						<Grid3X3 className="size-3" />
						Capabilities
					</div>
					<h2 className="font-heading text-3xl font-bold tracking-tight">
						Built for precision design work
					</h2>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[
						{
							icon: Palette,
							title: "Color & Blending",
							desc: "Solid fills, gradients, opacity controls, blend modes, and inner/drop shadows.",
						},
						{
							icon: Layers,
							title: "Layer Management",
							desc: "Full layer tree with drag-to-reorder, rename, lock, visibility toggle, and deletion.",
						},
						{
							icon: Grid3X3,
							title: "Snap to Grid",
							desc: "Precision snapping that keeps elements aligned as you draw and move them on the canvas.",
						},
						{
							icon: Frame,
							title: "Artboard Presets",
							desc: "Quick-start frames for paper sizes, screen dimensions, and social media formats.",
						},
						{
							icon: Crop,
							title: "Group & Mask",
							desc: "Group multiple elements together. Apply masks for advanced shape clipping workflows.",
						},
						{
							icon: MoveDiagonal,
							title: "Z-Order Control",
							desc: "Bring to front, send to back, and reorder layers with toolbar actions or the layer tree.",
						},
						{
							icon: Type,
							title: "Rich Typography",
							desc: "Custom fonts, weights, sizes, line height, letter spacing, italic, and text alignment.",
						},
						{
							icon: ImageIcon,
							title: "Image Import",
							desc: "Drag-and-drop image placement with automatic size detection and aspect ratio handling.",
						},
						{
							icon: Download,
							title: "Multi-Format Export",
							desc: "PNG, JPG, WebP, BMP at any resolution, plus JSON and native Canvas export.",
						},
					].map(({ icon: Icon, title, desc }) => (
						<div
							key={title}
							className="animate-reveal-scale group flex flex-col gap-3 rounded-none border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-muted/20 hover:shadow-sm"
						>
							<div className="flex size-8 items-center justify-center border border-border bg-background transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
								<Icon className="size-3.5 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary-foreground" />
							</div>
							<div>
								<h3 className="text-xs font-semibold">{title}</h3>
								<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
									{desc}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ─── CTA ─── */
function CTASection() {
	return (
		<section className="animate-reveal-up relative overflow-hidden border-b border-border bg-primary/5">
			<div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
				<div className="mb-4 inline-flex size-12 items-center justify-center border border-border bg-background transition-all hover:shadow-md motion-safe:animate-float">
					<Edit3 className="size-5 text-primary" />
				</div>
				<h2 className="font-heading text-3xl font-bold tracking-tight">
					Ready to start designing?
				</h2>
				<p className="mt-3 max-w-md text-sm text-muted-foreground">
					No sign-up, no installation. Open the editor and start creating vector
					graphics instantly.
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
					<Link to="/edit">
						<Button
							variant="default"
							size="lg"
							className="group/cta gap-2 transition-transform hover:scale-105"
						>
							Launch Editor
							<ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
						</Button>
					</Link>
					<Button variant="ghost" size="lg" className="gap-2" disabled>
						<Download className="size-4" />
						Desktop App Soon
					</Button>
				</div>
			</div>
		</section>
	);
}

/* ─── Footer ─── */
function Footer() {
	return (
		<footer className="animate-reveal-up border-t border-border">
			<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-8">
				<div className="flex items-center gap-1">
					<div className="flex size-5 items-center justify-center border border-border bg-primary">
						<Edit3 className="size-2.5 text-primary-foreground" />
					</div>
					<span className="text-xs font-semibold tracking-widest uppercase">
						Leafer Editor
					</span>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
					<Link
						to="/edit"
						className="hover:text-foreground transition-colors duration-200"
					>
						Editor
					</Link>
					<span className="cursor-default transition-colors hover:text-foreground">
						Docs
					</span>
					<span className="cursor-default transition-colors hover:text-foreground">
						Changelog
					</span>
					<span className="cursor-default transition-colors hover:text-foreground">
						GitHub
					</span>
				</div>
				<p className="text-xs text-muted-foreground/60">
					Built with Leafer UI & React. Open source.
				</p>
			</div>
		</footer>
	);
}
