'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/content/site';
import { useMediaQuery } from '@/hooks/use-media-query';
import styles from './mobile-menu.module.css';

const PANEL_ID = 'mobile-menu-panel';
const DESKTOP_QUERY = '(min-width: 900px)';
const OUTSIDE_MENU = 'main, body > footer';
const MENU_OPEN_ATTRIBUTE = 'data-menu-open';

type ElementRef<T extends HTMLElement> = RefObject<T | null>;

function useCloseOnEscape(isOpen: boolean, close: () => void, toggle: ElementRef<HTMLButtonElement>) {
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

function useContainFocus(isOpen: boolean, panel: ElementRef<HTMLElement>) {
  useEffect(() => {
    if (!isOpen) return;
    const outside = Array.from(document.querySelectorAll<HTMLElement>(OUTSIDE_MENU));
    outside.forEach((element) => (element.inert = true));
    document.documentElement.setAttribute(MENU_OPEN_ATTRIBUTE, '');
    panel.current?.querySelector('a')?.focus();
    return () => {
      outside.forEach((element) => (element.inert = false));
      document.documentElement.removeAttribute(MENU_OPEN_ATTRIBUTE);
    };
  }, [isOpen, panel]);
}

type MenuPanelProps = { isOpen: boolean; onNavigate: () => void; panelRef: ElementRef<HTMLElement> };

function MenuPanel({ isOpen, onNavigate, panelRef }: MenuPanelProps) {
  return (
    <nav ref={panelRef} id={PANEL_ID} aria-label={site.mobileNavigationLabel} className={styles.panel} data-open={isOpen}>
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
  const [isToggledOpen, setIsToggledOpen] = useState(false);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const isOpen = isToggledOpen && !isDesktop;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setIsToggledOpen(false), []);
  useCloseOnEscape(isOpen, close, toggleRef);
  useContainFocus(isOpen, panelRef);

  return (
    <div className={styles.menu}>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={PANEL_ID}
        onClick={() => setIsToggledOpen(!isOpen)}
      >
        <span className={styles.icon} data-open={isOpen} aria-hidden="true" />
        {site.mobileNavigationLabel}
      </button>
      <MenuPanel isOpen={isOpen} onNavigate={close} panelRef={panelRef} />
    </div>
  );
}
