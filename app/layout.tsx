import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WalletContextProvider } from './providers/WalletProvider'

export const metadata: Metadata = {
  title: 'AuraYield | Stake Your Health. Yield Your Wealth.',
  description: 'The first DeFi protocol where you stake crypto on your own health goals. AI verifies your wearable data. Succeed and earn yield.',
  keywords: ['DeFi', 'Health', 'Solana', 'Staking', 'Wellness', 'Wearables', 'Oura', 'Apple Watch', 'WHOOP'],
  authors: [{ name: 'AuraYield' }],
  openGraph: {
    title: 'AuraYield | Stake Your Health. Yield Your Wealth.',
    description: 'DeFi meets wellness on Solana. Stake crypto on your health goals, earn yield when you succeed.',
    url: 'https://aurayield.xyz',
    siteName: 'AuraYield',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AuraYield - Stake Your Health',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuraYield | Stake Your Health. Yield Your Wealth.',
    description: 'DeFi meets wellness on Solana. Stake crypto on your health goals, earn yield when you succeed.',
    site: '@AuraYield',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F59E0B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
}
