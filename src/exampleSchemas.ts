import type { GDDSchema } from "../lib/lib/types";

export const table: GDDSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      gddType: "single-line",
      default: "My Table",
      description: "This is the name of the thing",
    },

    table: {
      description: "this is a nice table!",
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            gddType: "single-line",
            default: "New Name",
            title: "Name",
            description: "The name of the person",
          },
          age: {
            type: "integer",
            default: 30,
          },
          age2: {
            type: "number",
            default: 30.5,
          },
          isActive: {
            type: "boolean",
            gddType: "select",
            gddOptions: {
              labels: {
                true: "Active",
                false: "Inactive",
              },
            },
          },
        },
      },
      default: [
        {
          name: "Alice",
          age: 28,
          isActive: true,
        },
        {
          name: "Bob",
          age: 35,
          isActive: false,
        },
      ],
    },
  },
};
export const nakedTable: GDDSchema = {
  type: "object",
  properties: {
    table: {
      type: "array",
      items: {
        type: "string",
      },
      default: ["a", "b", "c"],
    },
  },
};
export const deepObject: GDDSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "asdfasdf asd fas dfa sdf asdf asd f",
    },
    obj2: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "asdfasdf asd fas dfa sdf asdf asd f",
        },
        aaaa: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "asdfasdf asd fas dfa sdf asdf asd f",
            },
            aaaa: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "asdfasdf asd fas dfa sdf asdf asd f",
                },
                aaaa: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};
export const objectInArray: GDDSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "asdfasdf asd fas dfa sdf asdf asd f",
    },
    colors: {
      title: "Colors",
      description: "this is a nice array!",
      type: "array",
      items: {
        type: "string",
      },
      default: ["red", "green", "blue"],
    },
    people: {
      title: "People",
      description: "this is a nice table!",
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "asdfasdf asd fas dfa sdf asdf asd f",
            default: "New Name",
          },
          age: {
            type: "integer",
            default: 30,
          },
          valid: {
            type: "boolean",
            default: true,
          },
        },
      },
      default: [
        {
          name: "Alice",
          age: 28,
          valid: true,
        },
        {
          name: "Bob",
          age: 35,
        },
      ],
    },
  },
};

export const oneOfEach: GDDSchema = {
  type: "object",
  properties: {
    boolean: {
      type: "boolean",
      title: "Basic Boolean",
      description: "This is a boolean input",
      default: false,
    },
    string: {
      type: "string",
      title: "Basic String",
      description: "This is a basic string",
      default: "My Name",
    },
    number: {
      type: "number",
      title: "Basic Number",
      description: "This is a basic number",
      default: 1.618,
    },
    integer: {
      type: "integer",
      title: "Basic Integer",
      description: "This is a basic integer",
      default: 42,
    },
    arrayIntegers: {
      type: "array",
      title: "Array of Integers",
      description: "This is an array of strings",
      default: [1, 2, 3],
      items: {
        type: "integer",
        default: 1,
        title: "Integer",
        description: "This is an integer in an array",
      },
      // maxItems: 5,
      // minItems: 2,
      uniqueItems: true,

      // contains: {
      //   type: "integer",
      //   const: 7,
      // },
    },
    arrayObjects: {
      type: "array",
      title: "Array of Objects",
      description: "This is an array of objects",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
            description: "This is a string in an object in an array",
            default: "New Name",
          },
          age: {
            type: "integer",
            title: "Age",
            description: "This is an integer in an object in an array",
            default: 30,
          },
        },
      },
      default: [
        {
          name: "Alice",
          age: 28,
        },
        {
          name: "Bob",
          age: 35,
        },
      ],
    },
    object: {
      type: "object",
      title: "Basic Object",
      description: "This is a basic object",
      properties: {
        name: {
          type: "string",
          title: "Name",
          description: "This is a string in an object",
          default: "My Name",
        },
        age: {
          type: "integer",
          title: "Age",
          description: "This is an integer in an object",
          default: 30,
        },
      },
      required: ["name", "age"],

      default: {
        name: "My Name",
        age: 30,
      },
    },
    gddSingleLine: {
      type: "string",
      title: "GDD Single Line",
      gddType: "single-line",
      description: "This is a GDD: single-line text",
      default: "Single Line",
    },
    multiLine: {
      type: "string",
      title: "GDD Multi Line",
      gddType: "multi-line",
      description: "This is a GDD: multi-line text",
      default: "Multi\nLine",
    },
    filePath: {
      type: "string",
      title: "GDD File Path",
      gddType: "file-path",
      description:
        "This is a GDD: File Path. It should open a file picker which allows txt and json.",
      gddOptions: {
        extensions: ["txt", "json"],
      },
      default: "/path/to/file.txt",
    },
    imageFilePath: {
      type: "string",
      title: "GDD Image File Path",
      gddType: "file-path/image-path",
      description:
        "This is a GDD: Image File Path. It should open a file picker which allows jpg only.",
      gddOptions: {
        extensions: ["jpg"],
      },
      default: "/path/to/image.jpg",
    },
    selectString: {
      type: "string",
      title: "GDD Select String",
      enum: ["option1", "option2", "option3"],
      description: "This is a GDD: Select with string options",
      gddType: "select",
      gddOptions: {
        labels: {
          option1: "Option 1",
          option2: "Option 2",
          option3: "Option 3",
        },
      },
      default: "option2",
    },
    selectInteger: {
      type: "integer",
      title: "GDD Select Integer",
      enum: [1, 2, 3],
      description: "This is a GDD: Select with integer options",
      gddType: "select",
      gddOptions: {
        labels: {
          1: "One",
          2: "Two",
          3: "Three",
        },
      },
      default: 2,
    },
    selectNumber: {
      type: "number",
      title: "GDD Select Number",
      enum: [1.5, 2.5, 3.5],
      description: "This is a GDD: Select with number options",
      gddType: "select",
      gddOptions: {
        labels: {
          1.5: "One Point Five",
          2.5: "Two Point Five",
          3.5: "Three Point Five",
        },
      },
      default: 2.5,
    },
    colorRRGGBB: {
      type: "string",
      title: "GDD Color RRGGBB",
      pattern: "^#[0-9a-f]{6}$",
      gddType: "color-rrggbb",
      description: "This is a GDD: Color RR GG BB",
      default: "#ff0000",
    },
    colorRRGGBBAA: {
      type: "string",
      title: "GDD Color RRGGBBAA",
      pattern: "^#[0-9a-f]{8}$",
      gddType: "color-rrggbbaa",
      description: "This is a GDD: Color RR GG BB AA",
      default: "#ff0000ff",
    },
    percentage: {
      type: "number",
      title: "GDD Percentage",
      gddType: "percentage",
      description: "This is a GDD: Percentage",
      default: 0.75,
    },
    durationMs: {
      type: "integer",
      title: "GDD Duration in milliseconds",
      gddType: "duration-ms",
      description: "This is a GDD: Duration in milliseconds",
      default: 1500,
    },
  },
};
export const constraints: GDDSchema = {
  type: "object",
  properties: {
    maxmin: {
      type: "number",
      // default: "4",

      // minimum: 0,
      // exclusiveMinimum: 0,
      // maximum: 3,
      // exclusiveMaximum: 3,
    },
  },
};
