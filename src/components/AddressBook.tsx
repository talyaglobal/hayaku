'use client'

import { useState, useEffect } from 'react'
import { MapPin, Plus, Edit2, Trash2, Check, X, Home, Building2, Loader2 } from 'lucide-react'
import { UserAddress } from '@/types'

export default function AddressBook() {
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Partial<UserAddress>>({
    title: '',
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'TR',
    is_default: false,
    is_billing_address: false
  })

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/addresses')
      const result = await response.json()
      
      if (response.ok) {
        setAddresses(result.data || [])
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        await loadAddresses()
        resetForm()
      } else {
        alert(result.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('An error occurred while saving the address')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address: UserAddress) => {
    setFormData({
      title: address.title,
      full_name: address.full_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default,
      is_billing_address: address.is_billing_address
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadAddresses()
      } else {
        const result = await response.json()
        alert(result.error || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('An error occurred while deleting the address')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      full_name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'TR',
      is_default: false,
      is_billing_address: false
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getTitleIcon = (title: string) => {
    if (title.toLowerCase().includes('ev') || title.toLowerCase().includes('home')) {
      return <Home className="h-5 w-5" />
    }
    if (title.toLowerCase().includes('iş') || title.toLowerCase().includes('work') || title.toLowerCase().includes('office')) {
      return <Building2 className="h-5 w-5" />
    }
    return <MapPin className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-luxury-gold" />
        <span className="ml-3 text-gray-600">Adresler yükleniyor...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-luxury-serif text-luxury-charcoal">Adreslerim</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Adres Ekle</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-luxury-charcoal">
              {editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Örn: Ev, İş, Diğer"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehir *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlçe *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres Satırı 1 *
              </label>
              <input
                type="text"
                required
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres Satırı 2 (Opsiyonel)
              </label>
              <input
                type="text"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ülke
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              >
                <option value="TR">Türkiye</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
              </select>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-luxury-gold rounded focus:ring-luxury-gold"
                />
                <span className="text-sm text-gray-700">Varsayılan adres olarak ayarla</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_billing_address}
                  onChange={(e) => setFormData({ ...formData, is_billing_address: e.target.checked })}
                  className="w-4 h-4 text-luxury-gold rounded focus:ring-luxury-gold"
                />
                <span className="text-sm text-gray-700">Fatura adresi</span>
              </label>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="px-6 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz adres eklenmemiş</h3>
          <p className="text-gray-600 mb-6">Siparişlerinizin daha hızlı teslim edilmesi için adres ekleyebilirsiniz.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-luxury-gold text-white rounded-lg hover:bg-luxury-gold/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>İlk Adresinizi Ekleyin</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white border rounded-lg p-6 ${
                address.is_default
                  ? 'border-luxury-gold border-2'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getTitleIcon(address.title)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{address.title}</h3>
                    {address.is_default && (
                      <span className="text-xs text-luxury-gold font-medium">Varsayılan</span>
                    )}
                    {address.is_billing_address && (
                      <span className="text-xs text-gray-500 ml-2">Fatura Adresi</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-luxury-gold transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{address.full_name}</p>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>
                  {address.postal_code} {address.city}/{address.state}
                </p>
                <p>{address.country}</p>
                <p className="mt-2">{address.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
