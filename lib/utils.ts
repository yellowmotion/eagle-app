import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Composes the schema by resolving any `$ref` references recursively within the given schema object.
 * @param schema The schema object returned by the API, which may contain `$ref` references.
 * @param root A reference to the original schema object passed to the first call of `schemaResolve`, used to access its fields during recursive operations.
 * @returns A composed schema object with resolved `$ref` references.
 */
export const schemaResolve = (schema: any, root: any) => {
  if (!schema) {
    return schema;
  }

  if ("$ref" in schema) {
    const refPath = schema["$ref"].split("/");
    let refObj = root;

    for (let i = 1; i < refPath.length; i++) {
      refObj = refObj[refPath[i]];
    }

    for (const prop in refObj.properties) {
      refObj.properties[prop] = schemaResolve(refObj.properties[prop], root);
    }
    return refObj;
  } 
  else if (schema.type === "string") return schema;
  else if (schema.type === "integer") return schema;
  else if (schema.type === "number") return schema;
  else if (schema.type === "boolean") return schema;
  else if (schema.type === "array") {
    schema.items = schemaResolve(schema.items, root);
    return schema;
  } 
  else if (schema.type === "object") {
    for (const prop in schema.properties) {
      schema.properties[prop] = schemaResolve(schema.properties[prop], root);
    }
    return schema;
  } 
  else {
    console.log("[SCHEMA] ERRORE: ", schema);
  }
};

/**
 * Flattens an object schema by recursively extracting its properties into a flat key-value structure.
 * @param obj The object schema to be flattened.
 * @param content The content corresponding to the object schema.
 * @param parentKey The parent key of the current object schema (used for building nested keys).
 * @returns A flat key-value structure representing the flattened object schema.
 */
const flattenObject = (obj: any, content: any, parentKey: string): any => {
  if (obj.type === "object") {
    return Object.keys(obj.properties).reduce((acc, key) => {
      const currentKey = parentKey ? `${parentKey}/${key}` : key;
      return {
        ...acc,
        ...flattenObject(obj.properties[key], content[key], currentKey),
      };
    }, {});
  } else if (obj.type === "array") {
    return {
      ...flattenArray(obj.items, content, parentKey),
    };
  } else {
    return {
      [parentKey]: content,
    };
  }
};

/**
 * Flattens an array schema by recursively extracting its items into a flat key-value structure.
 * @param obj The array schema to be flattened.
 * @param content The content corresponding to the array schema.
 * @param parentKey The parent key of the current array schema (used for building nested keys).
 * @returns A flat key-value structure representing the flattened array schema.
 */
const flattenArray = (obj: any, content: any, parentKey: string): any => {
  return content.reduce((acc: any, item: any, index: number) => {
    const currentKey = `${parentKey}/${index}`;
    return {
      ...acc,
      ...flattenObject(obj, item, currentKey),
    };
  }, {});
};

/**
 * Computes default values for content based on the provided schema, handling nested structures.
 * @param schema The schema object defining the structure of the content.
 * @param content The content to which default values should be applied.
 * @returns A flat key-value structure representing the default values for the content.
 */
export const contentDefaultValues = (schema: any, content: any): any => {
  if (!schema.properties) {
    return;
  }

  const flatted = flattenObject(schema, content, "");
  return flatted;
};

/**
 * Groups a flat key-value structure into nested objects based on the keys.
 * @param obj The flat key-value structure to be grouped.
 * @param schema The initial schema object used to determine the types of values.
 * @returns An object with nested structures based on the keys of the input object.
 */
export const groupKeys = (obj: Record<string, any>, schema: any): any => {
  const result = {};
  if (!schema.properties) {
    return result;
  }
  const properties = schema.properties;

  Object.keys(obj).forEach((key) => {
    const parts = key.split("/");
    let currentObj: { [k: string]: any } = result;
    let currentSchema = properties[parts[0]];

    parts.forEach((part: string, index) => {
      if (index === parts.length - 1) {
        if(currentSchema.type === "integer"){
          obj[key] = parseInt(obj[key]);
        } else if(currentSchema.type === "number"){
          obj[key] = parseFloat(obj[key]);
        }

        currentObj[part] = obj[key];
        
      } else {
        if (RegExp(/^\d+$/).exec(parts[index + 1])) {
          currentSchema = currentSchema.items;
          if (!currentObj[part]) {
            currentObj[part] = [];
          }
        } else {
          currentSchema = currentSchema.properties[parts[index + 1]];
          if (!currentObj[part]) {
            currentObj[part] = {};
          }
        }
        currentObj = currentObj[part];
      }
    });
  });

  return result;
};

export const splitKeyDisplay = (key: string): string => {
  const regex = /\/\d+$/;
  if (regex.test(key)) {
    return "";
  }

  const words = key.split(/(?=[A-Z])/);

  const lastPathComponent = words
    .map((word) => word.toLowerCase())
    .join(" ")
    .split("/")
    .pop();
  return lastPathComponent || key;
};
