import type { GDDSpecificSchemas } from "../../../lib/types.js";
import { GDDInputBase } from "../json-elements/_inputBase.js";

export class GDDFilePath extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    const schema = this.schema as GDDSpecificSchemas | undefined;
    if (schema?.gddType !== "file-path") return initialRender;

    if (initialRender) {
      this.elInput.type = "file";
      this.elInput.accept =
        schema.gddOptions.extensions.map((e) => `.${e}`).join(",") || "*";
      this.elInput.name = this.path;

      // this.elInput.style.fontFamily = "monospace";

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
    }

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

window.customElements.define("gdd-file-path", GDDFilePath);
