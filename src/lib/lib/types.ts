import type { JSONSchema7 } from "json-schema";

// This is an incomplete GDDSchema definition,,
export type GDDSchema = Omit<
  JSONSchema7,
  "type" | "properties" | "items" | "contains"
> & {
  type: GDDTypeName | [GDDTypeName] | [GDDTypeName, "null"];
  properties?: { [key: string]: GDDSchema };
  items?: GDDSchema;

  gddType?: string;
  gddOptions?: Record<string, any>;

  rank?: number; // Upcoming feature: to order properties in the UI

  contains?: GDDSchema;
};

export function isGDDSpecificSchema(
  schema: GDDSchema
): schema is GDDSpecificSchemas {
  return typeof schema.gddType === "string";
}

export type GDDTypeName =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array"; // not null

export type GDDSpecificSchemas =
  | {
      type: "string";
      gddType: "single-line";
    }
  | {
      type: "string";
      gddType: "multi-line";
    }
  | {
      type: "string";
      gddType: "file-path";
      gddOptions: {
        extensions: string[]; // [Optional, Array of strings] . Limit which files can be chosen by the user
      };
    }
  | {
      type: "string";
      gddType: "file-path/image-path";
      gddOptions: {
        extensions: string[]; // [Optional, Array of strings] Limit which files can be chosen by the user.
      };
    }
  | {
      type: "string";
      enum: string[]; // ["one", "two", "three"];
      gddType: "select";
      gddOptions: {
        labels: Record<string, string>;
      };
    }
  | {
      type: "integer";
      enum: number[]; // [1, 2, 3];
      gddType: "select";
      gddOptions: {
        labels: Record<string, string>; // { "1": "Small"; "2": "Medium"; "3": "Large"
      };
    }
  | {
      type: "number";
      enum: number[]; // [1.2, 3.5, 9.0];
      gddType: "select";
      gddOptions: {
        labels: Record<string, string>; // { "1.2": "Small"; "3.5": "Medium"; "9.0": "Large" };
      };
    }
  | {
      type: "string";
      pattern: "^#[0-9a-f]{6}$";
      gddType: "color-rrggbb";
    }
  | {
      type: "string";
      pattern: "^#[0-9a-f]{8}$";
      gddType: "color-rrggbbaa";
    }
  | {
      type: "number";
      gddType: "percentage";
    }
  | {
      type: "integer";
      gddType: "duration-ms";
    };
