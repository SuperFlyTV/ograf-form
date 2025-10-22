import { GDDInputBase } from "./_inputBase.js";

export class GDDString extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    this.elInput.type = "text";
    this.elInput.name = this.path;

    this.elInput.onchange = (e) => {
      if (!e.target) return;
      if (!(e.target instanceof HTMLInputElement)) return;
      e.stopPropagation();
      this.emitChangeEvent(e.target.value);
    };

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

window.customElements.define("gdd-string", GDDString);
