'use client'

import { useState, useEffect } from 'react'
import { 
  Hash, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'
import { 
  getHashtags, 
  createHashtag, 
  updateHashtag, 
  deleteHashtag,
  generateHashtagSlug,
  checkHashtagSlugExists,
  type Hashtag 
} from '@/lib/hashtags'

export default function HashtagManager() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHashtag, setEditingHashtag] = useState<Hashtag | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    is_active: true
  })

  useEffect(() => {
    loadHashtags()
  }, [showInactive])

  const loadHashtags = async () => {
    try {
      setLoading(true)
      const data = await getHashtags(!showInactive)
      setHashtags(data)
    } catch (error) {
      console.error('Error loading hashtags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddHashtag = async () => {
    try {
      if (!formData.name.trim()) {
        alert('Hashtag ismi gerekli')
        return
      }

      const slug = generateHashtagSlug(formData.name)
      const slugExists = await checkHashtagSlugExists(slug)
      
      if (slugExists) {
        alert('Bu hashtag zaten mevcut')
        return
      }

      await createHashtag({
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        color: formData.color,
        is_active: formData.is_active
      })

      setFormData({ name: '', description: '', color: '#3B82F6', is_active: true })
      setShowAddForm(false)
      await loadHashtags()
      alert('Hashtag başarıyla eklendi!')
    } catch (error) {
      console.error('Error creating hashtag:', error)
      alert('Hashtag eklenirken hata oluştu')
    }
  }

  const handleEditHashtag = async () => {
    try {
      if (!editingHashtag || !formData.name.trim()) return

      const slug = generateHashtagSlug(formData.name)
      const slugExists = await checkHashtagSlugExists(slug, editingHashtag.id)
      
      if (slugExists) {
        alert('Bu hashtag zaten mevcut')
        return
      }

      await updateHashtag(editingHashtag.id, {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        color: formData.color,
        is_active: formData.is_active
      })

      setEditingHashtag(null)
      setFormData({ name: '', description: '', color: '#3B82F6', is_active: true })
      await loadHashtags()
      alert('Hashtag başarıyla güncellendi!')
    } catch (error) {
      console.error('Error updating hashtag:', error)
      alert('Hashtag güncellenirken hata oluştu')
    }
  }

  const handleDeleteHashtag = async (id: string, name: string) => {
    if (!confirm(`"${name}" hashtag'ini silmek istediğinizden emin misiniz?`)) return

    try {
      await deleteHashtag(id)
      await loadHashtags()
      alert('Hashtag başarıyla silindi!')
    } catch (error) {
      console.error('Error deleting hashtag:', error)
      alert('Hashtag silinirken hata oluştu')
    }
  }

  const startEditing = (hashtag: Hashtag) => {
    setEditingHashtag(hashtag)
    setFormData({
      name: hashtag.name,
      description: hashtag.description || '',
      color: hashtag.color,
      is_active: hashtag.is_active
    })
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    setEditingHashtag(null)
    setShowAddForm(false)
    setFormData({ name: '', description: '', color: '#3B82F6', is_active: true })
  }

  const filteredHashtags = hashtags.filter(hashtag =>
    hashtag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hashtag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Hash className="h-6 w-6 text-luxury-gold" />
          <h2 className="text-2xl font-bold text-gray-900">Hashtag Yönetimi</h2>
          <span className="px-2 py-1 bg-luxury-gold/10 text-luxury-gold text-sm font-medium rounded-full">
            {hashtags.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              showInactive 
                ? 'bg-gray-100 text-gray-700 border-gray-300' 
                : 'text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {showInactive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{showInactive ? 'Pasif Gizle' : 'Pasif Göster'}</span>
          </button>
          
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingHashtag(null)
              setFormData({ name: '', description: '', color: '#3B82F6', is_active: true })
            }}
            className="flex items-center space-x-2 bg-luxury-gold text-white px-4 py-2 rounded-lg hover:bg-luxury-gold/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Hashtag Ekle</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Hashtag ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
        />
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingHashtag) && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingHashtag ? 'Hashtag Düzenle' : 'Yeni Hashtag Ekle'}
            </h3>
            <button onClick={cancelEditing} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hashtag İsmi *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="örn: yeni-koleksiyon"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renk
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Hashtag açıklaması..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-luxury-gold focus:ring-luxury-gold"
                />
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              onClick={editingHashtag ? handleEditHashtag : handleAddHashtag}
              className="flex items-center space-x-2 bg-luxury-gold text-white px-4 py-2 rounded-lg hover:bg-luxury-gold/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{editingHashtag ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Hashtags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHashtags.map((hashtag) => (
          <div
            key={hashtag.id}
            className={`bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
              !hashtag.is_active ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: hashtag.color }}
                />
                <span className="font-medium text-gray-900">#{hashtag.name}</span>
                {!hashtag.is_active && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Pasif
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => startEditing(hashtag)}
                  className="p-1 text-gray-400 hover:text-luxury-gold transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteHashtag(hashtag.id, hashtag.name)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {hashtag.description && (
              <p className="text-sm text-gray-600 mb-2">{hashtag.description}</p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{hashtag.usage_count} üründe kullanılıyor</span>
              <span>#{hashtag.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredHashtags.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Hash className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>
            {searchTerm ? 'Arama kriterine uygun hashtag bulunamadı.' : 'Henüz hashtag eklenmemiş.'}
          </p>
        </div>
      )}
    </div>
  )
}