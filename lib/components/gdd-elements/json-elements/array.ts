import { getDefaultDataFromSchema } from "../../../lib/default-data.js";
import { nthInIterable } from "../../../lib/lib.js";
import { GDDElementBase, isCustomEventKey } from "../lib/_base.js";
import { getGDDElement } from "../index.js";
import { renderContentError } from "../lib/lib.js";

export class GDDArray extends GDDElementBase {
  private elContent: GDDElementBase | null = null;

  render(): boolean {
    if (!this.schema?.items) return false;
    let initialRender = false;

    if (!this.elContent) {
      initialRender = true;
      if (this.schema.items.type === "object" && this.schema.items.properties) {
        this.elContent = new GDDTable();
      } else {
        this.elContent = new GDDSimpleArray();
      }
      this.appendChild(this.elContent);
    }
    this.elContent.update({
      value: this.value,
      schema: this.schema,
      renderOptions: this.renderOptions,
    });
    return initialRender;
  }
}
export class GDDSimpleArray extends GDDElementBase {
  private content: {
    addButton: HTMLButtonElement;
    itemsContainer: HTMLDivElement;
    items: {
      container: HTMLDivElement;
      element: GDDArrayProperty;
      removeButton: HTMLButtonElement;
      index: number;
    }[];
  } | null = null;

  private addItem(index = -1): number | undefined {
    if (!this.schema?.items) return;
    const schemaItems = this.schema.items;
    const defaultData = getDefaultDataFromSchema(schemaItems);

    if (index < 0) index = this.value.length - index;

    this.value.splice(index, 0, defaultData);
    this.render();
    this.emitChangeEvent(this.value);
    return index;
  }
  private removeItem(e: Event, index: number) {
    this.value.splice(index, 1);
    this.emitKeyUpEvent(e, "<array>", this.value);
    this.emitChangeEvent(this.value);
    this.render();
  }

  render(): boolean {
    let initialRender = false;
    if (!this.schema) return false;
    if (!this.schema.items) return false;
    const schemaItems = this.schema.items;

    if (!this.value) this.value = [];

    if (!this.content) {
      initialRender = true;
      this.content = {
        addButton: document.createElement("button"),
        itemsContainer: document.createElement("div"),
        items: [],
      };
      this.content.itemsContainer.className = "gdd-simple-array-items";

      this.content.addButton.onclick = (e) => {
        e.preventDefault();
        this.addItem();
      };
      this.appendChild(this.content.itemsContainer);
      this.appendChild(this.content.addButton);
    }

    // Remove extra items
    for (const item of this.content.items.splice(this.value.length)) {
      item.element.destroy();
      this.content.itemsContainer.removeChild(item.container);
    }

    for (let i = 0; i < this.value.length; i++) {
      if (!this.content.items[i]) {
        const container = document.createElement("div");
        container.className = "gdd-simple-array-item";
        const removeButton = document.createElement("button");
        const element = new GDDArrayProperty();

        const contentItem = {
          container,
          removeButton,
          element,
          index: i,
        };
        this.content.items.push(contentItem);

        contentItem.element.addListener("change", (e: Event) => {
          if (!(e instanceof CustomEvent)) return;
          e.stopPropagation();

          this.value[contentItem.index] = e.detail.value;

          this.emitChangeEvent(this.value);
        });
        contentItem.element.addListener("keydown", (e: Event) => {
          if (!isCustomEventKey(e)) return;
          keyDownValueStr = e.detail.valueStr;
        });
        contentItem.element.addListener("keyup", (e: Event) => {
          if (!isCustomEventKey(e)) return;

          if (e.detail.key === "Enter") {
            // Add another item
            e.stopPropagation();

            const newIndex = this.addItem(contentItem.index + 1);

            if (newIndex !== undefined) {
              nthInIterable(
                this.content?.itemsContainer.querySelectorAll<HTMLInputElement>(
                  "input, textarea"
                ),
                newIndex
              )?.focus();
            }
          } else if (
            e.detail.key === "Backspace" &&
            e.detail.valueStr === "" &&
            keyDownValueStr === ""
          ) {
            e.preventDefault();
            e.stopPropagation();
            // Remove the item

            this.removeItem(e, contentItem.index);

            nthInIterable(
              this.content?.itemsContainer.querySelectorAll<HTMLInputElement>(
                "input, textarea"
              ),
              Math.max(0, contentItem.index - 1)
            )?.focus();
          } else {
            e.stopPropagation();
            this.value[contentItem.index] = e.detail.value;
            this.emitKeyUpEvent(e, "<array>", this.value);
          }
        });

        removeButton.tabIndex = -1;
        removeButton.onclick = (e: Event) => {
          e.preventDefault();
          this.removeItem(e, contentItem.index);
        };

        element.path = `${this.path}[${contentItem.index}]`;

        let keyDownValueStr = `${this.value[contentItem.index]}`;

        container.appendChild(removeButton);
        container.appendChild(element);
        this.content.itemsContainer.appendChild(container);
      }
      const item = this.content.items[i];

      item.index = i;

      item.removeButton.textContent = this.renderOptions.dictionary.removeItem;
      item.removeButton.title =
        this.renderOptions.dictionary.removeItemDescription;

      item.element.update({
        value: this.value[i],
        schema: schemaItems,
        renderOptions: this.renderOptions,
      });
    }

    this.content.addButton.textContent = this.renderOptions.dictionary.addItem;
    this.content.addButton.title =
      this.renderOptions.dictionary.addItemDescription;

    this._renderStyle();
    return initialRender;
  }
  private _renderStyle() {
    if (!this.content) return;
    if (this.renderOptions.formStyle === "default") {
      this.content.itemsContainer.style.display = "inline-block";
      for (const item of this.content.items) {
        item.container.style.display = "inline-block";
        item.container.style.margin = "0.25em";
      }
    } else {
      // No style
    }
  }
}
export class GDDTable extends GDDElementBase {
  private content: {
    elAddButton: HTMLButtonElement;
    elTable: HTMLTableElement;
    elTrTop: HTMLTableRowElement;
    rows: {
      tr: HTMLTableRowElement;
      fields: {
        td: HTMLTableCellElement;
        element: GDDElementBase;
      }[];
      tdEnd: HTMLTableCellElement;
      removeButton: HTMLButtonElement;
    }[];
  } | null = null;

