import { GDDInputBase } from "./_inputBase.js";

export class GDDString extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    this.elInput.type = "text";
    this.elInput.name = this.path;

    this.elInput.onchange = (e) => {
      if (!e.target) return;
      this.emitOnChange((e.target as any).value);
    };
    this.elInput.onkeydown = (e) => {
      if (!e.target) return;
      this.emitOnKeyDown(e, (e.target as any).value, (e.target as any).value);
    };
    this.elInput.onkeyup = (e) => {
      if (!e.target) return;
      this.emitOnKeyUp(e, (e.target as any).value, (e.target as any).value);
    };

    this.elInput.value = this.data || "";
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
