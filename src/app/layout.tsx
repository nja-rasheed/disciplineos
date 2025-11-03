import type { Metadata } from 'next'
import '@/styles/globals.css' // <-- Make sure this import is here
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

// ... (your font setup)

// Your font setup
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DisciplineOS',
  description: 'All-in-one self-improvement app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`} // <-- Make sure classes are here
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}