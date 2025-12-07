'use client'

import { useState, useRef } from 'react'
import { Upload, X, Eye, Plus, Image as ImageIcon, MoreVertical, Trash2, Star } from 'lucide-react'
import Image from 'next/image'

interface PhotoFile {
  id: string
  file: File
  url: string
  alt_text?: string
  is_primary: boolean
  position: number
}

interface MultiPhotoUploadProps {
  onPhotosChange: (photos: PhotoFile[]) => void
  existingPhotos?: any[]
  maxPhotos?: number
}

export default function MultiPhotoUpload({ 
  onPhotosChange, 
  existingPhotos = [], 
  maxPhotos = 10 
}: MultiPhotoUploadProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    )

    if (photos.length + validFiles.length > maxPhotos) {
      alert(`En fazla ${maxPhotos} fotoğraf yükleyebilirsiniz`)
      return
    }

    const newPhotos: PhotoFile[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      alt_text: '',
      is_primary: photos.length === 0 && index === 0, // First photo is primary by default
      position: photos.length + index
    }))

    const updatedPhotos = [...photos, ...newPhotos]
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removePhoto = (id: string) => {
    const updatedPhotos = photos.filter(photo => {
      if (photo.id === id) {
        URL.revokeObjectURL(photo.url) // Clean up memory
        return false
      }
      return true
    })
    
    // If we removed the primary photo, make the first one primary
    if (updatedPhotos.length > 0 && !updatedPhotos.some(p => p.is_primary)) {
      updatedPhotos[0].is_primary = true
    }
    
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  const setPrimary = (id: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      is_primary: photo.id === id
    }))
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  const updateAltText = (id: string, altText: string) => {
    const updatedPhotos = photos.map(photo => 
      photo.id === id ? { ...photo, alt_text: altText } : photo
    )
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    const updatedPhotos = [...photos]
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1)
    updatedPhotos.splice(toIndex, 0, movedPhoto)
    
    // Update positions
    updatedPhotos.forEach((photo, index) => {
      photo.position = index
    })
    
    setPhotos(updatedPhotos)
    onPhotosChange(updatedPhotos)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-luxury-gold bg-luxury-gold/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Fotoğraf Yükle
        </h3>
        <p className="text-gray-600 mb-4">
          Fotoğrafları sürükleyip bırakın veya seçin
        </p>
        <p className="text-sm text-gray-500 mb-4">
          PNG, JPG, WebP (Maks. 5MB, {maxPhotos} adete kadar)
        </p>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-luxury-gold text-white px-6 py-2 rounded-lg hover:bg-luxury-gold/90 transition-colors"
        >
          Fotoğraf Seç
        </button>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">
              Yüklenen Fotoğraflar ({photos.length}/{maxPhotos})
            </h4>
            <p className="text-sm text-gray-500">
              Sıralamak için sürükleyin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group bg-white border rounded-lg overflow-hidden shadow-sm"
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                  reorderPhotos(fromIndex, index)
                }}
              >
                {/* Photo */}
                <div className="aspect-square relative">
                  <Image
                    src={photo.url}
                    alt={photo.alt_text || `Photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Primary Badge */}
                  {photo.is_primary && (
                    <div className="absolute top-2 left-2 bg-luxury-gold text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Ana
                    </div>
                  )}
                  
                  {/* Position Badge */}
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {index + 1}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      {!photo.is_primary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(photo.id)}
                          className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="Ana fotoğraf yap"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Alt Text Input */}
                <div className="p-3">
                  <input
                    type="text"
                    placeholder="Alt text (SEO için)"
                    value={photo.alt_text || ''}
                    onChange={(e) => updateAltText(photo.id, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-luxury-gold"
                  />
                </div>
              </div>
            ))}
            
            {/* Add More Button */}
            {photos.length < maxPhotos && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
              >
                <Plus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Ekle</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <h5 className="font-medium mb-2">💡 İpuçları:</h5>
        <ul className="space-y-1">
          <li>• İlk fotoğraf otomatik olarak ana fotoğraf olur</li>
          <li>• Fotoğrafları sürükleyerek sıralayabilirsiniz</li>
          <li>• Alt text SEO için önemlidir</li>
          <li>• Ana fotoğraf ürün kartlarında görünür</li>
        </ul>
      </div>
    </div>
  )
}