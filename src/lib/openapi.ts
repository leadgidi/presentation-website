import { cache } from 'react';
import { parse } from 'yaml';

const OPENAPI_PATH = '/openapi.yml';
const LOCAL_REF_PREFIX = '#/';
const MAX_FIELD_DEPTH = 7;
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;
const JSON_MEDIA_TYPE = 'application/json';

type HttpMethod = (typeof HTTP_METHODS)[number];
type JsonObject = Record<string, unknown>;

export type SchemaField = {
  name: string;
  type: string;
  isRequired: boolean;
  description: string;
  allowedValues: string[];
};

export type OperationParameter = SchemaField & { location: string };

export type OperationResponse = { status: string; description: string; problemType: string | null };

export type ApiOperation = {
  slug: string;
  method: string;
  path: string;
  summary: string;
  description: string;
  authentication: string[];
  parameters: OperationParameter[];
  requestFields: SchemaField[];
  requestExample: string | null;
  successFields: SchemaField[];
  successExample: string | null;
  responses: OperationResponse[];
};

export type ApiReference = { baseUrl: string; operations: ApiOperation[] };

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function resolve(document: JsonObject, value: unknown): JsonObject {
  if (!isObject(value)) return {};
  const reference = asText(value.$ref);
  if (!reference.startsWith(LOCAL_REF_PREFIX)) return value;
  const target = reference
    .slice(LOCAL_REF_PREFIX.length)
    .split('/')
    .reduce<unknown>((node, key) => (isObject(node) ? node[key] : undefined), document);
  return resolve(document, target);
}

