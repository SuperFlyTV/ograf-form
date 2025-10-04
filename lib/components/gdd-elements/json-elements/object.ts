import { GDDElementBase, isCustomEvent } from "../lib/_base.js";
import { getBasicType, getGDDElement } from "../index.js";
import { renderContentError } from "../lib/lib.js";

export class GDDObject extends GDDElementBase {
  private content: Record<string, GDDElementBase> = {};

  constructor() {
    super();
  }

  render(): boolean {
    if (!this.data) this.data = {};

    const properties = Object.entries(this.schema?.properties ?? {}).sort(
      (a, b) => {
        const aRank = a[1].rank ?? 0;
        const bRank = b[1].rank ?? 0;

        if (aRank > bRank) return 1;
        if (aRank < bRank) return -1;
        return 0;
      }
    );

    const existingKeys = new Set();
    for (const [key, schema] of properties) {
      existingKeys.add(key);
      if (!this.content[key]) {
        const el = new GDDObjectProperty();
        el.path = `${this.path}.${key}`;
        this.content[key] = el;
        this.appendChild(el);

        el.addEventListener("onChange", (e: Event) => {
          if (!(e instanceof CustomEvent)) return;
          e.stopPropagation();

          this.data[key] = e.detail.data;

          this.emitOnChange(this.data);
        });
        el.addEventListener("onKeyUp", (e: Event) => {
          if (!(e instanceof CustomEvent)) return;
          e.stopPropagation();
          this.data[key] = e.detail.data;
          this.emitOnKeyUp(e, "<object>", this.data);
        });
      }

      schema.title = schema.title || key;
      const data = this.data[key];

      this.content[key].update({
        schema,
        data,
        renderOptions: this.renderOptions,
      });
    }
    for (const [key, el] of Object.entries(this.content)) {
      if (existingKeys.has(key)) continue; // still exists
      // else remove:
      this.removeChild(el);
      delete this.content[key];
    }
    this._renderStyle();
    return false;
  }
  private _renderStyle() {
    if (this.renderOptions.formStyle === "default") {
      this.style.display = "block";

      if (this.path.includes(".")) {
        this.style.borderLeft = "3px solid gray";
      }
    } else {
      // No style
    }
  }
}
export class GDDObjectProperty extends GDDElementBase {
  private content: {
    // labelContainer: HTMLDivElement;
    label: HTMLLabelElement;
    description: HTMLSpanElement;
    content: GDDElementBase;
    contentError: HTMLDivElement;
  } | null = null;

  connectedCallback(): void {}

  render(): boolean {
    if (!this.schema) return false;
    let initialRender = false;

    const basicType = getBasicType(this.schema.type);

    if (!this.content) {
      initialRender = true;
      this.content = {
        // labelContainer: document.createElement("div"),
        label: document.createElement("label"),
        description: document.createElement("span"),
        content: getGDDElement(this.schema, this.path),
        contentError: document.createElement("div"),
      };

      // Listen to events to update validation error:
      this.content.content.addEventListener("onChange", (e: any) => {
        if (isCustomEvent(e) && this.content && this.schema) {
          renderContentError(
            this.content.contentError,
            this.schema,
            e.detail.data
          );
        }
      });
      this.content.content.addEventListener("onKeyUp", (e: any) => {
        if (isCustomEvent(e) && this.content && this.schema) {
          renderContentError(
            this.content.contentError,
            this.schema,
            e.detail.data
          );
        }
      });
      // this.content.labelContainer.className = "gdd-labels";

      if (basicType === "array") {
        this.appendChild(this.content.label);
        this.appendChild(this.content.description);
        this.appendChild(this.content.content);
        this.appendChild(this.content.contentError);
      } else {
        this.appendChild(this.content.label);
        this.appendChild(this.content.content);
        this.appendChild(this.content.contentError);
        this.appendChild(this.content.description);
      }
    }
    this.content.content.update({
      schema: this.schema,
      data: this.data,
      renderOptions: this.renderOptions,
    });

    this.content.label.textContent = this.schema.title || "";
    this.content.label.title = this.schema.description || "";
    this.content.description.textContent = this.schema.description || "";

    renderContentError(this.content.contentError, this.schema, this.data);

    this._renderStyle();
    return initialRender;
  }
  private _renderStyle() {
    if (!this.content) return;
    if (!this.schema) return;

    const basicType = getBasicType(this.schema.type);

    if (this.renderOptions.formStyle === "default") {
      this.style.display = "block";
      this.style.margin = "0.5em";

      if (basicType === "object") {
        this.style.marginLeft = "1em";
      } else {
        // this.style.display = "flex";
        // this.style.flexDirection = "row";
        // this.style.justifyContent = "flex-start";
        // this.content.labelContainer.style.width = "20%";
        // this.content.label.style.display = "block";
        // this.content.label.style.textAlign = "right";
        // this.content.description.style.display = "block";
        // this.content.description.style.textAlign = "right";
        this.content.label.style.display = "inline-block";
        // this.content.label.style.textAlign = "right";
        this.content.label.style.marginRight = "0.5em";
        // this.content.label.style.width = "30%";
      }
      this.content.description.style.display = "block";
      // this.content.description.style.marginLeft = "30%";
      this.content.description.style.fontSize = "80%";
    } else {
      // No style
    }
  }
}

window.customElements.define("gdd-object", GDDObject);
window.customElements.define("gdd-object-property", GDDObjectProperty);
