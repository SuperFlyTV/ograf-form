import { SuperFlyTvOgrafDataForm } from "./lib/components/ograf-form.js";

import { getDefaultDataFromSchema } from "./lib/lib/default-data.js";
import { validateDataSimple } from "./lib/lib/validate-data.js";
import { validateGDDSchema } from "./lib/lib/validate-schema.js";
export type { GDDSchema } from "./lib/lib/types.js";

export type { GetGDDElementFunctionOptional } from "./lib/components/ograf-form.js";
export * from "./lib/components/gdd-elements/index.js";

export {
  SuperFlyTvOgrafDataForm,
  getDefaultDataFromSchema,
  validateDataSimple,
  validateGDDSchema,
};

declare global {
  interface Window {
    SuperFlyTvOgrafDataForm: {
      form: typeof SuperFlyTvOgrafDataForm;
      getDefaultDataFromSchema: typeof getDefaultDataFromSchema;
      validateDataSimple: typeof validateDataSimple;
      validateGDDSchema: typeof validateGDDSchema;
    };
  }
}
window.SuperFlyTvOgrafDataForm = {
  form: SuperFlyTvOgrafDataForm,
  getDefaultDataFromSchema: getDefaultDataFromSchema,
  validateDataSimple: validateDataSimple,
  validateGDDSchema: validateGDDSchema,
};
