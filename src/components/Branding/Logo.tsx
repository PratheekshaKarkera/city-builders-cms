import React from 'react'
import Image from 'next/image'

export const Logo: React.FC = () => {
  return (
    <div className="logo">
      <Image
        src="/logo/logo-new.png"
        alt="City Builders Logo"
        width={200}
        height={60}
        style={{ width: '100%', height: 'auto', maxWidth: '200px' }}
      />
    </div>
  )
}
