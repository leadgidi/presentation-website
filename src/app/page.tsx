import { SiteHeader } from '@/components/site-header';
import { Hero } from '@/components/hero';
import { WhatYouGet } from '@/components/what-you-get';
import { PayPerResult } from '@/components/pay-per-result';
import { WaysIn } from '@/components/ways-in';
import { Pricing } from '@/components/pricing';
import { Faq } from '@/components/faq';
import { ClosingCta } from '@/components/closing-cta';
import { SiteFooter } from '@/components/site-footer';
import { site } from '@/content/site';

const MAIN_ID = 'main';

export default function Home() {
  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link">
        {site.skipToContent}
      </a>
      <SiteHeader />
      <main id={MAIN_ID}>
        <Hero />
        <div className="contour-backdrop">
          <WhatYouGet />
          <PayPerResult />
        </div>
        <WaysIn />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
