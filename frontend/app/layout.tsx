'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ELCA Blockbusters - AI Ministry Tools</title>
        <meta name="description" content="AI-powered ministry tools for ELCA congregations" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
