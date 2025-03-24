import { ThemeProvider } from '@mui/material';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import theme from './styles/theme';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Laweyan Web Admin',
  description: 'Sistem Manajemen Konten Berbasis Web',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
      </ThemeProvider>
    </html>
  );
}

