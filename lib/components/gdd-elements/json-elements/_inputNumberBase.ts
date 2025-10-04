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

        const input = e.target.value;
        const value = this._parseInput(input);
        if (value === null) {
          // invalid input, revert
          e.target.value = this._stringifyValue(this.data);
        } else {
          if (this.data !== value) {
            this.data = value;
            this.emitOnChange(this.data);
          }
          e.target.value = this._stringifyValue(value);
        }
      };

      this.elInput.onkeydown = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;

        const input = e.target.value;

        this.emitOnKeyDown(e, input, this._parseInput(input));
      };
      this.elInput.onkeyup = (e) => {
        if (!e.target) return;
        if (!(e.target instanceof HTMLInputElement)) return;
        const input = e.target.value;

        this.emitOnKeyUp(e, input, this._parseInput(input));
      };
    }
    this.elInput.value = this._stringifyValue(this.data);
    return initialRender;
  }

  protected abstract _parseInput(input: string): number | null;
  protected abstract _stringifyValue(value: number | undefined): string;
}
