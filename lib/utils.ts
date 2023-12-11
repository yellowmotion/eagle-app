import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  } else if (schema.type === "string") return schema;
  else if (schema.type === "integer") return schema;
  else if (schema.type === "number") return schema;
  else if (schema.type === "boolean") return schema;
  else if (schema.type === "array") {
    schema.items = schemaResolve(schema.items, root);
    return schema;
  } else if (schema.type === "object") {
    for (const prop in schema.properties) {
      schema.properties[prop] = schemaResolve(schema.properties[prop], root);
    }
    return schema;
  } else {
    console.log("[SCHEMA] ERRORE: ", schema);
  }
};

const flattenObject = (obj: any, content: any, parentKey: string): any =>
  Object.keys(obj).reduce((acc, key) => {
    const currentKey = parentKey ? `${parentKey}/${key}` : key;

    if (obj[key].type === "object") {
      return {
        ...acc,
        ...flattenObject(obj[key].properties, content[key], currentKey),
      };
    } else if (obj[key].type === "array") {
      return {
        ...acc,
        // ...flattenObject(obj[key].items.properties, content[key], currentKey),
      };
    } else {
      return {
        ...acc,
        [currentKey]: content[key],
      };
    }
  }, {});

export const contentDefaultValues = (schema: any, content: any): any => {
  if (!schema.properties) {
    return;
  }
  const computedSchema = schemaResolve(schema, schema);

  const flatted = flattenObject(computedSchema["properties"], content, "");
  return flatted;
};
