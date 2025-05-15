import './globals.css'
import { Inter, Roboto_Mono } from 'next/font/google'
import Analytics from './components/Analytics'
import { Providers } from './components/Providers'
import { Navbar } from './components/Navbar'
import AudioPlayer from './components/AudioPlayer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' })

export const metadata = {
  title: 'AI Educational Game Platform',
  description: 'Interactive learning environment powered by AI',
  icons: {
    icon: '/my-favicon-32x32.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AudioPlayer />
              {children}
            </main>
            <footer className="bg-neutral text-neutral-content p-4">
              <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} AI Educational Game Platform. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}