import { GDDInputBase } from "../json-elements/_inputBase.js";

export class GDDColorRRGGBB extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    if (initialRender) {
      this.elInput.type = "color";
      this.elInput.name = this.path;

      this.elInput.onchange = (e) => {
        if (!e.target) return;
        this.emitChangeEvent((e.target as any).value);
      };
    }

    this.elInput.value = this.value || "";
    this._renderStyle();
    return initialRender;
  }

  private _renderStyle() {
    if (this.renderOptions.formStyle === "default") {
      // this.style.display = "grid";
    } else {
      // No style
    }
  }
}

window.customElements.define("gdd-color-rrggbb", GDDColorRRGGBB);
