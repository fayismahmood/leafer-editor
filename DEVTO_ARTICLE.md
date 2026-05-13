# Meet Leafer Editor — A Free, Browser-Based Vector Design Tool

> No installs. No accounts. No cost. Just open the browser and start designing.

---

If you have ever needed to quickly sketch a UI, create a diagram, or put together a simple graphic — and did not want to open a heavy desktop app or sign up for yet another SaaS tool — **Leafer Editor** was built for exactly that moment.

It runs entirely in your browser. Everything you create stays on your machine. And it comes with a surprisingly complete set of design tools that cover the most common tasks you would normally reach for Figma or Illustrator to handle.

Let me walk you through every feature.

---

## The Canvas

When you first open Leafer Editor you are greeted with a clean infinite canvas — a grey workspace with a single white **Frame** sitting in the centre. That frame is your artboard, the area you design inside.

You can pan around the canvas by holding Space and dragging, and zoom in or out with the scroll wheel. The canvas is infinite, so you can place as many frames as you need side by side without running out of room.

---

## Frames — Your Artboards

A **Frame** is the container that holds all your design elements. Think of it like an artboard in Illustrator or a frame in Figma.

- Every shape, image, and text block lives inside a frame
- Frames have a fixed width and height that you set in the Properties panel
- Elements that go outside the frame boundary are clipped and hidden
- You can name frames whatever you like — the name shows up in the Layers panel so you can navigate large designs easily
- You can create as many frames as you need on one canvas — handy for designing multiple screens or states of the same UI side by side

To create a new frame, press **F** or click the Frame tool in the toolbar, then click on the canvas.

---

## The Toolbar

At the bottom of the screen sits the toolbar — eight tools that cover everything you need to build a design:

| Icon | Key | What it does |
|---|---|---|
| Arrow | `V` | Select and move elements |
| Square | `R` | Draw rectangles |
| Circle | `O` | Draw ellipses and circles |
| Line | `L` | Draw straight lines |
| Star | `S` | Draw stars and polygons |
| Text | `T` | Add and edit text |
| Image | `I` | Insert a local image |
| Frame | `F` | Create a new frame / artboard |

Every tool has a keyboard shortcut. Once you learn them, switching tools becomes second nature.

---

## Drawing Shapes

### Rectangle

Press **R** and drag anywhere inside a frame to draw a rectangle. Rectangles are the backbone of most UI designs — buttons, cards, containers, backgrounds.

Once drawn you can:

- Resize it by dragging the corner handles
- Rotate it by hovering just outside a corner until the rotate cursor appears
- Round the corners using the **Corner Radius** slider in the Properties panel
- Change fill colour, stroke, and opacity

### Ellipse

Press **O** and drag to draw an ellipse. Hold Shift while dragging to constrain it to a perfect circle. The Ellipse tool also supports drawing arcs and pie slices — useful for charts and progress indicators — by adjusting the start and end angle in the Properties panel.

### Line

Press **L** and drag to draw a straight line. In the Properties panel you can adjust:

- **Stroke width** — how thick the line is
- **Cap style** — flat, round, or square ends
- **Dash pattern** — turn any line into a dashed or dotted line

### Star

Press **S** and drag to draw a star. What makes this tool especially flexible is that it is not limited to five-point stars:

- Set anywhere from **3 to 20 points**
- Adjust the **inner radius ratio** to go from a sharp star shape all the way to a circle or flower shape
- All the same fill, stroke, and shadow options apply

---

## The Text Tool

Press **T**, click inside a frame, and start typing. Leafer Editor uses an inline text editor built directly into the canvas — there is no modal or separate input box. You type right on the canvas, just like you would in Figma.

Once you have placed a text block, the Properties panel gives you full control over typography:

- **Font family** — choose from a curated list of ~40 popular Google Fonts, with each font previewed in its own typeface in the dropdown
- **Font size**
- **Font weight** — Normal, Bold, 600, or 800
- **Italic**
- **Alignment** — Left, Centre, Right, Justify
- **Line height**
- **Letter spacing**

Fonts are loaded lazily — only the fonts you actually use are downloaded, so the app stays fast.

---

## The Image Tool

Press **I** and a file picker opens immediately. Select any image from your computer (PNG, JPG, WebP, GIF) and it appears on the canvas at a sensible default size. From there you can:

- Drag to reposition
- Resize with the corner handles
- Apply opacity and blend mode effects just like any other element

Everything stays local — your images are not uploaded anywhere.

---

## The Select Tool

Press **V** to switch to the Select tool. This is your main tool for working with elements you have already created.

