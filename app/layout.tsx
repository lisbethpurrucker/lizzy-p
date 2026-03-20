import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Nav from '@/components/Nav/Nav'

const departureMono = localFont({
  src: '../public/fonts/DepartureMono-Regular.woff2',
  variable: '--font-departure',
  display: 'swap',
})

const publiFluorRush = localFont({
  src: '../public/fonts/PubliFluorNormaleRush.woff',
  variable: '--font-fluor-rush',
  display: 'swap',
})

const publiFluorOuverte = localFont({
  src: '../public/fonts/PubliFluorNormaleOuverte.woff',
  variable: '--font-fluor-ouverte',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'lizzyp.',
  description: 'creative technologist. artist. writer.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${departureMono.variable} ${publiFluorRush.variable} ${publiFluorOuverte.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
