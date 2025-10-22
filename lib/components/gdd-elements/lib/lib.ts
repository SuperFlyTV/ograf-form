import type { GDDSchema } from "../../../lib/types.js";
import { validateDataSimple } from "../../../lib/validate-data.js";

export interface Options {
  schema: GDDSchema;
  value: any;
  renderOptions?: Partial<RenderOptions>;
}

export const DEFAULT_DICTIONARY = {
  addRow: "Add Row",
  removeRow: "Remove",
  addItem: "Add",
  removeItem: " - ",
  addItemDescription: "Add item",
  removeItemDescription: "Remove item",
};
export type Dictionary = typeof DEFAULT_DICTIONARY;
export interface RenderOptions {
  formStyle: string | "" | "default";
  dictionary: Dictionary;
}

export function renderContentError(
  elError: HTMLDivElement,
  schema: GDDSchema,
  value: any
): void {
  const errors = validateDataSimple(schema, value, "");

  if (errors.errors.length === 0) {
    elError.style.display = "none";
    elError.textContent = "";
  } else {
    elError.className = "gdd-error-message";
    elError.style.display = "block";
    elError.style.color = "red";
    elError.textContent = errors.errors.join(",\n ");
  }
}

export function setCaretPosition(elem: HTMLInputElement, caretPos: number) {
  if (caretPos < 0) {
    // count from end_
    caretPos = elem.value.length + caretPos;
  }
  if ((elem as any).createTextRange) {
    const range = (elem as any).createTextRange();
    range.move("character", caretPos);
    range.select();
  } else {
    if (elem.selectionStart) {
      elem.focus();
      elem.setSelectionRange(caretPos, caretPos);
    } else elem.focus();
  }
}
export function precisionRound(num: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * Returns the least significant power of 10 in the given number.
 * Examples
 * getLeastSignificantPower(0.4) => 0.1
 * getLeastSignificantPower(0.44) => 0.01
 * @param num
 */
export function getLeastSignificantPower(num: number): number {
  if (num === 0) return 0;
  let factor = 1;
  while (Math.round(num * factor) / factor !== num) {
    factor *= 10;
  }
  return 1 / factor;
}
