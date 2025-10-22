import * as React from "react";
import { getDefaultDataFromSchema } from "ograf-form";

export function OGrafForm({ schema, onDataChangeCallback }) {
  /** Ref to the form component */
  const formRef = React.useRef();
  /** State to hold the data */
  const [data, setData] = React.useState(() =>
    // Use default data from schema as initial data:
    schema ? getDefaultDataFromSchema(schema) : {}
  );

  /** Callback when the data changes */
  const onDataChange = React.useCallback((newData) => {
    setData(newData);
    onDataChangeCallback(newData);
  });

  // Set up listener for when the data has changed in the form:
  React.useLayoutEffect(() => {
    if (formRef.current) {
      const listener = (e) => onDataChange(e.target.value);
      formRef.current.addEventListener("change", listener);
      return () => formRef.current.removeEventListener("change", listener);
    }
  });
  // (Optional) Set up listener for whenever user is editing (ie every key)
  // React.useLayoutEffect(() => {
  //   if (formRef.current) {
  //     const listener = (e) => onDataChange(e.target.value);
  //     formRef.current.addEventListener("keyup", listener);
  //     return () => formRef.current.removeEventListener("keyup", listener);
  //   }
  // });

  return (
    <div>
      <superflytv-ograf-form
        ref={formRef}
        schema={JSON.stringify(schema)}
        value={JSON.stringify(data)}
      ></superflytv-ograf-form>
    </div>
  );
}