  render(): boolean {
    let initialRender = false;
    if (!this.schema) return initialRender;
    if (!this.schema.items) return initialRender;
    const schemaItems = this.schema.items;

    if (!this.value) this.value = [];

    if (!this.content) {
      initialRender = true;
      this.content = {
        elAddButton: document.createElement("button"),
        elTable: document.createElement("table"),
        elTrTop: document.createElement("tr"),
        rows: [],
      };
      this.appendChild(this.content.elTable);
      this.content.elTable.appendChild(this.content.elTrTop);

      this.content.elAddButton.onclick = (e) => {
        e.preventDefault();
        this.value.push(getDefaultDataFromSchema(schemaItems));
        this.render();
        this.emitChangeEvent(this.value);
      };
      this.appendChild(this.content.elAddButton);
    }

    this._renderTopRow(this.content.elTrTop);

    for (const elLine of this.content.rows.splice(this.value.length)) {
      // for (const row of elLine.rows) {
      //   row.element.removeEventListener()
      // }
      this.content.elTable.removeChild(elLine.tr);
    }

    for (let i = 0; i < this.value.length; i++) {
      if (!this.content.rows[i]) {
        const tr = document.createElement("tr");
        const removeButton = document.createElement("button");
        removeButton.tabIndex = -1;
        const tdEnd = document.createElement("td");

        tdEnd.appendChild(removeButton);
        tr.appendChild(tdEnd);
        this.content.elTable.appendChild(tr);

        tdEnd.onclick = (e: Event) => {
          e.preventDefault();

          this.value.splice(i, 1);
          this.emitKeyUpEvent(e, "<array>", this.value);
          this.emitChangeEvent(this.value);
          this.render();
        };

        this.content.rows.push({
          tr,
          fields: [],
          tdEnd,
          removeButton,
        });

        this.content.elTable.appendChild(tr);
      }
      const contentRow = this.content.rows[i];

      if (schemaItems.type === "object") {
        // Array of objects
        if (schemaItems.properties) {
          const properties = Object.entries(schemaItems.properties);

          for (const field of contentRow.fields.splice(properties.length)) {
            field.element.destroy();
            contentRow.tr.removeChild(field.td);
          }

          for (let j = 0; j < properties.length; j++) {
            const key = properties[j][0];
            const schema = properties[j][1];
            const value = this.value[i][key];

            if (!contentRow.fields[j]) {
              const td = document.createElement("td");
              const el = new GDDArrayProperty();
              el.path = `${this.path}[${i}].${key}`;
              contentRow.fields.push({
                td,
                element: el,
              });
              td.appendChild(el);
              contentRow.tr.appendChild(td);

              el.addListener("change", (e: Event) => {
                if (!(e instanceof CustomEvent)) return;
                e.stopPropagation();
                this.value[i][key] = e.detail.value;

                this.emitChangeEvent(this.value);
              });
              el.addListener("keyup", (e: Event) => {
                if (!(e instanceof CustomEvent)) return;
                e.stopPropagation();
                this.value[i][key] = e.detail.value;
                this.emitKeyUpEvent(e, "<array>", this.value);
              });
            }
            const field = contentRow.fields[j];

            field.element.update({
              schema: schema,
              value: value,
              renderOptions: this.renderOptions,
            });
          }
        }
      } else {
        // Array of not-objects
      }

      contentRow.removeButton.textContent =
        this.renderOptions.dictionary.removeRow;
    }

    this.content.elAddButton.textContent = this.renderOptions.dictionary.addRow;

    this._renderStyle();
    return initialRender;
  }
  destroy(): void {
    super.destroy();
    if (this.content) {
      for (const row of this.content.rows) {
        for (const field of row.fields) {
          field.element.destroy();
        }
      }
    }
  }
  private _renderStyle() {
    if (this.renderOptions.formStyle === "default") {
    } else {
      // No style
    }
  }
  private _renderTopRow(elParent: HTMLTableRowElement) {
    if (!this.schema?.items) return;

    elParent.innerHTML = "";

    if (this.value.length === 0) return;

    const elTh = document.createElement("th");
    elParent.appendChild(elTh);

    const schemaItems = this.schema.items;
    if (schemaItems.type === "object" && schemaItems.properties) {
      for (const [key, prop] of Object.entries(schemaItems.properties)) {
        const elTh = document.createElement("th");
        elParent.appendChild(elTh);

        elTh.textContent = prop.title || key;
        if (prop.description) elTh.title = prop.description;
      }
    }
  }
}
export class GDDArrayProperty extends GDDElementBase {
  private content: {
    element: GDDElementBase;
    contentError: HTMLDivElement;
  } | null = null;

