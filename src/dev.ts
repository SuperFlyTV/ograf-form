import "./style.css";
import * as examples from "./exampleSchemas.js";
import { SuperFlyTvOgrafDataForm } from "../lib/main.js";
/*
  Note: This sets things up for Development!
  The actual components are in lib/*
*/

const app = document.querySelector<HTMLDivElement>("#app") as HTMLDivElement;

function renderSchema(schema: any) {
  const container = document.createElement("div");
  container.style.width = "100vw";
  app.appendChild(container);

  const dataDiv = document.createElement("div");
  app.appendChild(dataDiv);
  dataDiv.style.whiteSpace = "pre";

  const form = new SuperFlyTvOgrafDataForm();
  form.addEventListener("change", (e) => {
    if (!e.target) return;
    if (!(e instanceof CustomEvent)) return;
    if (!(e.target instanceof SuperFlyTvOgrafDataForm)) {
      throw new Error("Unexpected target");
    }
    console.log("JS: Caught change event", e.target.value);

    dataDiv.innerHTML = JSON.stringify(e.target.value, null, 2);
  });
  form.addEventListener("keyup", (e) => {
    if (!(e instanceof CustomEvent)) return;

    if (!(e.target instanceof SuperFlyTvOgrafDataForm)) {
      throw new Error("Unexpected target");
    }
    console.log("JS: Caught keyup event", e.target.value);

    dataDiv.innerHTML = JSON.stringify(e.target.value, null, 2);
  });
  form.schema = schema as any;
  // form.value = value;

  // dataDiv.innerHTML = JSON.stringify(value, null, 2);

  container.appendChild(form);
}
function renderHTML(schema: any) {
  const container = document.createElement("div");
  container.style.width = "100vw";
  app.appendChild(container);

  const dataDiv = document.createElement("div");
  app.appendChild(dataDiv);
  dataDiv.style.whiteSpace = "pre";

  // container.appendChild(form);
  container.innerHTML = `
    <superflytv-ograf-form
        schema='${JSON.stringify(schema)}'

        onchange="console.log('HTML: Caught change event', this.value)"
        onkeyup="console.log('HTML: Caught keyup event', this.value)"
    ></superflytv-ograf-form>

  `;
}

// renderSchema(examples.table);
renderSchema(examples.nakedTable);
// renderSchema(examples.deepObject);
// renderSchema(examples.objectInArray);
// renderSchema(examples.constraints);
// renderSchema(examples.oneOfEach);
renderHTML(examples.table);
