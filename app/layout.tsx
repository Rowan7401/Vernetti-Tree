import '/vernetti-tree.css'; 
import '/globals.css';
import getConfig from 'next/config';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vernetti Family Tree',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/Vernetti-Icon.png',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}