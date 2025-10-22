# OGraf-form

[![NPM Version](https://img.shields.io/npm/v/ograf-form)](https://www.npmjs.com/package/ograf-form)

This is a Web Component for generating input forms from [OGraf/GDD](https://ograf.ebu.io/) schemas.

## Getting Started

```bash
npm install ograf-form
```

Or you can use a CDN: `https://cdn.jsdelivr.net/npm/ograf-form);`

### Example usage

- How to use directly in html: [Code](/examples/html.html), [JSFiddle](https://jsfiddle.net/L2trysaz/).
- How to use with javascript: [Code](/examples/javascript.html), [JSFiddle](https://jsfiddle.net/2Lhgco5b/).
- How to use with React: [Code](/examples/react.jsx).

### Example implementation

```html
<!DOCTYPE html>
<html>
  <body>
    <script
      type="module"
      src="https://cdn.jsdelivr.net/npm/ograf-form"
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
      form.addEventListener("change", (e) => {
        console.log("Caught change event", e.target.value);
        // The change event is fired when a user changes a value in the form
        // It does NOT fire on each key stroke.
        // This is a good time to update our data object:
        dataDiv.innerHTML = JSON.stringify(e.target.value, null, 2);
      });
      form.addEventListener("keyup", (e) => {
        console.log("Caught keyup event", e.target.value);
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

## TODO

- Support `patternProperties`, `additionalProperties`, `unevaluatedProperties`
- Support tuples (`prefixItems` / `items` as array) & `additionalItems`
