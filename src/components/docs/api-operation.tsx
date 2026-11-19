import { docsCopy } from '@/content/docs';
import { buildCurlExample } from '@/lib/curl-example';
import type { ApiOperation as Operation } from '@/lib/openapi';
import { CodeBlock } from './code-block';
import { DocTable } from './doc-table';
import { FieldTable } from './field-table';
import styles from './doc-content.module.css';

type ApiOperationProps = { operation: Operation; baseUrl: string };

export const OPERATION_SECTION_IDS = {
  parameters: 'parameters',
  request: 'request-body',
  response: 'response',
  statusCodes: 'status-codes',
};

function Endpoint({ operation, baseUrl }: ApiOperationProps) {
  const authentication = operation.authentication.flatMap((name) => docsCopy.authenticationNames[name] ?? []);
  return (
    <div className={styles.endpoint}>
      <p className={styles.endpointPath}>
        <span className={styles.method}>{operation.method}</span>
        <code>{operation.path}</code>
      </p>
      <dl className={styles.endpointMeta}>
        <dt>{docsCopy.baseUrlLabel}</dt>
        <dd>
          <code className={styles.inlineCode}>{baseUrl}</code>
        </dd>
        <dt>{docsCopy.authenticationLabel}</dt>
        <dd>{authentication.join(', ')}</dd>
      </dl>
    </div>
  );
}

function OperationSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={styles.operationSection}>
      <h2 id={id} className={styles.heading}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function statusRows(operation: Operation): string[][] {
  return operation.responses.map((response) => [
    `\`${response.status}\``,
    response.problemType ? `${response.description} \`${response.problemType}\`` : response.description,
  ]);
}

export function ApiOperation({ operation, baseUrl }: ApiOperationProps) {
  return (
    <>
      <Endpoint operation={operation} baseUrl={baseUrl} />
      <CodeBlock code={buildCurlExample(baseUrl, operation)} language="bash" label={docsCopy.exampleRequestLabel} />
      {operation.parameters.length > 0 && (
        <OperationSection id={OPERATION_SECTION_IDS.parameters} title={docsCopy.parametersTitle}>
          <FieldTable fields={operation.parameters} />
        </OperationSection>
      )}
      {operation.requestFields.length > 0 && (
        <OperationSection id={OPERATION_SECTION_IDS.request} title={docsCopy.requestTitle}>
          <FieldTable fields={operation.requestFields} />
        </OperationSection>
      )}
      {operation.successFields.length > 0 && (
        <OperationSection id={OPERATION_SECTION_IDS.response} title={docsCopy.responseTitle}>
          {operation.successExample && (
            <CodeBlock code={operation.successExample} language="json" label={docsCopy.exampleResponseLabel} />
          )}
          <FieldTable fields={operation.successFields} />
        </OperationSection>
      )}
      <OperationSection id={OPERATION_SECTION_IDS.statusCodes} title={docsCopy.statusCodesTitle}>
        <DocTable columns={[docsCopy.statusColumn, docsCopy.descriptionColumn]} rows={statusRows(operation)} />
      </OperationSection>
    </>
  );
}
