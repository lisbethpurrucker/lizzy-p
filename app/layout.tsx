import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono, Bungee, Caveat } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { client, isConfigured } from '@/sanity/lib/client'
import { getSiteSettingsQuery } from '@/sanity/lib/queries'

const FALLBACK_EMAIL = 'lisbethpurrucker@gmail.com'

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

const bungee = Bungee({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-hand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'lizzyp.',
  description: 'creative technologist. artist. writer.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let email = FALLBACK_EMAIL
  if (isConfigured) {
    try {
      const settings = await client.fetch(getSiteSettingsQuery)
      if (settings?.email) email = settings.email
    } catch { /* use fallback */ }
  }

  return (
    <html
      lang="en"
      className={`${departureMono.variable} ${publiFluorRush.variable} ${publiFluorOuverte.variable} ${jetbrainsMono.variable} ${bungee.variable} ${caveat.variable}`}
    >
      <body>
        <Nav />
        {children}
        <Footer email={email} />
      </body>
    </html>
  )
}
