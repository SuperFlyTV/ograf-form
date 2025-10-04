import { isEqual } from "./lib";
import type { GDDSchema } from "./types";

export function validateDataSimple(
  schema: GDDSchema,
  data: any,
  path: string
): ValidateResult {
  // This is a simple, not complete JSON data validator.
  let errors: string[] = [];

  errors.push(...(validateMainType(schema, data, path) || []));
  errors.push(...validateConstraints(schema, data, path));

  const mainType = Array.isArray(schema.type) ? schema.type[0] : schema.type;

  // Inner errors:
  if (mainType === "array") {
    if (typeof data === "object" && Array.isArray(data) && schema.items) {
      for (let i = 0; i < data.length; i++) {
        const r = validateDataSimple(schema.items, data[i], `${path}.${i}`);
        errors.push(...r.errors);
      }
    }
  } else if (mainType === "object") {
    if (typeof data === "object" && !Array.isArray(data) && schema.properties) {
      for (const key of Object.keys(schema.properties)) {
        const r = validateDataSimple(
          schema.properties[key],
          data[key],
          `${path}.${key}`
        );
        errors.push(...r.errors);
      }
    }
  }

  return {
    errors: errors,
  };
}

type ValidateResult = {
  errors: string[];
};

function validateMainType(
  schema: GDDSchema,
  data: any,
  path: string
): string[] | null {
  const mainType = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  const isOptional = Array.isArray(schema.type)
    ? schema.type[1] === "null"
    : false;

  let typeDescription = mainType;
  if (isOptional) typeDescription += " or null";

  const ERROR = [`${path} expected to be a ${typeDescription}`];

  if (isOptional && (data === undefined || data === null)) return null;

  if (mainType === "string") {
    if (typeof data !== "string") return ERROR;
    // Todo: add more checks, like regex etc
    return null;
  } else if (mainType === "number") {
    if (typeof data !== "number") return ERROR;

    return null;
  } else if (mainType === "integer") {
    if (typeof data !== "number" || !Number.isInteger(data)) return ERROR;
    return null;
  } else if (mainType === "boolean") {
    if (typeof data !== "boolean") return ERROR;
    return null;
  } else if (mainType === "array") {
    if (!Array.isArray(data)) return ERROR;
    return null;
  } else if (mainType === "object") {
    if (Array.isArray(data)) return ERROR;

    return null;
  }
  throw new Error(`Invalid type: ${JSON.stringify(schema.type)}`);
}

