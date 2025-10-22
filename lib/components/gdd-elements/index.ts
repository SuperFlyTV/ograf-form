import { GDDElementBase } from "./lib/_base.js";
import { GDDArray } from "./json-elements/array.js";
import { GDDBoolean } from "./json-elements/boolean.js";
import { GDDInteger } from "./json-elements/integer.js";
import { GDDObject } from "./json-elements/object.js";
import { GDDString } from "./json-elements/string.js";
import { GDDMultiLineText } from "./gdd-elements/multiline-text.js";
import { GDDFilePath } from "./gdd-elements/file-path.js";
import { GDDSelect } from "./gdd-elements/select.js";
import { GDDColorRRGGBB } from "./gdd-elements/color-rrggbb.js";
import { GDDColorRRGGBBAA } from "./gdd-elements/color-rrggbbaa.js";
import { GDDPercentage } from "./gdd-elements/percentage.js";
import { assertNever } from "../../lib/lib.js";
import type { GDDSchema, GDDTypeName } from "../../lib/types.js";
import { GDDNumber } from "./json-elements/number.js";

export {
  GDDElementBase,
  GDDObject,
  GDDArray,
  GDDString,
  GDDInteger,
  GDDBoolean,
  GDDNumber,
};

export function getGDDElement(schema: GDDSchema, path: string): GDDElementBase {
  const basicType = getBasicType(schema.type);

  const gddType = schema.gddType + "/";

  let element: GDDElementBase;

  if (basicType === "string" && gddType.startsWith("multi-line("))
    element = new GDDMultiLineText();
  else if (basicType === "string" && gddType.startsWith("file-path/"))
    element = new GDDFilePath();
  else if (
    (basicType === "string" ||
      basicType === "integer" ||
      basicType === "number") &&
    gddType.startsWith("select/")
  )
    element = new GDDSelect();
  else if (basicType === "string" && gddType.startsWith("color-rrggbb/"))
    element = new GDDColorRRGGBB();
  else if (basicType === "string" && gddType.startsWith("color-rrggbbaa/"))
    element = new GDDColorRRGGBBAA();
  else if (basicType === "number" && gddType.startsWith("percentage/"))
    element = new GDDPercentage();
  else if (basicType === "object") element = new GDDObject();
  else if (basicType === "array") element = new GDDArray();
  else if (basicType === "string") element = new GDDString();
  else if (basicType === "integer") element = new GDDInteger();
  else if (basicType === "boolean") element = new GDDBoolean();
  else if (basicType === "number") element = new GDDNumber();
  else {
    assertNever(basicType);
    throw new Error(`Unsupported GDD type: ${basicType}`);
  }

  return element;
}
export function getBasicType(schemaType: GDDSchema["type"]): GDDTypeName {
  return Array.isArray(schemaType) ? schemaType[0] : schemaType;
}
