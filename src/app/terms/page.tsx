import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { LAST_UPDATED, TERMS } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'The status of the information published on this website, and why nothing here is an offer, a warranty or a performance guarantee.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="Terms"
      title="What this site is,"
      emphasis="and what it is not."
      lead="Everything published here describes designed behaviour and measurement definitions. No figure on this site is a client figure, and no result is guaranteed."
      sections={TERMS}
      lastUpdated={LAST_UPDATED}
      footnote="Company registration details and a registered address are added at launch. The substance of these terms does not depend on them."
    />
  );
}
