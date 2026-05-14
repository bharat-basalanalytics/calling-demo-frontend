import Navbar from '@/components/global/Navbar'

export default function ProtectedLayout ({ children }) {
  return (
    <>
      <Navbar />
      <div className='main'>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}
