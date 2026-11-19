import type { ApiOperation } from './openapi';

const API_KEY_VARIABLE = '$LEADGIDI_API_KEY';
const LINE_BREAK = ' \\\n  ';

function placeholderFor(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

function urlFor(baseUrl: string, operation: ApiOperation): string {
  const path = operation.path.replace(/\{(\w+)\}/g, (_, name: string) => placeholderFor(name));
  return `${baseUrl}${path}`;
}

function quoteBody(example: string): string {
  return `'${example.replace(/'/g, "'\\''")}'`;
}

export function buildCurlExample(baseUrl: string, operation: ApiOperation): string {
  const hasIdempotencyKey = operation.parameters.some((parameter) => parameter.name === 'Idempotency-Key');
  const parts = [
    `curl${operation.method === 'GET' ? '' : ` -X ${operation.method}`} ${urlFor(baseUrl, operation)}`,
    `-H "Authorization: Bearer ${API_KEY_VARIABLE}"`,
    ...(hasIdempotencyKey ? ['-H "Idempotency-Key: $(uuidgen)"'] : []),
    ...(operation.requestExample
      ? ['-H "Content-Type: application/json"', `-d ${quoteBody(operation.requestExample)}`]
      : []),
  ];
  return parts.join(LINE_BREAK);
}
