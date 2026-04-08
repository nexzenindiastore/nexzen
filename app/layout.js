import './globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext'

export const metadata = {
  title: 'Nexzen | Modern Electronics Storefront',
  description:
    'Nexzen is a modern electronics shopping experience for maker kits, development boards, sensors, and rapid prototyping gear.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe_0%,#f8fafc_25%,#f8fafc_100%)]">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
