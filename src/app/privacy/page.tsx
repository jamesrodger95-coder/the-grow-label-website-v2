import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { LAST_UPDATED, PRIVACY } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What this website collects, how an assessment request is handled, and why no client, patient or clinical data is held here.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Privacy"
      title="What this site collects,"
      emphasis="which is very little."
      lead="One form, no cookies, no analytics, no tracking. This notice covers the website only; a client engagement is governed by its own data-processing agreement."
      sections={PRIVACY}
      lastUpdated={LAST_UPDATED}
      footnote="Company registration details and a named data controller contact are added at launch. Until then this notice describes the site's behaviour, which is already accurate."
    />
  );
}
