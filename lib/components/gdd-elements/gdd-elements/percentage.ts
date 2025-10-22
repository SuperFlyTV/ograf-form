import { GDDInputNumberBase } from "../json-elements/_inputNumberBase.js";
import {
  getLeastSignificantPower,
  precisionRound,
  setCaretPosition,
} from "../lib/lib.js";

export class GDDPercentage extends GDDInputNumberBase {
  private _decimalDigitCount: number | null = null;
  private _isChanged = false;

  private MAX_PRECISION = 6; //

  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;

    if (initialRender) {
      this.elInput.type = "text";
      const orgOnKeyDown = this.elInput.onkeydown;
      this.elInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          // Prevent form submission
        }
        if (!this.elInput) return;

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();

          const change = e.key === "ArrowUp" ? 1 : -1;

          const value = this._parseInput(this.elInput.value);
          if (value !== null) {
            this._decimalDigitCount = Math.max(
              this._decimalDigitCount || 0,
              this.getDigitCount(value)
            );
            const lsp = 1 / Math.pow(10, this._decimalDigitCount + 2);

            const newValue = precisionRound(
              value + Math.min(0.01, lsp) * change,
              this.MAX_PRECISION
            );

            this.elInput.value = this._stringifyValue(newValue);

            this._isChanged = true;

            setTimeout(() => {
              setCaretPosition(e.target as HTMLInputElement, -1);
            }, 0);
          }
        } else {
        }

        if (orgOnKeyDown) orgOnKeyDown.bind(this.elInput)(e);
      };
      const orgOnKeyUp = this.elInput.onkeyup;
      this.elInput.onkeyup = (e) => {
        if (!this.elInput) return;

        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
          const value = this._parseInput(this.elInput.value);
          if (value !== null) {
            this._decimalDigitCount = this.getDigitCount(this.elInput.value);
          }
        }

        if (orgOnKeyUp) orgOnKeyUp.bind(this.elInput)(e);
      };
      this.elInput.onfocus = (e) => {
        setTimeout(() => {
          setCaretPosition(e.target as HTMLInputElement, -1);
        }, 0);
      };
      this.elInput.onblur = (e) => {
        e.preventDefault();

        if (this._isChanged) {
          // because change is not emitted if we've only modified using arrow keys:
          this.elInput?.onchange?.(e);
        }
        this._isChanged = false;
      };
    }

    this._decimalDigitCount = null;
    // Render Style:
    if (this.renderOptions.formStyle === "default") {
      // this.style.display = "grid";
    } else {
      // No style
    }

    return initialRender;
  }

  protected _parseInput(input: string): number | null {
    if (input.endsWith("%")) {
      input = input.slice(0, -1);
    }
    const value = precisionRound(Number(input) / 100, this.MAX_PRECISION);

    if (isNaN(value)) return null;

    return value;
  }

  protected _stringifyValue(value: number | undefined): string {
    if (value === undefined) return "";
    if (typeof value === "string") return value;

    const percent = Math.round(value * 10000) / 100;

    let str = `${percent}`;

    // Add decimal places if needed:
    // (this is to display "42.10%" instead of "42.1%")
    if (this._decimalDigitCount !== null) {
      const decimalDigitCount = this.getDigitCount(value);
      if (decimalDigitCount < this._decimalDigitCount) {
        if (decimalDigitCount === 0) str += ".";
        str += "00000000000".slice(
          0,
          this._decimalDigitCount - decimalDigitCount
        );
      }
    }

    return str + "%";
  }

  private getDigitCount(value: number | string): number {
    let str: string;
    if (typeof value === "string") {
      if (value.endsWith("%")) {
        value = value.slice(0, -1);
      }
      str = value;
    } else {
      const lsp = getLeastSignificantPower(value);
      str = `${Math.round(1 / lsp)}`;
    }
    const count = str.length - 1;

    return Math.max(0, Math.min(this.MAX_PRECISION - 4, count - 2));
  }
}

window.customElements.define("gdd-percentage", GDDPercentage);
