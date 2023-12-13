"use client";

import * as z from "zod";

export const jsonToZod = (jsonSchema: any): any => {
  if (jsonSchema.type === "object") {
    return z.object(
      Object.fromEntries(
        Object.entries(jsonSchema.properties).map(([key, value]) => [
          key,
          jsonToZod(value),
        ])
      )
    );
  } else if (jsonSchema.type === "array") {
    return z.array(jsonToZod(jsonSchema.items));
  } else if (jsonSchema.type === "string") {
    return z.string().nullable();
  } else if (jsonSchema.type === "integer") {
    return z.number().nullable();
  } else if (jsonSchema.type === "boolean") {
    return z.boolean();
  } else if (jsonSchema.type === "null") {
    return z.null();
  } else {
    return z.unknown();
  }
};
