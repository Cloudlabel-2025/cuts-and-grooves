import ComingSoon from '../components/ComingSoon';

export const metadata = {
  title: 'Cuts & Grooves — Coming Soon',
  description: 'Something exceptional is on its way. Cuts & Grooves — a luxury interior design studio launching soon.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ComingSoonPage() {
  return (
    <main>
      <ComingSoon />
    </main>
  );
}
