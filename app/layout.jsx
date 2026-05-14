import { Toaster } from 'react-hot-toast'

import { poppins, openSans, spaceMono } from '@/lib/fonts'
import StoreProvider from '@/store/StoreProvider'
import '@/styles/main.scss'

export const metadata = {
  title: 'Calling Demo',
  description: 'Calling Demo'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} ${openSans.variable} ${spaceMono.variable}`}>
        <Toaster position="top-center" />
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