- **Click** any element to select it and see its properties in the right panel
- **Drag** a selection box over multiple elements to select them all at once
- **Drag** a selected element to move it
- **Drag the corner handles** to resize
- **Hover just outside a corner** then drag to rotate
- **Click an empty area** to deselect everything

When multiple elements are selected, any property change in the panel applies to all of them simultaneously.

---

## The Properties Panel

The right-side panel is context-aware — it shows different controls depending on what you have selected. Here is everything it can do.

### Fill

Every shape and text block can have a fill. Click the colour swatch to open the colour picker.

**Solid fill:**
The colour picker gives you a hue-saturation canvas, a hue slider, an opacity slider, and hex/RGB inputs. Pick any colour precisely or paste a hex code.

**Gradient fill:**
Switch to gradient mode to apply a linear or radial gradient. A gradient bar shows a live preview of your gradient. You can:

- Click anywhere on the bar to add a new colour stop
- Drag stops left or right to reposition them
- Click a stop to edit its colour and opacity
- Double-click a stop to remove it

### Stroke

Add a border to any shape:

- **Colour** — same colour picker as fill
- **Width** — how thick the border is
- **Alignment** — inside the shape, centred on the edge, or outside the shape

### Opacity

A slider from 0% (invisible) to 100% (fully opaque). This controls the transparency of the whole element, including any fill or stroke.

### Blend Mode

Choose how an element composites with whatever is beneath it. All the standard modes are available: Multiply, Screen, Overlay, Darken, Lighten, Colour Dodge, Colour Burn, Hard Light, Soft Light, Difference, Exclusion, Hue, Saturation, Colour, Luminosity.

Blend modes unlock a lot of creative effects — for example, a black rectangle on Multiply lets the texture of the layer below show through.

### Shadow

**Drop Shadow** — projects a shadow behind the element. Controls:

- On/off toggle
- Shadow colour
- Offset X and Y (direction of the shadow)
- Blur (soft vs hard shadow)
- Spread (how much larger or smaller the shadow is than the element)

**Inner Shadow** — projects a shadow inside the element, giving it a pressed-in or embossed look. Same controls as drop shadow.

Both shadows update in real time as you adjust the sliders.

---

## Snap to Grid

When you drag any element, **smart snap guides** appear automatically — dashed lines that show when an element is aligned with another element's edge or centre, or with the canvas grid. The element snaps into place when you are close.

This makes it effortless to keep your design aligned without manual positioning or doing mental arithmetic about coordinates.

---

## The Layers Panel

Switch to the **Layers** tab in the right panel to see your entire canvas as a tree — every frame with all its children listed in order.

### Navigate by clicking
Click any layer row to select that element on the canvas. Great for selecting elements that are hidden behind others or are too small to click accurately.

### Reorder with drag and drop
Drag any layer row up or down to change the stacking order. The canvas updates instantly.

### Rename anything
Double-click any layer name to rename it. Press Enter or click away to confirm. Keeping layers named meaningfully pays off as designs grow.

### Visual hierarchy
Child elements are indented beneath their parent frame. A small type icon (rectangle, circle, text, image, frame) appears beside every row so you can identify elements at a glance.

---

## Keyboard Shortcuts Summary

| Shortcut | Action |
|---|---|
| `V` | Select tool |
| `R` | Rectangle tool |
| `O` | Ellipse tool |
| `L` | Line tool |
| `S` | Star tool |
| `T` | Text tool |
| `I` | Image tool |
| `F` | Frame tool |
| `Space + drag` | Pan canvas |
| `Scroll` | Zoom |
| `Double-click text` | Edit text inline |
| `Double-click layer name` | Rename layer |

---

## Try It Yourself

Leafer Editor runs locally with no backend. Get it running in under a minute:

```bash
git clone https://github.com/your-username/leafer-editor
cd leafer-editor
pnpm install && pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) and start designing.

---

## What's Next

Leafer Editor is actively being developed. On the roadmap:

- **Pen / Bezier tool** — draw custom paths and curves
- **Export** — save frames as PNG or SVG
- **Multiple pages** — organise a multi-screen design in one file
- **Undo / Redo** — full history stack
- **Collaborative editing** — real-time multi-user canvas

---

Whether you are a designer who wants a lightweight tool that gets out of your way, or a developer who wants to understand how a canvas editor is built from the ground up, Leafer Editor is worth a look.

Give it a try and let me know what you think in the comments.

---

**Tags:** `design`, `opensource`, `productivity`, `webdev`
