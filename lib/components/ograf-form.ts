import { isEqual } from "../lib/lib.js";
import type { GDDSchema } from "../lib/types.js";
import { validateGDDSchema } from "../lib/validate-schema.js";
import { getDefaultDataFromSchema } from "../main.js";
import { GDDElementBase, getGDDElement } from "./gdd-elements/index.js";
import type { Dictionary } from "./gdd-elements/lib/lib.js";

export class SuperFlyTvOgrafDataForm extends HTMLElement {
  private elError = document.createElement("div");
  private elForm: HTMLFormElement | null = null;
  private elContent: GDDElementBase | null = null;

  constructor() {
    super();

    this.elError.style.fontFamily = "monospace";
    this.elError.style.whiteSpace = "pre";
  }
  connectedCallback(): void {
    this.appendChild(this.elError);

    // Check this.value attribute, set to default value if not present:
    if (this.schema !== null && this.value === null) {
      const newValue = getDefaultDataFromSchema(this.schema);

      if (!isEqual(this.value, newValue)) {
        this.value = newValue;

        // Emit change event, so that any listeners are aware of the new value:
        this.dispatchEvent(GDDElementBase.getChangeEvent(this.value));
      }
    }

    this.render();
  }

  static get observedAttributes() {
    return [
      "schema",
      "value",
      "formStyle",
      "dictionary",
      "onchange",
      "onkeydown",
      "onkeyup",
    ];
  }
  get schema(): GDDSchema | null {
    const schema = this.getAttribute("schema");
    if (typeof schema === "string") return JSON.parse(schema);
    return schema;
  }
  set schema(value: GDDSchema) {
    this.setAttribute("schema", JSON.stringify(value));
  }
  get value(): any | null {
    const value = this.getAttribute("value");
    if (value === "") return undefined;
    if (typeof value === "string") return JSON.parse(value);
    return value;
  }
  set value(value: any) {
    this.setAttribute(
      "value",
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  get formStyle(): string | null {
    return this.getAttribute("formStyle");
  }
  set formStyle(formStyle: string) {
    this.setAttribute("formStyle", formStyle);
  }
  get dictionary(): Dictionary | null {
    const dictionary = this.getAttribute("dictionary");
    if (typeof dictionary === "string") return JSON.parse(dictionary);
    return dictionary;
  }
  set dictionary(value: Dictionary) {
    this.setAttribute(
      "dictionary",
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  attributeChangedCallback(name: string, _oldValue: any, _newValue: any): void {
    if (name === "value" || name === "schema") {
      this.render();
    }
  }

  private render() {
    const error = this._getError();

    if (error) {
      if (this.elForm) {
        this.removeChild(this.elForm);
        this.elForm = null;
      }

      this.elError.innerText = error;
      return;
    } else {
      this.elError.innerHTML = "";
    }

    if (!this.elForm) {
      this.elForm = document.createElement("form");
      this.appendChild(this.elForm);
    }

    if (!this.elContent) {
      if (this.schema) {
        this.elContent = getGDDElement(this.schema, "");
        this.elForm.appendChild(this.elContent);

        this.elContent.addEventListener("change", (e) => {
          if (!(e instanceof CustomEvent)) return;

          // Update this.value at this point, so that e.target.value is correct
          // for any listeners further up the chain:
          this.value = e.detail.value;

          // Re-emit the event, so that the target becomes this form:
          e.stopPropagation();
          this.dispatchEvent(GDDElementBase.getChangeEvent(this.value));
        });
        this.elContent.addEventListener("keyup", (e) => {
          if (!(e instanceof CustomEvent)) return;

          // Update this.value at this point, so that e.target.value is correct
          // for any listeners further up the chain:
          this.value = e.detail.value;

          // Re-emit the event, so that the target becomes this form:
          e.stopPropagation();
          this.dispatchEvent(
            GDDElementBase.getKeyUpEvent(e, e.detail.valueStr, this.value)
          );
        });
      }
    }

    const formStyle = this.formStyle === null ? "default" : this.formStyle;
    if (this.elContent && this.schema) {
      this.elContent.update({
        schema: this.schema,
        value: this.value,
        renderOptions: {
          formStyle,
        },
      });
    }
    this._renderStyle(formStyle);
  }
  private _renderStyle(formStyle: string) {
    if (formStyle === "default") {
      this.style.display = "block";
    }
  }
  private _getError(): string | null {
    if (this.schema === null) {
      return `No Schema provided`;
    }

    try {
      validateGDDSchema(this.schema);
    } catch (err) {
      return `Bad Schema: ${
        err instanceof Error ? err.message : err
      }\n${JSON.stringify(this.schema, null, 2)}`;
    }
    return null;
  }
}
window.customElements.define("superflytv-ograf-form", SuperFlyTvOgrafDataForm);