function validateConstraints(
  schema: GDDSchema,
  data: any,
  path: string
): string[] {
  let errors: string[] = [];

  if (schema.const !== undefined) {
    if (!isEqual(schema.const, data))
      errors.push(
        `${path} must be constant value ${JSON.stringify(schema.const)}`
      );
  }
  if (schema.enum !== undefined) {
    if (!schema.enum.includes(data))
      errors.push(`${path} must be one of ${JSON.stringify(schema.enum)}`);
  }
  if (schema.exclusiveMaximum !== undefined) {
    if (typeof data === "number" && !(data < schema.exclusiveMaximum))
      errors.push(`${path} must be < ${schema.exclusiveMaximum}`);
  }
  if (schema.exclusiveMinimum !== undefined) {
    if (typeof data === "number" && !(data > schema.exclusiveMinimum))
      errors.push(`${path} must be > ${schema.exclusiveMinimum}`);
  }
  if (schema.maximum !== undefined) {
    if (typeof data === "number" && !(data <= schema.maximum))
      errors.push(`${path} must be <= ${schema.maximum}`);
  }
  if (schema.minimum !== undefined) {
    if (typeof data === "number" && !(data >= schema.minimum))
      errors.push(`${path} must be >= ${schema.minimum}`);
  }

  if (schema.multipleOf !== undefined) {
    if (typeof data === "number" && schema.multipleOf > 0) {
      const remainder = data % schema.multipleOf;
      const epsilon = 1e-10; // small tolerance for floating point errors
      if (
        !(
          remainder < epsilon ||
          Math.abs(remainder - schema.multipleOf) < epsilon
        )
      )
        errors.push(`${path} must be a multiple of ${schema.multipleOf}`);
    }
  }

  // schema.format; // not implemented
  // additionalItems // not implemented
  if (schema.maxItems !== undefined) {
    if (
      Array.isArray(data) &&
      schema.maxItems >= 0 &&
      data.length > schema.maxItems
    )
      errors.push(`${path} must have at most ${schema.maxItems} items`);
  }
  if (schema.minItems !== undefined) {
    if (
      Array.isArray(data) &&
      schema.minItems >= 0 &&
      data.length < schema.minItems
    )
      errors.push(`${path} must have at least ${schema.minItems} items`);
  }
  if (schema.uniqueItems === true) {
    // all items must be unique
    if (Array.isArray(data)) {
      const existing = new Set();
      for (const item of data) {
        if (existing.has(item)) {
          errors.push(
            `${path} must have all unique items (${JSON.stringify(
              item
            )} is duplicated)`
          );
          break;
        } else {
          existing.add(item);
        }
      }
    }
  }
  if (schema.contains !== undefined) {
    // At least one item must match the schema in "contains"
    if (Array.isArray(data)) {
      let found = false;
      let lastError: string | null = null;
      for (const item of data) {
        const r = validateDataSimple(schema.contains, item, "");
        if (r.errors.length === 0) {
          found = true;
          break;
        } else lastError = r.errors.join(", ");
      }
      if (!found)
        errors.push(
          `${path} must contain at least one item matching schema: "${lastError}"`
        );
    }
  }

  if (schema.maxLength !== undefined) {
    if (typeof data === "string" && data.length > schema.maxLength)
      errors.push(`${path} must have at most ${schema.maxLength} characters`);
  }
  if (schema.minLength !== undefined) {
    if (typeof data === "string" && data.length < schema.minLength)
      errors.push(`${path} must have at least ${schema.minLength} characters`);
  }
  if (schema.pattern !== undefined) {
    if (typeof data === "string") {
      const re = new RegExp(schema.pattern);
      if (!re.test(data))
        errors.push(`${path} must match pattern: ${schema.pattern}`);
    }
  }

  if (schema.maxProperties !== undefined) {
    if (
      typeof data === "object" &&
      !Array.isArray(data) &&
      schema.maxProperties >= 0
    ) {
      if (Object.keys(data).length > schema.maxProperties)
        errors.push(
          `${path} must have at most ${schema.maxProperties} properties`
        );
    }
  }

  if (schema.minProperties !== undefined) {
    if (
      typeof data === "object" &&
      !Array.isArray(data) &&
      schema.minProperties >= 0
    ) {
      if (Object.keys(data).length < schema.minProperties)
        errors.push(
          `${path} must have at least ${schema.minProperties} properties`
        );
    }
  }
  if (schema.required !== undefined) {
    if (
      Array.isArray(schema.required) &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      for (const key of schema.required) {
        if (data[key] === undefined)
          errors.push(`${path} is missing required property: ${key}`);
      }
    }
  }
  // schema.patternProperties
  // schema.additionalProperties
  // schema.dependencies

  if (schema.propertyNames !== undefined) {
    for (const key of Object.keys(data)) {
      const r = validateDataSimple(
        schema.propertyNames as GDDSchema,
        key,
        `property "${key}"`
      );
      errors.push(...r.errors);
    }
  }

  if (schema.if !== undefined) {
    const ifResult = validateDataSimple(schema.if as GDDSchema, data, ``);
    if (ifResult.errors.length === 0) {
      if (schema.then !== undefined) {
        const thenResult = validateDataSimple(
          schema.then as GDDSchema,
          data,
          path
        );
        errors.push(...thenResult.errors);
      }
    } else {
      if (schema.else !== undefined) {
        const elseResult = validateDataSimple(
          schema.else as GDDSchema,
          data,
          path
        );
        errors.push(...elseResult.errors);
      }
    }
  }

  if (schema.allOf !== undefined) {
    for (const subSchema of schema.allOf) {
      const r = validateDataSimple(subSchema as GDDSchema, data, path);
      errors.push(...r.errors);
    }
  }

  if (schema.anyOf !== undefined) {
    let allErrors: string[] = [];
    for (const subSchema of schema.anyOf) {
      const r = validateDataSimple(subSchema as GDDSchema, data, path);
      allErrors.push(...r.errors);
    }
    if (allErrors.length > 0) {
      errors.push(
        `${path} must match at least one schema in "anyOf": ${allErrors.join(
          "; "
        )}`
      );
    }
  }
  if (schema.oneOf !== undefined) {
    let validCount = 0;
    let lastErrors: string[] = [];
    for (const subSchema of schema.oneOf) {
      const r = validateDataSimple(subSchema as GDDSchema, data, path);
      if (r.errors.length === 0) validCount++;
      else lastErrors = r.errors;
    }
    if (validCount !== 1) {
      errors.push(
        `${path} must match exactly one schema in "oneOf", but matched ${validCount}. ${lastErrors.join(
          "; "
        )}`
      );
    }
  }
  if (schema.not !== undefined) {
    const r = validateDataSimple(schema.not as GDDSchema, data, path);
    if (r.errors.length === 0) {
      errors.push(
        `${path} must NOT match schema: ${JSON.stringify(schema.not)}`
      );
    }
  }

  return errors;
}
