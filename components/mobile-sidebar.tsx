'use client'

import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import Sidebar from './sidebar'
import { useEffect, useState } from 'react'

const MobileSidebar = ({ apiLimitCount }: { apiLimitCount: number }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0">
        <Sidebar apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar
