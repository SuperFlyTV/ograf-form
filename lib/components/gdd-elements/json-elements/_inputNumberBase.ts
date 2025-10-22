import { GDDInputBase } from "./_inputBase.js";

export abstract class GDDInputNumberBase extends GDDInputBase {
  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    if (initialRender) {
      this.elInput.type = "number";
      this.elInput.name = this.path;

      this.elInput.onchange = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();

        const input = e.target.value;
        const value = this._parseInput(input);
        if (value === null) {
          // invalid input, revert
          e.target.value = this._stringifyValue(this.value);
        } else {
          if (this.value !== value) {
            this.value = value;
            this.emitChangeEvent(this.value);
          }
          e.target.value = this._stringifyValue(value);
        }
      };

      this.elInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          // Prevent form submission
        }
        if (!e.target) return;

        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();
        const input = e.target.value;
        this.emitKeyDownEvent(e, input, this._parseInput(input));
      };
      this.elInput.onkeyup = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        e.stopPropagation();
        const input = e.target.value;
        this.emitKeyUpEvent(e, input, this._parseInput(input));
      };
    }
    this.elInput.value = this._stringifyValue(this.value);
    return initialRender;
  }

  protected abstract _parseInput(input: string): number | null;
  protected abstract _stringifyValue(value: number | undefined): string;
}
