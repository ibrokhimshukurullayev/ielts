import { Inter } from "next/font/google";
import { AppSidebar, AuthGate, ThemeInit } from "@/src/widgets";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrepZone — Practice IELTS Online",
  description:
    "Free IELTS practice tests: Reading, Listening, Writing and Speaking with instant scoring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <ThemeInit />
        <Providers>
          <AuthGate>
            <div className="flex min-h-screen flex-col">
              <AppSidebar />
              <div className="min-w-0 flex-1 lg:pl-64">{children}</div>
            </div>
          </AuthGate>
        </Providers>
      </body>
    </html>
  );
}
