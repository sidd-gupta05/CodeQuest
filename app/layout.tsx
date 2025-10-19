//app/layout.tsx
import './globals.css';
import { clashFontRegular } from './fonts';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
export const dynamic = 'force-dynamic';

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
      <body
        suppressHydrationWarning
        className={`${clashFontRegular.className}`}
      >
        {/* <SessionProvider> */}
        {children}
        <SpeedInsights />
        <Analytics />
        <Toaster position="top-right" />
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
