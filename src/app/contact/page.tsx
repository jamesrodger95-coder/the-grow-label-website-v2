import type { Metadata } from 'next';
import Link from 'next/link';
import { studioAccent } from '@/components/studio/fonts';
import { ContactForm } from '@/components/studio/ContactForm';
import { StudioFooter, StudioHeader } from '@/components/studio/Sections';
import { STUDIO_CONTACT } from '@/content/studio';

/**
 * /contact: the studio's contact page. A short form whose messages are read
 * on the ops site. The clinic site's contact page is kept in
 * src/app/_archive/contact.
 */

export const metadata: Metadata = {
  title: { absolute: STUDIO_CONTACT.meta.title },
  description: STUDIO_CONTACT.meta.description,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className={`studio ${studioAccent.variable}`}>
      <StudioHeader />
      <section className="studio-sample studio-contact" id="top" aria-labelledby="contact-title">
        <div className="studio-shell studio-sample__grid">
          <div className="studio-sample__copy">
            <p className="studio-eyebrow">{STUDIO_CONTACT.eyebrow}</p>
            <h1 className="studio-display" id="contact-title">
              {STUDIO_CONTACT.title} <em>{STUDIO_CONTACT.emphasis}</em>
            </h1>
            <p className="studio-sample__lead">{STUDIO_CONTACT.lead}</p>
            <p className="studio-sample__lead">
              {STUDIO_CONTACT.sampleNote}{' '}
              <Link href={STUDIO_CONTACT.sampleLink.href}>{STUDIO_CONTACT.sampleLink.label}</Link>
            </p>
          </div>
          <div className="studio-sample__form">
            <ContactForm />
          </div>
        </div>
      </section>
      <StudioFooter />
    </div>
  );
}
