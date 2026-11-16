import { SectionHeading } from '@/components/section-heading';
import { faq } from '@/content/home';
import styles from './faq.module.css';

export function Faq() {
  return (
    <section id={faq.id} className="section" aria-labelledby={`${faq.id}-title`}>
      <div className="container">
        <div className={`frame ${styles.frame}`}>
          <span className="rails rails-up" aria-hidden="true" />
          <div className={styles.head}>
            <SectionHeading id={`${faq.id}-title`} title={faq.title} />
          </div>
          <div className={styles.items}>
            {faq.items.map((item) => (
              <details key={item.question} className={`${styles.item} text-reveal`}>
                <summary className={styles.question}>{item.question}</summary>
                <p className={styles.answer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
