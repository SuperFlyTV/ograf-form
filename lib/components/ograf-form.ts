import { assertNever, isEqual } from "../lib/lib.js";
import {
  DEFAULT_DICTIONARY,
  type Dictionary,
  type GetGDDElementFunction,
} from "./gdd-elements/lib/_base.js";

import type { GDDSchema } from "../main.js";
import {
  validateGDDSchema,
  getBasicType,
  getDefaultDataFromSchema,
  GDDElementBase,
  GDDMultiLineText,
  GDDFilePath,
  GDDSelect,
  GDDColorRRGGBB,
  GDDColorRRGGBBAA,
  GDDPercentage,
  GDDObject,
  GDDArray,
  GDDString,
  GDDInteger,
  GDDBoolean,
  GDDNumber,
} from "../main.js";

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
  get dictionary(): Partial<Dictionary> {
    const dictionary = this.getAttribute("dictionary") ?? {};
    if (typeof dictionary === "string") return JSON.parse(dictionary);
    return dictionary;
  }
  set dictionary(value: Partial<Dictionary>) {
    this.setAttribute(
      "dictionary",
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }
  public getGDDElement?: GetGDDElementFunctionOptional;
  public postRender?: () => void;

  private _getGDDElement: GetGDDElementFunction = (props): GDDElementBase => {
    // First, use the custom getGDDElement function, if provided:
    const element0 = this.getGDDElement?.(props);
    if (element0) return element0;

    // Then, use the default implementation:
    const basicType = getBasicType(props.schema.type);

    const options = {
      path: props.path,
      getGDDElement: props.getGDDElement,
    };
    const gddType = props.schema.gddType + "/";

    // Go through types in order of most specific to least specific:

    if (basicType === "string" && gddType.startsWith("multi-line/"))
      return new GDDMultiLineText(options);

    if (basicType === "string" && gddType.startsWith("file-path/"))
      return new GDDFilePath(options);

    if (
      (basicType === "string" ||
        basicType === "integer" ||
        basicType === "number") &&
      gddType.startsWith("select/")
    )
      return new GDDSelect(options);

    if (basicType === "string" && gddType.startsWith("color-rrggbb/"))
      return new GDDColorRRGGBB(options);

    if (basicType === "string" && gddType.startsWith("color-rrggbbaa/"))
      return new GDDColorRRGGBBAA(options);

    if (basicType === "number" && gddType.startsWith("percentage/"))
      return new GDDPercentage(options);

    // Finally, resort to one of the basic types:
    if (basicType === "object") return new GDDObject(options);
    if (basicType === "array") return new GDDArray(options);
    if (basicType === "string") return new GDDString(options);
    if (basicType === "integer") return new GDDInteger(options);
    if (basicType === "boolean") return new GDDBoolean(options);
    if (basicType === "number") return new GDDNumber(options);

    // else:
    assertNever(basicType);
    throw new Error(`Unsupported GDD type: ${basicType}`);
  };

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
        this.elContent = this._getGDDElement({
          schema: this.schema,
          path: "data",
          getGDDElement: this._getGDDElement,
        });

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
          dictionary: { ...DEFAULT_DICTIONARY, ...this.dictionary },
        },
      });
    }
    this._renderStyle(formStyle);

    this.postRender?.();
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

export type GetGDDElementFunctionOptional = (
  props: Parameters<GetGDDElementFunction>[0]
) => GDDElementBase | undefined;

window.customElements.define("superflytv-ograf-form", SuperFlyTvOgrafDataForm);
