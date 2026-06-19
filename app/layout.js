import { Inter } from "next/font/google";
import { AppSidebar } from "@/src/widgets";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "IELTStation — Practice IELTS Online",
  description:
    "Free IELTS practice tests: Reading, Listening, Writing and Speaking with instant scoring.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <AppSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
