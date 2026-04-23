import type { Metadata } from 'next';
import { Playfair_Display, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ParticlesBackground } from '@/components/ParticlesBackground';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Daily Expanss — It\'s Okay to Not Be Okay',
  description:
    'A healing personal finance tracker. Track your expenses, savings, and find peace with your financial journey.',
  viewport: { width: 'device-width', initialScale: 1 },
  themeColor: '#0B0C10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <Providers>
          <ParticlesBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
