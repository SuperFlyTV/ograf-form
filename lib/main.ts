import { SuperFlyTvOgrafDataForm } from "./components/ograf-form.js";
import { getDefaultDataFromSchema } from "./lib/default-data.js";
import { validateDataSimple } from "./lib/validate-data.js";
import { validateGDDSchema } from "./lib/validate-schema.js";
export type { GDDSchema } from "./lib/types.js";

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
