import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/general/header';
import { Footer } from '@/components/general/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://brassworks.opnsoc.org'),
  title: {
    default: 'Create: Brassworks - SMP',
    template: '%s | Brassworks',
  },
  description:
      'Our public server thrives on cooperation between players - express your creativity freely, with each other.',
  openGraph: {
    title: 'Create: Brassworks - SMP',
    description:
        'Our public server thrives on cooperation between players - express your creativity freely, with each other.',
    url: 'https://brassworks.opnsoc.org/',
    siteName: 'Brassworks',
    images: [
      {
        url: '/images/icon.png',
        width: 512,
        height: 512,
        alt: 'Brassworks Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create: Brassworks - SMP',
    description:
        'Our public server thrives on cooperation between players - express your creativity freely, with each other.',
    images: ['/images/icon.png'],
  },
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </ThemeProvider>
      </body>
      </html>
  );
}