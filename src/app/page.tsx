import { site } from '@/content/site';
import { DotField } from '@/components/dot-field';
import { Tagline } from '@/components/tagline';

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
      </main>
      <footer className="footer">
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
        <span>{site.copyright}</span>
      </footer>
    </>
  );
}
