import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from './providers/i18n-provider';
import QueryProvider from './providers/query-provider';

export const metadata: Metadata = {
  title: '포켓몬 도감',
  description: '포켓몬 도감 애플리케이션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <I18nProvider>{children}</I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
