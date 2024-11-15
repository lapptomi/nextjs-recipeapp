import "./globals.css";

import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import ThemeRegistry from "@/components/ThemeRegistry";
import { APPLICATION_NAME } from "@/lib/constants";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: APPLICATION_NAME,
  description: "Your facourite recipe app",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="app">
        <AuthProvider>
          <ThemeRegistry>
            <Navigation />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
