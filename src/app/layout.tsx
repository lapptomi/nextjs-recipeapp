import './globals.css';
import { Typography } from '@mui/material';
import { Inter } from 'next/font/google';

import AuthProvider from '../components/AuthProvider';
import Navigation from '../components/Navigation';
import ThemeRegistry from '../components/ThemeRegistry';
import { APPLICATION_NAME } from '../config/constants';
import styles from '../styles/layout.module.css';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APPLICATION_NAME,
  description: 'Your facourite recipe app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeRegistry>
            <div>
              <Navigation />
            </div>
            <div className={styles.main}>
              {children}
            </div>
            <footer className={styles.footer}>
              <Typography color="white">Hello world</Typography>
            </footer>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
