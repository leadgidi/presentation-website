import { site } from '@/content/site';
import { DotField } from '@/components/dot-field';
import { Tagline } from '@/components/tagline';
import { WaitlistForm } from '@/components/waitlist-form';

export default function Home() {
  return (
    <>
      <DotField />
      <header className="topbar">
        <span className="wordmark">{site.company}</span>
      </header>
      <main>
        <h1>{site.headline}</h1>
        <Tagline lines={site.taglines} />
        <p className="soon">{site.comingSoon}</p>
        <WaitlistForm />
      </main>
      <footer className="footer">
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        <span>{site.copyright}</span>
      </footer>
    </>
  );
}
