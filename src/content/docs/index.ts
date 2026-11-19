import { authentication, errors, fileUploads, quickstart, retries } from './api-guides';
import { credits, howItWorks } from './getting-started';
import type { DocSection } from './types';
import { history, importAFile, interactiveEnrich } from './using-the-app';

export type { DocBlock, DocPage, DocSection } from './types';

export const docsBasePath = '/docs/';
export const apiReferenceBasePath = '/docs/api/';

export const docSections: DocSection[] = [
  { title: 'Getting started', pages: [howItWorks, credits] },
  { title: 'Using the app', pages: [interactiveEnrich, importAFile, history] },
  { title: 'API', pages: [quickstart, authentication, fileUploads, retries, errors] },
];

export const docsCopy = {
  title: 'Documentation',
  seoTitle: 'Leadgidi Enrich documentation and API reference',
  description:
    'Guides for enriching contacts with Leadgidi Enrich in the app or through the API, plus the full REST API reference.',
  lede: 'Find work emails and phone numbers in the app, from a file or through the API.',
  pageTitleSuffix: 'Leadgidi Docs',
  navigationLabel: 'Documentation',
  browseLabel: 'Browse documentation',
  tocLabel: 'On this page',
  apiReferenceTitle: 'API reference',
  apiReferenceDescription: 'Every endpoint, its parameters, request body and responses.',
  baseUrlLabel: 'Base URL',
  authenticationLabel: 'Authentication',
  authenticationNames: { ApiKeyBearer: 'API key' } as Record<string, string>,
  parametersTitle: 'Parameters',
  requestTitle: 'Request body',
  responseTitle: 'Response',
  statusCodesTitle: 'Status codes',
  exampleRequestLabel: 'Example request',
  exampleResponseLabel: 'Example response',
  fieldColumn: 'Field',
  typeColumn: 'Type',
  locationColumn: 'In',
  descriptionColumn: 'Description',
  statusColumn: 'Status',
  requiredLabel: 'required',
  allowedValuesLabel: 'One of:',
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
  previousLabel: 'Previous',
  nextLabel: 'Next',
  pagerLabel: 'Previous and next page',
};
