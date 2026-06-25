import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <div className="icon">
      <Image
        src="/logo/logo-new.png"
        alt="City Builders Icon"
        width={32}
        height={32}
      />
    </div>
  )
}
