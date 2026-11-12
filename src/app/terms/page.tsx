import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { LAST_UPDATED, TERMS } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'How this website and our free sample pages may be used, and why nothing here is an offer or a promise of results.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage
      label="Terms"
      title="What this site is,"
      emphasis="and what it is not."
      lead="Free samples carry no obligation, concept work is labelled as such, and no result is promised. Paid work is agreed in writing."
      sections={TERMS}
      lastUpdated={LAST_UPDATED}
      footnote="Questions about these terms: use the contact page."
    />
  );
}
