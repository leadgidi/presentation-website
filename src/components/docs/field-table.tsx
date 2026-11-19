import { docsCopy } from '@/content/docs';
import type { OperationParameter, SchemaField } from '@/lib/openapi';
import styles from './doc-content.module.css';

type FieldTableProps = { fields: (SchemaField | OperationParameter)[] };

function FieldDescription({ field }: { field: SchemaField }) {
  return (
    <>
      {field.description && <p>{field.description}</p>}
      {field.allowedValues.length > 0 && (
        <p className={styles.allowedValues}>
          {docsCopy.allowedValuesLabel}{' '}
          {field.allowedValues.map((value) => (
            <code key={value} className={styles.inlineCode}>
              {value}
            </code>
          ))}
        </p>
      )}
    </>
  );
}

function FieldName({ field }: { field: SchemaField | OperationParameter }) {
  return (
    <>
      <code className={styles.fieldName}>{field.name}</code>
      <span className={styles.fieldMeta}>
        {'location' in field && <span>{field.location}</span>}
        <span>{field.type}</span>
        {field.isRequired && <span className={styles.required}>{docsCopy.requiredLabel}</span>}
      </span>
    </>
  );
}

export function FieldTable({ fields }: FieldTableProps) {
  return (
    <dl className={styles.fields}>
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <dt>
            <FieldName field={field} />
          </dt>
          <dd>
            <FieldDescription field={field} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
