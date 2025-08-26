//app/layout.tsx
import './globals.css';
import { clashFontRegular } from './fonts';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Lab-Sphere',
  description: 'A platform for collaborative for doctors and labs and patients',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${clashFontRegular.className}`}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
