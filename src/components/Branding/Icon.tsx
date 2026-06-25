import React from 'react'
import Image from 'next/image'

export const Icon: React.FC = () => {
  return (
    <div className="icon">
      <Image
        src="/logo/mcc-icon.png"
        alt="MCC Bank Icon"
        width={32}
        height={32}
      />
    </div>
  )
}
