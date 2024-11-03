import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';
import { Footer, TopBar } from '@/components';

const aeonikPro = localFont({
  src: [
    {
      path: './fonts/AeonikPro-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    { path: './fonts/AeonikPro-Regular.woff2', weight: '400', style: 'normal' },
    {
      path: './fonts/AeonikPro-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/AeonikPro-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-aeonikpro',
});

// ts-unused-exports:disable-next-line
export const metadata: Metadata = {
  title: 'IDriss',
  description: 'IDriss',
};

// ts-unused-exports:disable-next-line
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aeonikPro.variable} font-sans antialiased`}>
        <TopBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
