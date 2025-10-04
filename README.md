# OGraf-form

This is a Web Component for generating input forms from [OGraf/GDD](https://ograf.ebu.io/) schemas.

## Getting Started

```bash
npm install ograf-form
```

Example usage:

_[See examples folder for more examples.](./examples)._

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="form-container" style="width: 100vw"></div>
    <div id="data" style="white-space: pre"></div>
    <script type="module" type="text/javascript">

      const container = document.getElementById("form-container");
      const dataDiv = document.getElementById("data");

      // Load the library, either from CDN or locally:
      const OgrafForm = await import("https://cdn.jsdelivr.net/npm/ograf-form/dist/my-lib.js");
      // const OgrafForm = await import("ograf-form");

      // Define a OGraf/GDD JSON-schema:
      const exampleSchema = {
        type: "object",
        properties: {
          name: {
            type: "string",
            gddType: "single-line",
            default: "John Doe",
            description: "This is the name of the thing",
          },
        },
      };

      // Populate the data with default values from the schema:
      const data = OgrafForm.getDefaultDataFromSchema(exampleSchema);

      // Initialize the Form:
      const form = new OgrafForm.SuperFlyTvOgrafDataForm();
      form.addEventListener("onChange", (e) => {
        console.log("Caught onChange event", JSON.stringify(e.detail));
        // The onChange event is fired when a user changes a value in the form
        // It does NOT fire on each key stroke.
        // This is a good time to update our data object:
        dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
      });
      form.addEventListener("onKeyUp", (e) => {
        console.log("Caught onKey event", JSON.stringify(e.detail));
        // The onKeyUp event is fired on each key stroke in the form.
        // e.detail.data contains the current data.
      });
      form.schema = exampleSchema;
      form.data = data;

      dataDiv.innerHTML = JSON.stringify(data, null, 2);

      container.appendChild(form);
    </script>
  </body>
</html>
```

## For Developers

```bash

# Install dependencies
yarn

# Start in dev mode
yarn dev

# Build for production
yarn build

# Bump release version (remember to push branch and tag)
yarn release


```
