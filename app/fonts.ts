import localFont from 'next/font/local';
import { Urbanist } from 'next/font/google';
import { Inter } from 'next/font/google';

export const interFont = Inter({ subsets: ['latin'], weight: '400' });

export const urbanistFontRegular = Urbanist({
  subsets: ['latin'],
  weight: '500',
});
export const urbanistFontBold = Urbanist({ subsets: ['latin'], weight: '800' });
export const urbanistFontLight = Urbanist({
  subsets: ['latin'],
  weight: '300',
});
// Add more weights as needed, e.g. '500', '600', etc.

export const clashFontSemiBold = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Semibold.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-semibold', // Optional: for CSS variable usage
});

export const clashFontRegular = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Regular.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-regular', // Optional: for CSS variable usage
});

export const clashFontBold = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Bold.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-bold', // Optional: for CSS variable usage
});

export const clashFontLight = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Light.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-light', // Optional: for CSS variable usage
});

export const clashFontExtralight = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Extralight.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-extralight', // Optional: for CSS variable usage
});

export const clashFontMedium = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Medium.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-medium', // Optional: for CSS variable usage
});

export const clashFontVariable = localFont({
  src: '../public/fonts/ClashDisplay/ClashDisplay-Variable.woff2', // Adjust path based on your file location
  display: 'swap', // Recommended for better performance
  variable: '--font-clash-variable', // Optional: for CSS variable usage
});
