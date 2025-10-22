import { GDDElementBase } from "../lib/_base.js";

export abstract class GDDInputBase extends GDDElementBase {
  protected elInput: HTMLInputElement | null = null;

  render(): boolean {
    let initialRender = false;
    if (!this.elInput) {
      initialRender = true;
      this.elInput = document.createElement("input");
      this.appendChild(this.elInput);

      this.elInput.onchange = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();
        this.emitChangeEvent(e.target.value);
      };
      this.elInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          // Prevent form submission
        }
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();
        this.emitKeyDownEvent(e, e.target.value, e.target.value);
      };
      this.elInput.onkeyup = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();
        this.emitKeyUpEvent(e, e.target.value, e.target.value);
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
  destroy(): void {
    super.destroy();
    if (this.elInput) {
      this.elInput.onchange = null;
      this.elInput.onkeydown = null;
      this.elInput.onkeyup = null;
    }
  }
}
