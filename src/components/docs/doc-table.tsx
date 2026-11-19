import { InlineText } from './inline-text';
import styles from './doc-content.module.css';

type DocTableProps = { columns: string[]; rows: string[][] };

export function DocTable({ columns, rows }: DocTableProps) {
  return (
    <div className={styles.tableScroll} tabIndex={0}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <InlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