function toSlug(operationId: string, path: string): string {
  if (!operationId) throw new Error(`The operation at ${path} has no operationId; each reference page is named after it.`);
  return operationId.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function firstParagraph(text: string): string {
  return text.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
}

function listOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function mergeProperty(document: JsonObject, kept: unknown, added: unknown): unknown {
  if (kept === undefined) return added;
  const keptValues = allowedValues(resolve(document, kept));
  const addedValues = allowedValues(resolve(document, added));
  if (keptValues.length === 0 || addedValues.length === 0) return kept;
  return { ...resolve(document, kept), const: undefined, enum: [...new Set([...keptValues, ...addedValues])] };
}

function mergeProperties(document: JsonObject, kept: unknown, added: unknown): JsonObject {
  const merged: JsonObject = { ...(isObject(kept) ? kept : {}) };
  Object.entries(isObject(added) ? added : {}).forEach(([key, value]) => {
    merged[key] = mergeProperty(document, merged[key], value);
  });
  return merged;
}

// oneOf variants differ by status, so their fields are listed together but never marked required.
function mergeVariants(document: JsonObject, schema: JsonObject): JsonObject {
  const required = (part: JsonObject) => listOf(part.required);
  const combine = (merged: JsonObject, variant: unknown, keepsRequired: boolean): JsonObject => {
    const { description, ...variantPart } = mergeVariants(document, resolve(document, variant));
    const part = keepsRequired ? { ...variantPart, description } : variantPart;
    return {
      ...part,
      ...merged,
      properties: mergeProperties(document, merged.properties, part.properties),
      required: keepsRequired ? [...required(merged), ...required(part)] : required(merged),
    };
  };
  const withAllOf = listOf(schema.allOf).reduce<JsonObject>((merged, part) => combine(merged, part, true), schema);
  const alternatives = [...listOf(schema.oneOf), ...listOf(schema.anyOf)];
  const { allOf, oneOf, anyOf, ...merged } = alternatives.reduce<JsonObject>(
    (result, part) => combine(result, part, false),
    withAllOf,
  );
  return merged;
}

function typeLabel(document: JsonObject, schema: JsonObject): string {
  const types = Array.isArray(schema.type) ? schema.type.map(asText) : [asText(schema.type)];
  const named = types.filter((type) => type && type !== 'null');
  const base = named[0] || (isObject(schema.properties) || schema.oneOf || schema.anyOf || schema.allOf ? 'object' : 'string');
  const label = base === 'array' ? `array of ${typeLabel(document, resolve(document, schema.items))}` : base;
  return types.includes('null') ? `${label} or null` : label;
}

function allowedValues(schema: JsonObject): string[] {
  if (Array.isArray(schema.enum)) return schema.enum.map(String);
  return schema.const === undefined ? [] : [String(schema.const)];
}

function describeField(document: JsonObject, name: string, schema: JsonObject, isRequired: boolean): SchemaField {
  return {
    name,
    type: typeLabel(document, schema),
    isRequired,
    description: firstParagraph(asText(schema.description)),
    allowedValues: allowedValues(schema),
  };
}

function flattenFields(document: JsonObject, rawSchema: unknown, prefix = '', depth = 0): SchemaField[] {
  const schema = mergeVariants(document, resolve(document, rawSchema));
  const properties = isObject(schema.properties) ? schema.properties : {};
  const required = Array.isArray(schema.required) ? schema.required.map(asText) : [];
  return Object.entries(properties).flatMap(([key, rawProperty]) => {
    const property = mergeVariants(document, resolve(document, rawProperty));
    const name = `${prefix}${key}`;
    const field = describeField(document, name, property, required.includes(key));
    if (depth >= MAX_FIELD_DEPTH) return [field];
    const isArray = typeLabel(document, property).startsWith('array');
    const child = isArray ? property.items : property;
    return [field, ...flattenFields(document, child, `${name}${isArray ? '[].' : '.'}`, depth + 1)];
  });
}

function jsonContent(document: JsonObject, owner: unknown): JsonObject {
  const content = resolve(document, owner).content;
  return isObject(content) ? resolve(document, content[JSON_MEDIA_TYPE]) : {};
}

function exampleOf(document: JsonObject, media: JsonObject): string | null {
  const firstExample = isObject(media.examples) ? Object.values(media.examples)[0] : undefined;
  const example = media.example ?? resolve(document, firstExample).value;
  return example === undefined ? null : JSON.stringify(example, null, 2);
}

function problemTypeOf(document: JsonObject, response: JsonObject): string | null {
  const content = isObject(response.content) ? response.content : {};
  const problem = resolve(document, content['application/problem+json']);
  return asText(resolve(document, problem.example).type) || null;
}

function toResponses(document: JsonObject, responses: JsonObject): OperationResponse[] {
  return Object.entries(responses).map(([status, raw]) => {
    const response = resolve(document, raw);
    return { status, description: firstParagraph(asText(response.description)), problemType: problemTypeOf(document, response) };
  });
}

function toParameter(document: JsonObject, raw: unknown): OperationParameter {
  const parameter = resolve(document, raw);
  const schema = resolve(document, parameter.schema);
  const field = describeField(document, asText(parameter.name), schema, parameter.required === true);
  return { ...field, description: firstParagraph(asText(parameter.description)), location: asText(parameter.in) };
}

function securityNames(document: JsonObject, operation: JsonObject): string[] {
  const requirements = Array.isArray(operation.security) ? operation.security : document.security;
  if (!Array.isArray(requirements)) return [];
  return requirements.flatMap((requirement) => (isObject(requirement) ? Object.keys(requirement) : []));
}

function successResponse(document: JsonObject, responses: JsonObject): JsonObject {
  const status = Object.keys(responses).find((code) => code.startsWith('2') && code !== '200') ?? '200';
  return resolve(document, responses[status]);
}

function toOperation(document: JsonObject, path: string, method: HttpMethod, operation: JsonObject): ApiOperation {
  const responses = isObject(operation.responses) ? operation.responses : {};
  const request = jsonContent(document, operation.requestBody);
  const success = jsonContent(document, successResponse(document, responses));
  return {
    slug: toSlug(asText(operation.operationId), `${method.toUpperCase()} ${path}`),
    method: method.toUpperCase(),
    path,
    summary: asText(operation.summary),
    description: firstParagraph(asText(operation.description)),
    authentication: securityNames(document, operation),
    parameters: (Array.isArray(operation.parameters) ? operation.parameters : []).map((raw) => toParameter(document, raw)),
    requestFields: flattenFields(document, request.schema),
    requestExample: exampleOf(document, request),
    successFields: flattenFields(document, success.schema),
    successExample: exampleOf(document, success),
    responses: toResponses(document, responses),
  };
}

function toOperations(document: JsonObject): ApiOperation[] {
  const paths = isObject(document.paths) ? document.paths : {};
  return Object.entries(paths).flatMap(([path, rawItem]) => {
    const item = resolve(document, rawItem);
    return HTTP_METHODS.filter((method) => isObject(item[method])).map((method) =>
      toOperation(document, path, method, item[method] as JsonObject),
    );
  });
}

function baseUrlOf(document: JsonObject): string {
  const servers = Array.isArray(document.servers) ? document.servers : [];
  const url = asText(resolve(document, servers[0]).url);
  if (!url) throw new Error('The OpenAPI document has no server URL.');
  return url;
}

async function fetchOpenApi(): Promise<JsonObject> {
  const apiUrl = process.env.CATALOG_API_URL;
  if (!apiUrl) throw new Error('CATALOG_API_URL is not set; the API reference is built from the backend OpenAPI document.');
  const response = await fetch(`${apiUrl}${OPENAPI_PATH}`, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`OpenAPI request failed with HTTP ${response.status}.`);
  const document: unknown = parse(await response.text());
  if (!isObject(document) || !isObject(document.paths)) throw new Error('The OpenAPI document has no paths.');
  return document;
}

export const loadApiReference = cache(async (): Promise<ApiReference> => {
  const document = await fetchOpenApi();
  return { baseUrl: baseUrlOf(document), operations: toOperations(document) };
});
