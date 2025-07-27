// app/layout.tsx
import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import type { Metadata } from 'next'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Vernetti Family Tree',
  description: 'Created with v0',
  generator: 'v0.dev',
  icons: {
    icon: '/Vernetti-Icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning>
        <div id="root">{children}</div>
        </body>

    </html>
  )
}
