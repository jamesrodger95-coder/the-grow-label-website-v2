import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { LAST_UPDATED, PRIVACY } from '@/content/legal';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What this website and our sample pages collect, how a request is handled, and your rights.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Privacy"
      title="What this site collects,"
      emphasis="which is very little."
      lead="Only what you send us, plus whether a sample we made for you was opened. No advertising or analytics cookies."
      sections={PRIVACY}
      lastUpdated={LAST_UPDATED}
      footnote="The Grow Label is the data controller for this site. Questions about your data: use the contact page."
    />
  );
}
