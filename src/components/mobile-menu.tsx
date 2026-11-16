'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import styles from './mobile-menu.module.css';

const PANEL_ID = 'mobile-menu-panel';

function useCloseOnEscape(isOpen: boolean, close: () => void, toggle: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      toggle.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close, toggle]);
}

function MenuPanel({ isOpen, onNavigate }: { isOpen: boolean; onNavigate: () => void }) {
  return (
    <nav id={PANEL_ID} aria-label={site.mobileNavigationLabel} className={styles.panel} data-open={isOpen}>
      <ul>
        {site.navigation.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={styles.link} onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <a href={site.signupUrl} className="button button-primary">
          {site.primaryCta}
        </a>
        <a href={site.signInUrl} className="button button-secondary">
          {site.signIn}
        </a>
      </div>
    </nav>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);
  useCloseOnEscape(isOpen, close, toggleRef);

  return (
    <div className={styles.menu}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        aria-label={isOpen ? site.closeMenu : site.openMenu}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className={styles.icon} data-open={isOpen} aria-hidden="true" />
      </button>
      <MenuPanel isOpen={isOpen} onNavigate={close} />
    </div>
  );
}
