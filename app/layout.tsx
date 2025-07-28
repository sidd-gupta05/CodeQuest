import './globals.css';
import { clashFontSemiBold } from './fonts';


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
      <body className={`${clashFontSemiBold.className}`}>
        <header></header>
        {children}
        {/* <footer className="bg-gray-800 text-white p-4 text-center">
          <p className="container mx-auto px-4 text-center text-gray-600">
            Copyright 2023 Lab-Sphere
          </p>
        </footer> */}
      </body>
    </html>
  );
}
