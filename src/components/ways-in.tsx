import { SectionHeading } from '@/components/section-heading';
import { WaysInScroll } from '@/components/ways-in-scroll';
import { waysIn } from '@/content/home';
import { tokenizeJson } from '@/lib/json-tokens';
import styles from './ways-in.module.css';

const { webPreview, filePreview, code } = waysIn;

type WebResult = (typeof webPreview.results)[number];

function WebResultRow({ result }: { result: WebResult }) {
  return (
    <li className={styles.resultRow} data-found={result.isFound || undefined}>
      <span className={styles.avatar}>
        {result.photo && <img src={result.photo} width={webPreview.photoSize} height={webPreview.photoSize} alt="" loading="lazy" />}
      </span>
      <span className={styles.resultText}>
        <span className={styles.resultName}>{result.name}</span>
        <span className={styles.resultDetail}>{result.detail}</span>
      </span>
      <span className={styles.badge}>{result.isFound ? webPreview.foundLabel : webPreview.missedLabel}</span>
    </li>
  );
}

function WebPane() {
  return (
    <div className={styles.web}>
      <div className={styles.form}>
        <span className={styles.input}>{webPreview.name}</span>
        <span className={styles.input}>{webPreview.company}</span>
        <span className={styles.submit}>{webPreview.submit}</span>
      </div>
      <ul className={styles.results}>
        {webPreview.results.map((result) => (
          <WebResultRow key={result.name} result={result} />
        ))}
      </ul>
    </div>
  );
}

const EMPTY_ROW_COUNT = 4;
const FIRST_DATA_ROW = filePreview.headerRowNumber + 1;

function SheetHead() {
  return (
    <thead>
      <tr className={styles.sheetLetters}>
        <th />
        {filePreview.columnLetters.map((letter) => (
          <th key={letter}>{letter}</th>
        ))}
      </tr>
      <tr>
        <th className={styles.sheetIndex}>{filePreview.headerRowNumber}</th>
        {filePreview.columns.map((column) => (
          <th key={column}>{column}</th>
        ))}
      </tr>
    </thead>
  );
}

function SheetRow({ row, index }: { row: (typeof filePreview.rows)[number]; index: number }) {
  return (
    <tr>
      <th className={styles.sheetIndex}>{FIRST_DATA_ROW + index}</th>
      <td>{row.name}</td>
      <td>{row.company}</td>
      <td className={styles.sheetFill} data-missing={!row.email || undefined}>
        <span>{row.email || filePreview.missingLabel}</span>
      </td>
    </tr>
  );
}

function EmptySheetRow({ number }: { number: number }) {
  return (
    <tr>
      <th className={styles.sheetIndex}>{number}</th>
      <td />
      <td />
      <td />
    </tr>
  );
}

function FilePane() {
  return (
    <div className={styles.sheet}>
      <p className={styles.sheetTab}>{filePreview.fileName}</p>
      <table className={styles.sheetGrid}>
        <SheetHead />
        <tbody>
          {filePreview.rows.map((row, index) => (
            <SheetRow key={row.name} row={row} index={index} />
          ))}
          {Array.from({ length: EMPTY_ROW_COUNT }, (_, offset) => (
            <EmptySheetRow key={offset} number={FIRST_DATA_ROW + filePreview.rows.length + offset} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApiPane() {
  return (
    <div className={styles.code} role="region" aria-label={code.label} tabIndex={0}>
      <p className={styles.codeBar}>
        <span className={styles.codeMethod}>{code.method}</span>
        <span className={styles.codePath}>{code.path}</span>
        <span className={styles.codeStatus}>{code.status}</span>
      </p>
      <pre className={styles.codeBody}>
        {tokenizeJson(code.body).map((token, index) => (
          <span key={index} data-token={token.kind}>
            {token.text}
          </span>
        ))}
      </pre>
    </div>
  );
}

export function WaysIn() {
  return (
    <section id={waysIn.id} className="section" aria-labelledby={`${waysIn.id}-title`}>
      <div className="container">
        <div className={`frame ${styles.frame}`}>
          <header className={`frame-head-centered ${styles.frameHead}`}>
            <SectionHeading id={`${waysIn.id}-title`} title={waysIn.title} lede={waysIn.lede} />
          </header>
          <WaysInScroll ways={waysIn.ways} panes={[<WebPane key="web" />, <FilePane key="file" />, <ApiPane key="api" />]} />
        </div>
      </div>
    </section>
  );
}
