import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav/Nav'

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'lizzyp.',
  description: 'creative technologist. artist. writer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
