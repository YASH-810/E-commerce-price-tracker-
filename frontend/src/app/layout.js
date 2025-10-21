// import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "E-comerce Price Tracker",
  description: "Track and compare prices across platforms in real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
         <Toaster />
      </body>
    </html>
  );
}
