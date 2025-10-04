import "./style.css";
import * as examples from "./exampleSchemas.js";
import {
  SuperFlyTvOgrafDataForm,
  getDefaultDataFromSchema,
} from "../lib/main.js";
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

  const data = getDefaultDataFromSchema(schema);

  const form = new SuperFlyTvOgrafDataForm();
  form.addEventListener("onChange", (e) => {
    if (!(e instanceof CustomEvent)) return;
    console.log("Caught onChange event", JSON.stringify(e.detail));

    dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
  });
  form.addEventListener("onKeyUp", (e) => {
    if (!(e instanceof CustomEvent)) return;
    console.log("Caught onKey event", JSON.stringify(e.detail));

    dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
  });
  form.schema = schema as any;
  form.data = data;

  dataDiv.innerHTML = JSON.stringify(data, null, 2);

  container.appendChild(form);
}
function renderHTML(schema: any) {
  const container = document.createElement("div");
  container.style.width = "100vw";
  app.appendChild(container);

  const dataDiv = document.createElement("div");
  app.appendChild(dataDiv);
  dataDiv.style.whiteSpace = "pre";

  // const data = getDefaultDataFromSchema(schema);

  // const form = new SuperFlyTvOgrafDataForm();
  // form.addEventListener("onChange", (e) => {
  //   if (!(e instanceof CustomEvent)) return;
  //   console.log("Caught onChange event", JSON.stringify(e.detail));

  //   dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
  // });
  // form.addEventListener("onKeyUp", (e) => {
  //   if (!(e instanceof CustomEvent)) return;
  //   console.log("Caught onKey event", JSON.stringify(e.detail));

  //   dataDiv.innerHTML = JSON.stringify(e.detail.data, null, 2);
  // });
  // form.schema = schema as any;
  // form.data = data;

  // dataDiv.innerHTML = JSON.stringify(data, null, 2);

  // container.appendChild(form);
  container.innerHTML = `
    <superflytv-ograf-form
        schema='${JSON.stringify(schema)}'
        data=''
    ></superflytv-ograf-form>

  `;
}

// renderSchema(manifest.schema);
// renderSchema(examples.table);
// renderSchema(examples.nakedTable);
// renderSchema(examples.deepObject);
// renderSchema(examples.objectInArray);
// renderSchema(examples.constraints);
renderSchema(examples.oneOfEach);
renderHTML(examples.oneOfEach);
