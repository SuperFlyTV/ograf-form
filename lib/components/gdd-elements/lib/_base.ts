import type { GDDSchema } from "../../../lib/types.js";
import { DEFAULT_DICTIONARY } from "./lib.js";
import type { Options, RenderOptions } from "./lib.js";

export abstract class GDDElementBase extends HTMLElement {
  public path: string = "";
  protected schema: GDDSchema | null = null;
  protected data: any = null;
  protected renderOptions: RenderOptions = {
    dictionary: DEFAULT_DICTIONARY,
    formStyle: "",
  };

  update(options: Options) {
    this.schema = options.schema;
    this.data = options.data;
    if (options.renderOptions)
      this.renderOptions = {
        ...this.renderOptions,
        ...options.renderOptions,
      };

    try {
      this.render();
    } catch (error) {
      console.error;
    }
  }
  /** Returns true on initial render */
  abstract render(): boolean;

  static getOnChangeEvent(data: any) {
    return new CustomEvent("onChange", {
      bubbles: true,
      cancelable: false,
      detail: { data },
    });
  }

  protected emitOnChange(data: any) {
    this.dispatchEvent(GDDElementBase.getOnChangeEvent(data));
  }

  protected emitOnKeyDown(e: Event, inputStr: string, data: any) {
    const detail: CustomEventDetail["detail"] = {
      data,
      inputStr,
      key: (e as any).key,
    };
    const event = new CustomEvent("onKeyDown", {
      bubbles: true,
      cancelable: false,
      detail,
    });
    this.dispatchEvent(event);
  }
  protected emitOnKeyUp(e: Event, inputStr: string, data: any) {
    const detail: CustomEventDetail["detail"] = {
      data,
      inputStr,
      key: (e as any).key,
    };
    const event = new CustomEvent("onKeyUp", {
      bubbles: true,
      cancelable: false,
      detail,
    });
    this.dispatchEvent(event);
  }
}

export type CustomEventDetail = CustomEvent<{
  data: any;
  inputStr: string;
  key: KeyboardEvent["key"];
}>;
export function isCustomEvent(e: Event): e is CustomEventDetail {
  return e instanceof CustomEvent;
}
