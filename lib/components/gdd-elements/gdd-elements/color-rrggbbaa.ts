import { GDDColorRRGGBB } from "./color-rrggbb.js";

export class GDDColorRRGGBBAA extends GDDColorRRGGBB {
  private elContentAlpha: HTMLInputElement | null = null;

  private _rrggbb: string = "";
  private _alpha: number = 0;

  render(): boolean {
    const initialRender = super.render();

    if (!this.elInput) return initialRender;
    if (initialRender) {
      if (!this.elContentAlpha) {
        this.elContentAlpha = document.createElement("input");
        this.elContentAlpha.name = this.path + "_alpha";
        this.elContentAlpha.type = "number";
        this.elContentAlpha.max = "1";
        this.elContentAlpha.min = "0";
        this.elContentAlpha.step = "0.01";

        this.appendChild(this.elContentAlpha);

        this.elContentAlpha.onchange = (e) => {
          if (!e.target) return;
          if (!(e.target instanceof HTMLInputElement)) return;

          const int = this._parseInput(e.target.value);
          if (int === null) {
            // invalid input, revert
            e.target.value = `${this._alpha}` || "";
          } else {
            if (this.data !== int) {
              this._alpha = int;

              this.emitOnChange(this.getRRGGBBAA(this._rrggbb, this._alpha));
            }
            e.target.value = `${int}`;
          }
        };

        this.elContentAlpha.onkeydown = (e) => {
          if (!e.target) return;
          this.emitOnKeyDown(
            e,
            (e.target as any).value,
            (e.target as any).value
          );
        };
        this.elContentAlpha.onkeyup = (e) => {
          if (!e.target) return;
          if (!(e.target instanceof HTMLInputElement)) return;

          const int = this._parseInput(e.target.value);

          if (int === null) return;
          this.emitOnKeyUp(
            e,
            e.target.value,
            this.getRRGGBBAA(this._rrggbb, int)
          );
        };
      }
      this.elInput.onchange = (e) => {
        if (!e.target) return;

        this._rrggbb = (e.target as any).value.replace("#", "");

        this.emitOnChange(this.getRRGGBBAA(this._rrggbb, this._alpha));
      };
    }

    if (!this.elContentAlpha) return initialRender;

    const rrggbbaa = this.data || "#00000000";
    this._rrggbb = rrggbbaa.slice(1, 7);
    this._alpha = parseInt(rrggbbaa.slice(7, 9), 16) / 255;

    this.elInput.value = `#${this._rrggbb}`;
    this.elContentAlpha.value = `${this._alpha}`;

    return initialRender;
  }

  private getRRGGBBAA(rrggbb: string, alpha: number): string {
    const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255);
    return "#" + rrggbb + a.toString(16).padStart(2, "0");
  }

  protected _parseInput(input: string): number | null {
    const int = parseFloat(input);
    if (Number.isNaN(int)) return null;
    return int;
  }
}

window.customElements.define("gdd-color-rrggbbaa", GDDColorRRGGBBAA);
