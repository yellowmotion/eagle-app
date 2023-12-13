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

const flattenArray = (obj: any, content: any, parentKey: string): any => {
  return content.reduce((acc: any, item: any, index: number) => {
    const currentKey = `${parentKey}/${index}`;
    return {
      ...acc,
      ...flattenObject(obj, item, currentKey),
    };
  }, {});
};

export const contentDefaultValues = (schema: any, content: any): any => {
  if (!schema.properties) {
    return;
  }
  const computedSchema = schemaResolve(schema, schema);

  const flatted = flattenObject(computedSchema, content, "");
  return flatted;
};

export const groupKeys = (obj: Record<string, any>): any => {
  const result = {};

  Object.keys(obj).forEach((key) => {
    const parts = key.split("/");
    let currentObj = result;

    parts.forEach((part: string, index) => {
      if (index === parts.length - 1) {
        currentObj[part] = obj[key];
      } else {
        if (parts[index + 1].match(/^\d+$/)) {
          if (!currentObj[part]) {
            currentObj[part] = [];
          }
        } else {
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

export const splitKeyDisplays = (key: string): string => {
  // Verifica se la stringa termina con uno slash seguito da uno o più numeri
  const regex = /\/\d+$/;
  if (regex.test(key)) {
    return "";
  }

  // Altrimenti, separa la stringa camelCase
  const words = key.split(/(?=[A-Z])/);
  return words.map((word) => word.toLowerCase()).join(" ");
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
  return lastPathComponent ? lastPathComponent : key;
};
