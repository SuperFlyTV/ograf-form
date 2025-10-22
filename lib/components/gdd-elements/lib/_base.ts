import type { GDDSchema } from "../../../lib/types.js";

export abstract class GDDElementBase extends HTMLElement {
  public path: string = "";
  protected getGDDElement: GetGDDElementFunction;

  protected schema: GDDSchema | null = null;
  protected value: any = null;
  protected renderOptions: RenderOptions = {
    dictionary: DEFAULT_DICTIONARY,
    formStyle: "",
  };

  constructor(options: { path: string; getGDDElement: GetGDDElementFunction }) {
    super();
    if (!options.path) throw new Error("Missing constructor path argument");
    if (!options.getGDDElement)
      throw new Error("Missing constructor getGddElement argument");

    this.path = options.path;
    this.getGDDElement = options.getGDDElement;
  }

  destroy(): void {
    this.removeAllListeners();
  }

  update(options: Options) {
    this.schema = options.schema;
    this.value = options.value;
    if (options.renderOptions)
      this.renderOptions = {
        ...this.renderOptions,
        ...options.renderOptions,
      };

    try {
      this.render();
    } catch (error) {
      console.error(error);
    }
  }
  /** Returns true on initial render */
  abstract render(): boolean;

  static getChangeEvent(value: any): CustomEvent {
    const detail: CustomEventChange["detail"] = {
      value,
    };

    return new CustomEvent("change", {
      bubbles: true,
      cancelable: false,
      detail,
    });
  }
  protected emitChangeEvent(value: any) {
    this.dispatchEvent(GDDElementBase.getChangeEvent(value));
  }

  private listeners: { [key: string]: (...args: any[]) => void } = {};
  /**
   * Like addEventListener, but keeps track of listeners to allow easy removal later
   * @param type
   * @param listener
   */
  addListener(type: string, listener: (...args: any[]) => void) {
    this.listeners[type] = listener;
    this.addEventListener(type, listener);
  }
  removeAllListeners() {
    for (const [key, listener] of Object.entries(this.listeners)) {
      this.removeEventListener(key, listener);
    }
    this.listeners = {};
  }

  static getKeyDownEvent(e: Event, valueStr: string, value: any): CustomEvent {
    const detail: CustomEventKey["detail"] = {
      value,
      valueStr,
      key: (e as any).key,
    };
    return new CustomEvent("keydown", {
      bubbles: true,
      cancelable: false,
      detail,
    });
  }
  protected emitKeyDownEvent(e: Event, valueStr: string, value: any) {
    this.dispatchEvent(GDDElementBase.getKeyDownEvent(e, valueStr, value));
  }

  static getKeyUpEvent(e: Event, valueStr: string, value: any) {
    const detail: CustomEventKey["detail"] = {
      value,
      valueStr,
      key: (e as any).key,
    };
    return new CustomEvent("keyup", {
      bubbles: true,
      cancelable: false,
      detail,
    });
  }
  protected emitKeyUpEvent(e: Event, valueStr: string, value: any) {
    this.dispatchEvent(GDDElementBase.getKeyUpEvent(e, valueStr, value));
  }
}

export type CustomEventChange = CustomEvent<{
  value: any;
}>;
export function isCustomEventChange(e: Event): e is CustomEventChange {
  return e instanceof CustomEvent && e.detail.key == undefined;
}

export type CustomEventKey = CustomEvent<{
  value: any;
  valueStr: string;
  key: KeyboardEvent["key"];
}>;
export function isCustomEventKey(e: Event): e is CustomEventKey {
  return e instanceof CustomEvent && e.detail.key !== undefined;
}

/**
 * Method that returns a WebComponent representing the GDD Schema at the given path
 */
export type GetGDDElementFunction = (props: {
  /** The GDD Schema */
  schema: GDDSchema;
  /** Breadcrumbs-style path to the property */
  path: string;
  /** Reference to the GetGDDElementFunction to use for inner properties */
  getGDDElement: GetGDDElementFunction;
}) => GDDElementBase;

export interface Options {
  schema: GDDSchema;
  value: any;
  renderOptions?: Partial<RenderOptions>;
}
export interface RenderOptions {
  formStyle: string | "" | "default";
  dictionary: Dictionary;
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
