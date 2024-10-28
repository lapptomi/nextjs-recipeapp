import './globals.css';
import { Facebook, Instagram, LinkedIn } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Inter } from 'next/font/google';

import AuthProvider from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
import ThemeRegistry from '@/components/ThemeRegistry';
import { APPLICATION_NAME } from '@/lib/constants';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: APPLICATION_NAME,
  description: 'Your facourite recipe app',
};

export default function RootLayout({ children }: {
  readonly children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeRegistry>
            <div>
              <Navigation />
            </div>
            <div className='min-h-screen'>
              {children}
            </div>

            <footer className='flex h-96 flex-col justify-between bg-white p-24'>
              <div className='flex w-full justify-evenly gap-5'>
                <div className='flex flex-col gap-2'>
                  <Typography variant="h4" fontWeight="medium">
                    {APPLICATION_NAME}
                  </Typography>
                  <Typography variant="body2">
                    Your favourite recipe app
                  </Typography>
                  <div>
                    <Instagram />
                    <Facebook />
                    <LinkedIn />
                  </div>
                </div>

                <div>
                  <Typography variant="body1" fontWeight="medium">
                    Some title
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                </div>
                <div>
                  <Typography variant="body1" fontWeight="medium">
                    Some title
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Some field
                  </Typography>
                </div>
              </div>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} All Rights Reserved jne.
              </Typography>
            </footer>

          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
