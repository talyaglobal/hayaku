'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

interface Option {
  id: string
  name: string
}

interface MultiSelectProps {
  options: Option[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder: string
  className?: string
}

export default function MultiSelect({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder,
  className = "" 
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (optionId: string) => {
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId]
    
    onChange(newValues)
  }

  const removeSelected = (optionId: string) => {
    onChange(selectedValues.filter(id => id !== optionId))
  }

  const getSelectedNames = () => {
    return options
      .filter(option => selectedValues.includes(option.id))
      .map(option => option.name)
  }

  const selectedNames = getSelectedNames()

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Items Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] w-full p-2 border border-gray-300 rounded-md bg-white cursor-pointer flex flex-wrap items-center gap-1"
      >
        {selectedNames.length > 0 ? (
          selectedNames.map((name, index) => {
            const optionId = options.find(opt => opt.name === name)?.id
            return (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 text-xs bg-luxury-gold text-white rounded-full"
              >
                {name}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (optionId) removeSelected(optionId)
                  }}
                  className="ml-1 hover:bg-luxury-gold/80 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 ml-auto transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map(option => (
            <div
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className="text-gray-900">{option.name}</span>
              {selectedValues.includes(option.id) && (
                <Check className="h-4 w-4 text-luxury-gold" />
              )}
            </div>
          ))}
          
          {options.length === 0 && (
            <div className="px-3 py-2 text-gray-500 text-center">
              Seçenek bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  )
}