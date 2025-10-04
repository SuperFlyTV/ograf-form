import { getDefaultDataFromSchema } from "../../../lib/default-data.js";
import { last } from "../../../lib/lib.js";
import { GDDElementBase, isCustomEvent } from "../lib/_base.js";
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
      data: this.data,
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
      element: GDDElementBase;
      removeButton: HTMLButtonElement;
    }[];
  } | null = null;

  private addItem() {
    if (!this.schema?.items) return;
    const schemaItems = this.schema.items;
    const defaultData = getDefaultDataFromSchema(schemaItems);

    this.data.push(defaultData);
    this.render();
    this.emitOnChange(this.data);
  }
  private removeItem(e: Event, index: number) {
    this.data.splice(index, 1);
    this.emitOnKeyUp(e, "<array>", this.data);
    this.emitOnChange(this.data);
    this.render();
  }

  render(): boolean {
    let initialRender = false;
    if (!this.schema) return false;
    if (!this.schema.items) return false;
    const schemaItems = this.schema.items;

    if (!this.data) this.data = [];

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

    for (const item of this.content.items.splice(this.data.length)) {
      this.content.itemsContainer.removeChild(item.container);
    }

    for (let i = 0; i < this.data.length; i++) {
      if (!this.content.items[i]) {
        const container = document.createElement("div");
        container.className = "gdd-simple-array-item";
        const removeButton = document.createElement("button");
        removeButton.tabIndex = -1;

        removeButton.onclick = (e: Event) => {
          e.preventDefault();
          this.removeItem(e, i);
        };

        const element = new GDDArrayProperty();
        element.path = `${this.path}[${i}]`;

        element.addEventListener("onChange", (e: Event) => {
          if (!(e instanceof CustomEvent)) return;
          e.stopPropagation();
          this.data[i] = e.detail.data;

          this.emitOnChange(this.data);
        });
        element.addEventListener("onKeyUp", (e: Event) => {
          if (!isCustomEvent(e)) return;

          if (e.detail.key === "Enter") {
            // Add another item
            this.addItem();
            last(
              this.content?.itemsContainer.querySelectorAll<HTMLInputElement>(
                "input, textarea"
              )
            )?.focus();
            // } else if (e.detail.key === "Backspace" && e.detail.inputStr === "") {
            //   // Remove the item
            //   this.removeItem(e, i);

            //   last(
            //     this.content?.itemsContainer.querySelectorAll<HTMLInputElement>(
            //       "input, textarea"
            //     )
            //   )?.focus();
          } else {
            e.stopPropagation();
            this.data[i] = e.detail.data;
            this.emitOnKeyUp(e, "<array>", this.data);
          }
        });
        element.addEventListener("onKeyDown", (e: Event) => {
          if (!isCustomEvent(e)) return;

          if (e.detail.key === "Backspace" && e.detail.inputStr === "") {
            // Remove the item
            this.removeItem(e, i);

            last(
              this.content?.itemsContainer.querySelectorAll<HTMLInputElement>(
                "input, textarea"
              )
            )?.focus();
          }
        });

        container.appendChild(removeButton);
        container.appendChild(element);
        this.content.itemsContainer.appendChild(container);

        this.content.items.push({
          container,
          removeButton,
          element,
        });
      }
      const item = this.content.items[i];

      item.removeButton.textContent = this.renderOptions.dictionary.removeItem;
      item.removeButton.title =
        this.renderOptions.dictionary.removeItemDescription;

      item.element.update({
        data: this.data[i],
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

    if (!this.data) this.data = [];

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
        this.data.push(getDefaultDataFromSchema(schemaItems));
        this.render();
        this.emitOnChange(this.data);
      };
      this.appendChild(this.content.elAddButton);
    }

    this._renderTopRow(this.content.elTrTop);

    for (const elLine of this.content.rows.splice(this.data.length)) {
      // for (const row of elLine.rows) {
      //   row.element.removeEventListener()
      // }
      this.content.elTable.removeChild(elLine.tr);
    }

    for (let i = 0; i < this.data.length; i++) {
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

          this.data.splice(i, 1);
          this.emitOnKeyUp(e, "<array>", this.data);
          this.emitOnChange(this.data);
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
            contentRow.tr.removeChild(field.td);
            // field.element.removeEventListener()
          }

          for (let j = 0; j < properties.length; j++) {
            const key = properties[j][0];
            const schema = properties[j][1];
            const data = this.data[i][key];

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

              el.addEventListener("onChange", (e: Event) => {
                if (!(e instanceof CustomEvent)) return;
                e.stopPropagation();
                this.data[i][key] = e.detail.data;

                this.emitOnChange(this.data);
              });
              el.addEventListener("onKeyUp", (e: Event) => {
                if (!(e instanceof CustomEvent)) return;
                e.stopPropagation();
                this.data[i][key] = e.detail.data;
                this.emitOnKeyUp(e, "<array>", this.data);
              });
            }
            const field = contentRow.fields[j];

            field.element.update({
              schema: schema,
              data: data,
              renderOptions: this.renderOptions,
            });
          }
        }
      } else {
        // Array of not-objects
      }

      contentRow.removeButton.textContent =
        this.renderOptions.dictionary.removeRow;

      // this.content.rows[i].element.update({
      //   schema: schemaItems,
      //   data: rowData,
      //   renderOptions: this.renderOptions,
      // });
    }

    this.content.elAddButton.textContent = this.renderOptions.dictionary.addRow;

    this._renderStyle();
    return initialRender;
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

    if (this.data.length === 0) return;

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
    content: GDDElementBase;
    contentError: HTMLDivElement;
  } | null = null;

  constructor() {
    super();
  }
  connectedCallback(): void {}

  render(): boolean {
    let initialRender = false;
    if (!this.schema) return initialRender;

    if (!this.content) {
      this.content = {
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

      this.appendChild(this.content.content);
    }
    this.content.content.update({
      schema: this.schema,
      data: this.data,
      renderOptions: this.renderOptions,
    });
    // this.content.label.textContent = this.schema.title || "";
    // this.content.label.title = this.schema.description || "";

    renderContentError(this.content.contentError, this.schema, this.data);

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
