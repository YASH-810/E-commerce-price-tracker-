// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';

// Vercel-safe Google Font setup
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // avoids optimizeCss and lightningcss usage
});

export const metadata = {
  title: 'E-commerce Price Tracker',
  description: 'Track product prices and get alerts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
