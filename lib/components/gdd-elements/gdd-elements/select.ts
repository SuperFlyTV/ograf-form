import { isEqual } from "../../../lib/lib.js";
import type { GDDSpecificSchemas } from "../../../lib/types.js";
import { GDDElementBase } from "../lib/_base.js";

export class GDDSelect extends GDDElementBase {
  protected elInput: HTMLSelectElement | null = null;

  private _options: Record<
    string,
    {
      value: any;
      label: string;
    }
  > = {};

  render(): boolean {
    let initialRender = false;
    const schema = this.schema as GDDSpecificSchemas | undefined;
    if (schema?.gddType !== "select") return initialRender;

    if (!this.elInput) {
      initialRender = true;
      this.elInput = document.createElement("select");
      this.appendChild(this.elInput);

      this.elInput.onchange = (e) => {
        if (!e.target) return;

        const option = this._options[(e.target as any).value];
        if (option) {
          this.emitChangeEvent(option.value);
        }
      };
    }

    const options: Record<
      string,
      {
        value: any;
        label: string;
      }
    > = {};

    for (const value of this.schema?.enum || []) {
      const valueStr = `${value}`;
      options[valueStr] = {
        value,
        label: schema.gddOptions.labels?.[valueStr] || valueStr,
      };
    }

    if (!isEqual(options, this._options)) {
      this._options = options;

      for (const value of this.schema?.enum || []) {
        const valueStr = `${value}`;

        const option = this._options[valueStr];
        if (!option) continue;

        const elOption = document.createElement("option");
        this.elInput.appendChild(elOption);
        elOption.value = valueStr;
        elOption.textContent = option.label;
      }
    }

    for (const elOption of this.elInput.children) {
      if (!(elOption instanceof HTMLOptionElement)) continue;
      const option = this._options[elOption.getAttribute("value") || ""];
      if (!option) continue;
      elOption.selected = isEqual(this.value, option.value);
    }

    this._renderStyle();
    return initialRender;
  }

  private _renderStyle() {
    if (!this.elInput) return;

    if (this.renderOptions.formStyle === "default") {
    } else {
      // No style
    }
  }
}

window.customElements.define("gdd-select", GDDSelect);
