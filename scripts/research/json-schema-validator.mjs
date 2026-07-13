import { readFileSync } from "node:fs";
import { join } from "node:path";

const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const resolveReference = (rootSchema, reference) => {
  if (!reference.startsWith("#/")) return null;
  return reference
    .slice(2)
    .split("/")
    .reduce((value, key) => value?.[key.replaceAll("~1", "/").replaceAll("~0", "~")], rootSchema);
};

const matchesType = (value, type) => {
  if (type === "array") return Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "number") return typeof value === "number" && Number.isFinite(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "null") return value === null;
  return typeof value === type;
};

const validateNode = (value, schema, rootSchema, path) => {
  if (!schema || typeof schema !== "object") return [{ path, message: "Invalid schema node" }];
  if (schema.$ref) {
    const resolved = resolveReference(rootSchema, schema.$ref);
    return resolved
      ? validateNode(value, resolved, rootSchema, path)
      : [{ path, message: `Unresolved schema reference ${schema.$ref}` }];
  }
  if (schema.anyOf) {
    const branches = schema.anyOf.map((branch) => validateNode(value, branch, rootSchema, path));
    return branches.some((errors) => errors.length === 0)
      ? []
      : [{ path, message: "Value does not match any allowed schema" }];
  }
  if (schema.oneOf) {
    const matches = schema.oneOf.filter(
      (branch) => validateNode(value, branch, rootSchema, path).length === 0,
    ).length;
    return matches === 1
      ? []
      : [{ path, message: `Value must match exactly one schema branch; matched ${matches}` }];
  }

  const errors = [];
  if (schema.type && !matchesType(value, schema.type)) {
    return [{ path, message: `Expected ${schema.type}` }];
  }
  if (Object.hasOwn(schema, "const") && !same(value, schema.const)) {
    errors.push({ path, message: `Expected constant ${JSON.stringify(schema.const)}` });
  }
  if (schema.enum && !schema.enum.some((entry) => same(value, entry))) {
    errors.push({ path, message: "Value is not in the allowed enum" });
  }
  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({ path, message: `String is shorter than ${schema.minLength}` });
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({ path, message: `String is longer than ${schema.maxLength}` });
    }
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
      errors.push({ path, message: `String does not match ${schema.pattern}` });
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({ path, message: `Number is below ${schema.minimum}` });
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({ path, message: `Number is above ${schema.maximum}` });
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push({ path, message: `Array has fewer than ${schema.minItems} items` });
    }
    if (schema.uniqueItems) {
      const values = value.map((item) => JSON.stringify(item));
      if (new Set(values).size !== values.length) errors.push({ path, message: "Array items are not unique" });
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateNode(item, schema.items, rootSchema, `${path}[${index}]`));
      });
    }
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.hasOwn(value, required)) errors.push({ path: `${path}.${required}`, message: "Required property is missing" });
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.hasOwn(schema.properties ?? {}, key)) errors.push({ path: `${path}.${key}`, message: "Additional property is not allowed" });
      }
    }
    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      if (Object.hasOwn(value, key)) errors.push(...validateNode(value[key], childSchema, rootSchema, `${path}.${key}`));
    }
  }
  return errors;
};

export const asSchemaDocument = (corpus) => ({
  sources: corpus?.sources,
  observations: corpus?.observations,
  claims: corpus?.claims,
  companies: corpus?.companies,
  industries: corpus?.industries,
  adjacent: corpus?.adjacent,
  "buyer-evidence": corpus?.buyerEvidence,
  "market-analysis": corpus?.marketAnalysis,
  strategies: corpus?.strategies,
  "strategy-research-receipts": corpus?.receipts,
});

export function validateCorpusAgainstSchema(corpus, root) {
  const schema = JSON.parse(
    readFileSync(join(root, "research/schemas/corpus.schema.json"), "utf8"),
  );
  return validateNode(asSchemaDocument(corpus), schema, schema, "$").map((error) => ({
    code: "JSON_SCHEMA_VALIDATION",
    ...error,
  }));
}
