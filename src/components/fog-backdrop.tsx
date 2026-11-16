import { FogBank } from './fog-bank';
import styles from './fog-backdrop.module.css';

export function FogBackdrop({ smoke }: { smoke: string }) {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <FogBank sprite={smoke} />
    </div>
  );
}
