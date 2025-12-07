'use client'

import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import CartIcon from '@/components/CartIcon'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Hayaku
            </Link>
            <nav className="ml-10 flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-indigo-600">
                Products
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <CartIcon />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/orders" className="text-gray-700 hover:text-indigo-600">
                  Orders
                </Link>
                <Link href="/account" className="text-gray-700 hover:text-indigo-600">
                  Account
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600">
                  Login
                </Link>
                <Link 
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}