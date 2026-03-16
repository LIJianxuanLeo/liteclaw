import type { z } from "zod";

/**
 * Converts a Zod schema to a JSON Schema object compatible with Claude's tool input_schema.
 * Handles the common Zod types used in tool definitions without needing zod-to-json-schema dep.
 */
export function zodToJsonSchema(schema: z.ZodSchema): Record<string, unknown> {
  return convertZodType(schema);
}

function convertZodType(schema: z.ZodSchema): Record<string, unknown> {
  const def = (schema as any)._def;
  const typeName = def?.typeName;

  switch (typeName) {
    case "ZodString":
      return { type: "string", ...(def.description ? { description: def.description } : {}) };

    case "ZodNumber":
      return { type: "number", ...(def.description ? { description: def.description } : {}) };

    case "ZodBoolean":
      return { type: "boolean", ...(def.description ? { description: def.description } : {}) };

    case "ZodArray":
      return {
        type: "array",
        items: convertZodType(def.type),
        ...(def.description ? { description: def.description } : {}),
      };

    case "ZodEnum":
      return {
        type: "string",
        enum: def.values,
        ...(def.description ? { description: def.description } : {}),
      };

    case "ZodObject": {
      const shape = def.shape();
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const [key, value] of Object.entries(shape)) {
        const fieldDef = (value as any)._def;
        if (fieldDef?.typeName === "ZodOptional") {
          properties[key] = convertZodType(fieldDef.innerType);
        } else {
          properties[key] = convertZodType(value as z.ZodSchema);
          required.push(key);
        }
      }

      return {
        type: "object",
        properties,
        required: required.length > 0 ? required : undefined,
        ...(def.description ? { description: def.description } : {}),
      };
    }

    case "ZodOptional":
      return convertZodType(def.innerType);

    case "ZodDefault":
      return convertZodType(def.innerType);

    default:
      return { type: "string" };
  }
}
