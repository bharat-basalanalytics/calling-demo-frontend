// eslint-disable-next-line camelcase
import { Poppins, Open_Sans, Space_Mono } from 'next/font/google'

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--poppins-font'
})

const openSans = Open_Sans({
  weight: 'variable',
  style: ['italic', 'normal'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--open-sans-font'
})

const spaceMono = Space_Mono({
  weight: ['400'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--space-mono-font'
})

export { poppins, openSans, spaceMono }
