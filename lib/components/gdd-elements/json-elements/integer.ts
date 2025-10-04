import { GDDInputNumberBase } from "./_inputNumberBase.js";

export class GDDInteger extends GDDInputNumberBase {
  render(): boolean {
    const initialRender = super.render();

    // RenderStyle:
    if (this.renderOptions.formStyle === "default") {
      // this.style.display = "grid";
    } else {
      // No style
    }
    return initialRender;
  }

  protected _parseInput(input: string): number | null {
    const int = parseInt(input, 10);
    if (Number.isNaN(int)) return null;
    return int;
  }

  protected _stringifyValue(value: number | undefined): string {
    if (value === undefined) return "";
    if (typeof value === "string") return value;
    return String(value);
  }
}

window.customElements.define("gdd-integer", GDDInteger);
