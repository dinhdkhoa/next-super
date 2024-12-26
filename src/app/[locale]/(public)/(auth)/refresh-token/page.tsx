import { Metadata } from 'next'
import { Suspense } from 'react'
import RefreshTokenComponent from './refresh-token'

export const metadata: Metadata = {
  title: "Refesh Token",
  description: "Refersh Token",
  robots : {
    index: false
  }
}

export default function RefreshToken() {
  return (
    <Suspense>
      <RefreshTokenComponent />
    </Suspense>
  )
}

