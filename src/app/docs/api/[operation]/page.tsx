import { notFound } from 'next/navigation';
import { ApiOperation, OPERATION_SECTION_IDS } from '@/components/docs/api-operation';
import { DocsShell } from '@/components/docs/docs-shell';
import { docsCopy } from '@/content/docs';
import { docsMetadata } from '@/lib/docs-metadata';
import { operationHref } from '@/lib/docs-navigation';
import { loadApiReference, type ApiOperation as Operation } from '@/lib/openapi';

type OperationParams = { params: Promise<{ operation: string }> };

export const dynamicParams = false;

async function findOperation(slug: string): Promise<Operation> {
  const { operations } = await loadApiReference();
  const operation = operations.find((candidate) => candidate.slug === slug);
  if (!operation) notFound();
  return operation;
}

function tableOfContents(operation: Operation) {
  const sections = [
    { id: OPERATION_SECTION_IDS.parameters, label: docsCopy.parametersTitle, isShown: operation.parameters.length > 0 },
    { id: OPERATION_SECTION_IDS.request, label: docsCopy.requestTitle, isShown: operation.requestFields.length > 0 },
    { id: OPERATION_SECTION_IDS.response, label: docsCopy.responseTitle, isShown: operation.successFields.length > 0 },
    { id: OPERATION_SECTION_IDS.statusCodes, label: docsCopy.statusCodesTitle, isShown: true },
  ];
  return sections.filter((section) => section.isShown);
}

export async function generateStaticParams() {
  const { operations } = await loadApiReference();
  return operations.map((operation) => ({ operation: operation.slug }));
}

export async function generateMetadata({ params }: OperationParams) {
  const operation = await findOperation((await params).operation);
  return docsMetadata(operation.summary, operation.description, operationHref(operation.slug));
}

export default async function OperationPage({ params }: OperationParams) {
  const operation = await findOperation((await params).operation);
  const { baseUrl } = await loadApiReference();
  return (
    <DocsShell activeHref={operationHref(operation.slug)} title={operation.summary} lede={operation.description} toc={tableOfContents(operation)}>
      <ApiOperation operation={operation} baseUrl={baseUrl} />
    </DocsShell>
  );
}
