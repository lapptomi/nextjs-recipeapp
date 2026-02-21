import "./globals.css";
import { StyledEngineProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Inter } from "next/font/google";

import AuthProvider from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";
import ThemeRegistry from "@/components/ThemeRegistry";
import { APPLICATION_NAME } from "@/lib/constants";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APPLICATION_NAME,
  description: "Your favourite recipe app",
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} id="root">
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <AuthProvider>
              <ThemeRegistry>
                <div className="flex flex-col" style={{ height: "100dvh", overflow: "hidden" }}>
                  <Navigation />
                  <main className="flex-1 min-h-0 overflow-y-auto flex flex-col">{children}</main>
                </div>
              </ThemeRegistry>
            </AuthProvider>
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
