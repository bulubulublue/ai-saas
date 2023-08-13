'use client'

import { useEffect } from 'react'
import { Crisp } from 'crisp-sdk-web'

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('f23ee5e0-8395-4552-a923-834ff0a7a2a2')
  }, [])

  return null
}
