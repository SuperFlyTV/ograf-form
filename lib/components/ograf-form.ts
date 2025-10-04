import type { GDDSchema } from "../lib/types.js";
import { validateGDDSchema } from "../lib/validate-schema.js";
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

    this.render();
  }
  static get observedAttributes() {
    return ["schema", "data", "formStyle", "dictionary"];
  }
  get schema(): GDDSchema | null {
    const schema = this.getAttribute("schema");
    if (typeof schema === "string") return JSON.parse(schema);
    return schema;
  }
  set schema(value: GDDSchema) {
    this.setAttribute("schema", JSON.stringify(value));
  }
  get data(): any | null {
    const data = this.getAttribute("data");
    if (typeof data === "string") return JSON.parse(data);
    return data;
  }
  set data(value: any) {
    this.setAttribute(
      "data",
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
    if (name === "data" || name === "schema") {
      this.render();
    }
  }
  onDataUpdated(data: unknown) {
    const event = new CustomEvent("data", {
      bubbles: true,
      cancelable: false,
      detail: { data },
    });
    this.dispatchEvent(event);
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
        this.elContent = getGDDElement(this.schema, "data");
        this.elForm.appendChild(this.elContent);
        this.elContent.addEventListener("data", (data) => {
          this.onDataUpdated(data);
        });
      }
    }

    const formStyle = this.formStyle === null ? "default" : this.formStyle;
    if (this.elContent && this.schema) {
      this.elContent.update({
        schema: this.schema,
        data: this.data,
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