  constructor() {
    super();
  }
  connectedCallback(): void {}

  destroy() {
    super.destroy();
    if (this.content) {
      this.content.element.destroy();
    }
  }

  render(): boolean {
    let initialRender = false;
    if (!this.schema) return initialRender;

    if (!this.content) {
      const element = getGDDElement(this.schema, this.path);
      this.content = {
        element,
        contentError: document.createElement("div"),
      };

      // Listen to events to update validation error:
      this.content.element.addListener("change", (e: any) => {
        if (isCustomEventKey(e) && this.content && this.schema) {
          renderContentError(
            this.content.contentError,
            this.schema,
            e.detail.value
          );
        }
      });
      this.content.element.addListener("keyup", (e: any) => {
        if (isCustomEventKey(e) && this.content && this.schema) {
          renderContentError(
            this.content.contentError,
            this.schema,
            e.detail.value
          );
        }
      });

      this.appendChild(this.content.element);
    }
    this.content.element.update({
      schema: this.schema,
      value: this.value,
      renderOptions: this.renderOptions,
    });
    // this.content.label.textContent = this.schema.title || "";
    // this.content.label.title = this.schema.description || "";

    renderContentError(this.content.contentError, this.schema, this.value);

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

window.customElements.define("gdd-array", GDDArray);
window.customElements.define("gdd-simple-array", GDDSimpleArray);
window.customElements.define("gdd-table", GDDTable);
window.customElements.define("gdd-array-property", GDDArrayProperty);
