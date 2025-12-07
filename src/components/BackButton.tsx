'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  children?: React.ReactNode
}

export default function BackButton({ href = '/', children = 'Ana Sayfaya Dön' }: BackButtonProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <Link 
        href={href} 
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{children}</span>
      </Link>
    </div>
  )
}