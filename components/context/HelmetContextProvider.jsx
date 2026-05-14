'use client'

import { HelmetProvider } from 'react-helmet-async'

export default function HelmetContextProvider ({ children }) {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  )
}
