import { GDDInputBase } from "./_inputBase.js";

export class GDDBoolean extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();
    if (!this.elInput) return initialRender;

    if (initialRender) {
      this.elInput.type = "checkbox";
      this.elInput.name = this.path;

      this.elInput.onchange = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;

        const checked = Boolean(e.target.checked);

        if (this.data !== checked) {
          this.data = checked;
          this.emitOnKeyUp(e, "", checked);
          this.emitOnChange(this.data);
        }
        e.target.checked = Boolean(this.data);
      };
    }
    this.elInput.checked = Boolean(this.data);

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

window.customElements.define("gdd-boolean", GDDBoolean);
