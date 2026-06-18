import { HTMLText } from "@leafer-in/html";

export function applyRichTextPlugin() {
  const proto = HTMLText.prototype as any;
  const origUpdateBoxBounds = proto.__updateBoxBounds;

  proto.__updateBoxBounds = function () {
    const data = this.__;
    const wasChanged = data.__htmlChanged;

    if (wasChanged) {
      const explicitWidth = this.__width || this.width;

      if (explicitWidth > 0) {
        const pr = data.pixelRatio || 1;
        const div = document.createElement("div");
        div.style.all = "initial";
        div.style.position = "absolute";
        div.style.visibility = "hidden";
        div.style.width = explicitWidth + "px";
        div.innerHTML = this.text;
        document.body.appendChild(div);

        const { height } = div.getBoundingClientRect();
        const svgW = Math.ceil(explicitWidth * pr);
        const svgH = Math.ceil(height * pr);

        const svg = `<svg xmlns="http://www.w3.org/2000/svg">
<foreignObject width="100%" height="100%">
<style>*{margin:0;padding:0;box-sizing:border-box}</style>
<body xmlns="http://www.w3.org/1999/xhtml" style="width:${explicitWidth}px">${this.decodeText(this.text)}</body>
</foreignObject>
</svg>`;

        data.__setImageFill("data:image/svg+xml," + encodeURIComponent(svg));
        data.__naturalWidth = svgW / pr;
        data.__naturalHeight = svgH / pr;
        data.__htmlChanged = false;
        div.remove();

        this.height = data.__naturalHeight;

        if (this.textEditing) {
          this.width = data.__naturalWidth;
          this.scaleX = 1;
          this.scaleY = 1;
        }

        return;
      }

      origUpdateBoxBounds.call(this);

      if (this.textEditing) {
        if (data.__naturalWidth != null && data.__naturalHeight != null) {
          this.width = data.__naturalWidth;
          this.height = data.__naturalHeight;
          this.scaleX = 1;
          this.scaleY = 1;
        }
      }
      return;
    }

    origUpdateBoxBounds.call(this);
  };
}
