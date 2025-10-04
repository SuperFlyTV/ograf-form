import { GDDElementBase } from "../lib/_base.js";

export class GDDMultiLineText extends GDDElementBase {
  protected elInput: HTMLTextAreaElement | null = null;

  render(): boolean {
    let initialRender = false;
    if (!this.elInput) {
      initialRender = true;
      this.elInput = document.createElement("textarea");
      this.appendChild(this.elInput);

      this.elInput.onchange = (e) => {
        if (!e.target) return;
        this.emitOnChange((e.target as any).value);
        this._renderStyle();
      };
      this.elInput.onkeydown = (e) => {
        if (!e.target) return;
        this.emitOnKeyDown(e, (e.target as any).value, (e.target as any).value);
      };
      this.elInput.onkeyup = (e) => {
        if (!e.target) return;
        this.emitOnKeyUp(e, (e.target as any).value, (e.target as any).value);
        this._renderStyle();
      };
    }

    this.elInput.name = this.path;

    this.elInput.value = this.data || "";

    this._renderStyle();
    return initialRender;
  }

  private _renderStyle() {
    if (!this.elInput) return;

    const lines = this.elInput.value.split("\n");
    const maxLength = lines.reduce(
      (max, line) => Math.max(max, line.length),
      0
    );

    if (this.renderOptions.formStyle === "default") {
      this.elInput.rows = lines.length;
      this.elInput.cols = Math.max(10, maxLength + 1);
    } else {
      // No style
    }
  }
}

window.customElements.define("gdd-multiline-text", GDDMultiLineText);
