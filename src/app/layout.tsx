import './globals.css';
import { LocalDiningOutlined } from '@mui/icons-material';
import { Divider, Typography } from '@mui/material';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import styles from './layout.module.css';
import AuthProvider from '../components/AuthProvider';
import Navigation from '../components/Navigation';
import ThemeRegistry from '../components/ThemeRegistry';
import { APPLICATION_NAME } from '../lib/constants';

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
              <div className={styles.footertitle}>
                <LocalDiningOutlined color="primary" />
                <Typography variant="h6" alignContent="center">
                  {APPLICATION_NAME}
                </Typography>
              </div>
              
              <Typography variant="caption">
                <Link href="#">
                  Privacy Policy
                </Link>
                {' | '}
                <Link href="#">
                  Terms of Service
                </Link>
              </Typography>

              <Divider className={styles.divider} />

              <Typography variant="body2">
                © {new Date().getFullYear()} All Rights Reserved jne.
              </Typography>
            </footer>
            
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
