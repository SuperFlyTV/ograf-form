# OGraf-form

This is a Web Component for generating input forms from [OGraf/GDD](https://ograf.ebu.io/) schemas.

## Getting Started

```bash
npm install ograf-form
```

Or you can use a CDN: `https://cdn.jsdelivr.net/npm/ograf-form/dist/main.js);`

### Example usage

- How to use directly in html: [Code](/blob/main/examples/html.html), [Live Example](https://html-preview.github.io/?url=https://github.com/SuperFlyTV/ograf-form/blob/main/examples/html.html).
- How to use with javascript: [Code](/blob/main/examples/javascript.html), [Live Example](https://html-preview.github.io/?url=https://github.com/SuperFlyTV/ograf-form/blob/main/examples/javascript.html).
- How to use with React: [Code](/blob/main/examples/react.jsx).

### Example implementation

```html
<!DOCTYPE html>
<html>
  <body>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/ograf-form/dist/main.js"
    ></script>
    <!-- <script type="module" src="/dist/main.js"></script> -->

    <div id="form-container" style="width: 100vw">
      <superflytv-ograf-form
        id="ograf-form"
        schema='{"type":"object","properties":{"name":{"type":"string","gddType":"single-line","default":"John Doe","description":"This is the name of the thing"}}}'
      ></superflytv-ograf-form>
    </div>
    <div id="data" style="white-space: pre"></div>

    <script type="text/javascript">
      // Listen to changes:
      const form = document.getElementById("ograf-form");
      const dataDiv = document.getElementById("data");
      form.addEventListener("onChange", (e) => {
        console.log("Caught onChange event", e.detail.data);
        // The onChange event is fired when a user changes a value in the form
        // It does NOT fire on each key stroke.
        // This is a good time to update our data object:
        dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
      });
      form.addEventListener("onKeyUp", (e) => {
        console.log("Caught onKeyUp event", e.detail.data);
      });
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
