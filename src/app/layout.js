import "./globals.css";
import { Providers } from './providers';
import ClientLayout from './components/ClientLayout';

export const metadata = {
  title: 'Cuts & Grooves — Interior Design Studio',
  description: 'Luxury interior design studio crafting bespoke spaces with timeless elegance. Transform your space with our creative vision.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Prata&family=Belleza&family=Tenor+Sans&family=Syncopate:wght@400;700&family=Cinzel:wght@400..900&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500&family=Pinyon+Script&family=JetBrains+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
