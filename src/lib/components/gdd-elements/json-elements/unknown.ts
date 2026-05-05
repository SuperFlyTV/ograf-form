import { GDDElementBase } from "../lib/_base.js";

export class GDDUnknown extends GDDElementBase {
  protected elDiv: HTMLDivElement | null = null;

  render(): boolean {
    let initialRender = false;
    if (!this.elDiv) {
      initialRender = true;
      this.elDiv = document.createElement("input");
      this.elDiv.className = "gdd-unknown";
      this.appendChild(this.elDiv);
    }
    this.elDiv.innerText = `Unknown/Unsupported schema: ${JSON.stringify(this.schema)} on path ${this.path}`;
    return initialRender;
  }
}

window.customElements.define("gdd-unknown", GDDUnknown);
