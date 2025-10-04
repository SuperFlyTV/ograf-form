import { GDDElementBase } from "../lib/_base.js";

export abstract class GDDInputBase extends GDDElementBase {
  protected elInput: HTMLInputElement | null = null;

  render(): boolean {
    let initialRender = false;
    if (!this.elInput) {
      initialRender = true;
      this.elInput = document.createElement("input");
      this.appendChild(this.elInput);

      this.elInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          // Prevent form submission
        }
      };
    }

    // Style:
    if (this.renderOptions.formStyle === "default") {
      // this.elInput.style.width = "10em";
    } else {
      // No style
    }
    return initialRender;
  }
}
