'use client'

import { useState, useEffect } from 'react'
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Crown,
  Award,
  Star,
  Percent,
  Send,
  Facebook,
  MessageCircle,
  Instagram,
  Archive,
  LogOut,
  Hash
} from 'lucide-react'
import { getProducts, getBrands } from '@/lib/products'
import ImportExportButtons from '@/components/ImportExportButtons'
import HashtagManager from '@/components/admin/HashtagManager'
import MultiPhotoUpload from '@/components/admin/MultiPhotoUpload'
import CategoryTreeNode from '@/components/admin/CategoryTreeNode'

interface NewProduct {
  id: string
  name: string
  brand: string
  brandId: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  description: string
  images: string[]
  sizes: string[]
  colors: string[]
  materials: string[]
  inStock: boolean
  isLimitedEdition: boolean
  isNew: boolean
  craftedIn: string
  gender: string
  sizeType: string
}

// Stock ID Generator Function
const generateStockId = (brand: string, size: string, color: string) => {
  const brandCode = brand.toUpperCase().replace(/\s+/g, '-')
  const sizeCode = size.toUpperCase()
  const colorCode = color.toUpperCase().replace(/\s+/g, '-')
  
  // Generate sequential number (5 digits)
  const sequentialNumber = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')
  
  return `LZI-${sequentialNumber}-${brandCode}-${sizeCode}-${colorCode}`
}

// Stock ID Parser Function
const parseStockId = (stockId: string) => {
  const parts = stockId.split('-')
  if (parts.length >= 5 && parts[0] === 'LZI') {
    return {
      prefix: parts[0],
      number: parts[1],
      brand: parts.slice(2, -2).join('-'),
      size: parts[parts.length - 2],
      color: parts[parts.length - 1]
    }
  }
  return null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<NewProduct | null>(null)
  const [productsList, setProductsList] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('')
  const [showViewProduct, setShowViewProduct] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<any>(null)
  const [productPhotos, setProductPhotos] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    loadData()
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders()
    } else if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'stock') {
      loadInventory()
    } else if (activeTab === 'dashboard') {
      loadDashboardData()
    }
  }, [activeTab])

  const loadData = async () => {
    try {
      const [productsData, brandsData, categoriesResponse] = await Promise.all([
        getProducts({ limit: 100 }),
        getBrands(true),
        fetch('/api/categories').then(res => res.json())
      ])
      
      // Transform products data to match admin dashboard structure
      const transformedProducts = productsData.map((product: any) => {
        // Handle brand - ensure it's always a string
        let brandName = 'Bilinmiyor'
        if (product.brands && typeof product.brands === 'object') {
          brandName = product.brands.name || 'Bilinmiyor'
        } else if (product.brand && typeof product.brand === 'string') {
          brandName = product.brand
        }

        // Handle category - ensure it's always a string  
        let categoryName = 'Kategori Yok'
        if (product.categories && typeof product.categories === 'object') {
          categoryName = product.categories.name || 'Kategori Yok'
        } else if (product.category && typeof product.category === 'string') {
          categoryName = product.category
        }

        return {
          ...product,
          brand: brandName,
          brandId: product.brand_id || product.brandId || '',
          category: categoryName,
          inStock: product.is_active !== undefined ? product.is_active : (product.inStock || false),
          isNew: product.is_featured !== undefined ? product.is_featured : (product.isNew || false),
          images: product.product_images?.map((img: any) => img.url) || product.images || [],
        }
      })
      
      console.log('Admin Dashboard - Loaded products:', transformedProducts.length)
      console.log('Admin Dashboard - Sample product:', transformedProducts[0])
      
      setProductsList(transformedProducts)
      setBrands(brandsData)
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }
  
  const [newProduct, setNewProduct] = useState<NewProduct>({
    id: '',
    name: '',
    brand: '',
    brandId: '',
    price: 0,
    category: '',
    subcategory: '',
    description: '',
    images: [''],
    sizes: [],
    colors: [],
    materials: [],
    inStock: true,
    isLimitedEdition: false,
    isNew: true,
    craftedIn: '',
    gender: 'unisex',
    sizeType: 'clothing'
  })

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoadingData(true)
      const [statsResponse, analyticsResponse, ordersResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/analytics?period=30'),
        fetch('/api/admin/orders?limit=10')
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats({
          totalOrders: statsData.data?.orders?.total || 0,
          totalProducts: statsData.data?.products?.total || 0,
          totalUsers: statsData.data?.users?.total || 0,
          totalRevenue: statsData.data?.users?.totalRevenue || 0,
          todayOrders: statsData.data?.orders?.today || 0,
          todayRevenue: statsData.data?.revenue?.today || 0
        })
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.data)
      }

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        const recentOrdersData = (ordersData.data || []).map((order: any) => ({
          id: order.order_number || order.id,
          customer: order.user_profiles?.full_name || order.email || 'Misafir',
          amount: parseFloat(order.total_amount) || 0,
          status: order.status === 'delivered' ? 'Tamamlandı' : 
                  order.status === 'shipped' ? 'Kargo' : 
                  order.status === 'processing' ? 'İşleniyor' : 'Beklemede',
          date: new Date(order.created_at).toLocaleDateString('tr-TR')
        }))
        setRecentOrders(recentOrdersData)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Load orders
  const loadOrders = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch('/api/admin/orders?limit=100')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Load users
  const loadUsers = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch('/api/admin/users?limit=100')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Load inventory
  const loadInventory = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setInventory(data.data || [])
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadLowStockAlerts = async () => {
    try {
      const response = await fetch('/api/inventory/alerts')
      if (response.ok) {
        const data = await response.json()
        return data.data || []
      }
    } catch (error) {
      console.error('Error loading low stock alerts:', error)
    }
    return []
  }

  const updateInventory = async (productId: string, updates: any) => {
    try {
      const response = await fetch(`/api/inventory/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (response.ok) {
        await loadInventory()
        return true
      }
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
    return false
  }

  const syncStock = async (source: string, updates: any[]) => {
    try {
      const response = await fetch('/api/inventory/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, updates })
      })
      if (response.ok) {
        await loadInventory()
        return true
      }
    } catch (error) {
      console.error('Error syncing stock:', error)
    }
    return false
  }


  // MEN VIP CLUB Loyalty System Data
  const [vipMembers, setVipMembers] = useState([
    {
      id: 'VIP001',
      name: 'Emre Kızıltan',
      email: 'emre@example.com',
      phone: '+90 532 123 45 67',
      tier: 'Diamond',
      points: 15420,
      totalSpent: 45600,
      dealerType: 'Premium Dealer',
      region: 'İstanbul',
      joinDate: '2024-03-15',
      lastPurchase: '2025-01-20',
      discount: 12,
      status: 'Active'
    },
    {
      id: 'VIP002', 
      name: 'Serkan Özdemir',
      email: 'serkan@example.com',
      phone: '+90 535 987 65 43',
      tier: 'Platinum',
      points: 8940,
      totalSpent: 28400,
      dealerType: 'Regional Dealer',
      region: 'Ankara',
      joinDate: '2024-07-22',
      lastPurchase: '2025-01-18',
      discount: 8,
      status: 'Active'
    },
    {
      id: 'VIP003',
      name: 'Burak Yaman', 
      email: 'burak@example.com',
      phone: '+90 538 456 78 90',
      tier: 'Gold',
      points: 4560,
      totalSpent: 15200,
      dealerType: 'Local Dealer',
      region: 'İzmir',
      joinDate: '2024-11-10',
      lastPurchase: '2025-01-15',
      discount: 5,
      status: 'Active'
    }
  ])

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Bronze',
    dealerType: 'Local Dealer', 
    region: '',
    discount: 5
  })

  // New Campaign State
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
    image: '',
    category: '',
    active: true
  })

  // New Social Post State
  const [newSocialPost, setNewSocialPost] = useState({
    content: '',
    platform: 'Instagram',
    image: '',
    hashtags: '',
    scheduledDate: ''
  })

  // Campaign Management Data
  const [campaigns, setCampaigns] = useState([
    {
      id: 'winter2025',
      title: 'Kış Koleksiyonu İndirimi',
      description: 'Kış ürünlerinde %40\'a varan indirim fırsatı',
      discount: '40%',
      validUntil: '2025-02-28',
      image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
      category: 'outerwear',
      active: true
    },
    {
      id: 'luxury2025', 
      title: 'Luxury Brands Special',
      description: 'Premium markalarda özel fiyat avantajı',
      discount: '25%',
      validUntil: '2025-02-15',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      category: 'luxury',
      active: true
    },
    {
      id: 'spring2025',
      title: 'Bahar Hazırlığı',
      description: 'Yeni sezon ürünlerinde erken rezervasyon indirimi',
      discount: '15%',
      validUntil: '2025-03-31',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      category: 'clothing',
      active: true
    }
  ])

  // Social Media Integration
  const [socialPosts, setSocialPosts] = useState([
    {
      id: 'post1',
      title: 'Kış Koleksiyonu Lansmanı',
      content: 'Yeni kış koleksiyonumuz artık mağazalarımızda! Premium markalardan özel seçimler sizi bekliyor.',
      platform: 'facebook',
      image: 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
      scheduledDate: '2025-01-27',
      status: 'published',
      engagement: 1250
    },
    {
      id: 'post2',
      title: 'Burberry Trench Coat',
      content: 'Timeless elegance with Burberry Heritage Trench Coat. Now available at Hayaku.',
      platform: 'instagram',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      scheduledDate: '2025-01-26',
      status: 'published',
      engagement: 3420
    },
    {
      id: 'post3',
      title: 'VIP Üyelere Özel',
      content: 'VIP Club üyelerimize özel %30 indirim fırsatı! Detaylar için mağazamızı ziyaret edin.',
      platform: 'whatsapp',
      image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg',
      scheduledDate: '2025-01-25',
      status: 'scheduled',
      engagement: 0
    }
  ])

  const [showAddCampaign, setShowAddCampaign] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)

  // User Management Data
  const [users, setUsers] = useState([
    {
      id: 'user001',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 532 123 45 67',
      type: 'Gold',
      status: 'Active',
      joinDate: '2024-01-15',
      lastLogin: '2025-01-26',
      totalOrders: 12,
      totalSpent: 8750,
      city: 'İstanbul',
      birthDate: '1985-06-15'
    },
    {
      id: 'user002', 
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 533 987 65 43',
      type: 'Diamond',
      status: 'Active',
      joinDate: '2023-08-20',
      lastLogin: '2025-01-27',
      totalOrders: 28,
      totalSpent: 24500,
      city: 'Ankara',
      birthDate: '1990-03-22'
    },
    {
      id: 'user003',
      name: 'Ali Demir',
      email: 'ali@example.com', 
      phone: '+90 534 456 78 90',
      type: 'Platinum',
      status: 'Active',
      joinDate: '2024-03-10',
      lastLogin: '2025-01-25',
      totalOrders: 8,
      totalSpent: 5200,
      city: 'İzmir',
      birthDate: '1988-11-05'
    },
    {
      id: 'user004',
      name: 'Fatih Özkan',
      email: 'fatih@example.com',
      phone: '+90 535 321 09 87',
      type: 'Gold',
      status: 'Inactive',
      joinDate: '2024-06-25',
      lastLogin: '2024-12-15',
      totalOrders: 3,
      totalSpent: 1850,
      city: 'Bursa',
      birthDate: '1992-09-18'
    },
    {
      id: 'user005',
      name: 'Emre Kızıltan',
      email: 'emre@example.com',
      phone: '+90 536 654 32 10',
      type: 'Diamond',
      status: 'Active',
      joinDate: '2023-05-12',
      lastLogin: '2025-01-27',
      totalOrders: 45,
      totalSpent: 67800,
      city: 'İstanbul',
      birthDate: '1987-12-03'
    }
  ])

  // Category mapping from ID to Turkish name
  const categoryMapping: { [key: string]: string } = {
    'clothing': 'Giyim',
    'footwear': 'Ayakkabı',
    'outerwear': 'Dış Giyim',
    'accessories': 'Aksesuar',
    'home-textiles': 'Ev Tekstili'
  }

  // Filtered products for display
  const filteredProducts = productsList.filter(product => {
    const brandMatch = !selectedBrandFilter || product.brandId === selectedBrandFilter
    const categoryMatch = !selectedCategoryFilter || product.category === categoryMapping[selectedCategoryFilter]
    return brandMatch && categoryMatch
  })

  // Get unique categories from products
  const productCategories = [
    { id: 'clothing', name: 'Giyim' },
    { id: 'footwear', name: 'Ayakkabı' },
    { id: 'outerwear', name: 'Dış Giyim' },
    { id: 'accessories', name: 'Aksesuar' },
    { id: 'home-textiles', name: 'Ev Tekstili' }
  ]

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.price) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    try {
      // Find brand and category IDs
      const brand = brands.find(b => b.name === newProduct.brand || b.id === newProduct.brandId)
      if (!brand) {
        alert('Geçerli bir marka seçin')
        return
      }

      // Create slug from product name
      const slug = newProduct.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      // Find category ID
      const category = categories.find(c => c.id === newProduct.category || c.slug === newProduct.category)
      if (!category) {
        alert('Geçerli bir kategori seçin')
        return
      }

      // Prepare product data for API
      const productData = {
        name: newProduct.name,
        slug: slug,
        description: newProduct.description,
        brand_id: brand.id,
        category_id: category.id,
        sku: `SKU-${Date.now()}`,
        price: newProduct.price,
        compare_price: newProduct.originalPrice,
        currency: 'TRY',
        is_featured: newProduct.isLimitedEdition,
        is_active: newProduct.inStock,
        tags: [...newProduct.sizes, ...newProduct.colors, ...newProduct.materials]
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      const result = await response.json()
      
      // Add to local state for immediate UI update
      const product = {
        ...newProduct,
        id: result.data.id,
        images: newProduct.images.filter(img => img.trim() !== ''),
      }

      setProductsList([...productsList, product])
      
      // Reset form
      setNewProduct({
        id: '',
        name: '',
        brand: '',
        brandId: '',
        price: 0,
        category: '',
        subcategory: '',
        description: '',
        images: [''],
        sizes: [],
        colors: [],
        materials: [],
        inStock: true,
        isLimitedEdition: false,
        isNew: true,
        craftedIn: '',
        gender: 'unisex',
        sizeType: 'clothing'
      })
      
      setShowAddProduct(false)
      alert('Ürün başarıyla eklendi!')
      
      // Reload data to get fresh data from database
      loadData()
      
    } catch (error) {
      console.error('Product creation error:', error)
      alert('Ürün eklenirken hata oluştu: ' + error.message)
    }
  }

  const handleViewProduct = (product: any) => {
    setViewingProduct(product)
    setShowViewProduct(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      gender: product.gender || 'unisex',
      sizeType: product.sizeType || 'clothing'
    })
    setShowEditProduct(true)
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProduct.name,
          slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, '-'),
          description: editingProduct.description,
          short_description: editingProduct.description?.substring(0, 200),
          brand_id: editingProduct.brandId,
          category_id: editingProduct.categoryId,
          price: editingProduct.price,
          compare_price: editingProduct.originalPrice,
          is_featured: editingProduct.isNew,
          is_active: editingProduct.inStock,
          tags: editingProduct.tags || []
        })
      })

      if (!response.ok) {
        throw new Error('Ürün güncellenemedi')
      }

      const { data } = await response.json()
      
      // Reload products
      await loadData()
      
      setShowEditProduct(false)
      setEditingProduct(null)
      alert('Ürün başarıyla güncellendi!')
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'Ürün güncellenemedi'))
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz? Ürün pasif hale getirilecektir.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Ürün silinemedi')
      }

      // Reload products
      await loadData()
      
      alert('Ürün başarıyla silindi!')
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'Ürün silinemedi'))
    }
  }

  const handleEditOrder = async (order: any) => {
    const newStatus = prompt(`Sipariş durumunu güncelle:\n(pending, confirmed, processing, shipped, delivered, cancelled)`, order.status)
    if (!newStatus) return

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Sipariş güncellenemedi')
      }

      await loadOrders()
      alert('Sipariş başarıyla güncellendi!')
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'Sipariş güncellenemedi'))
    }
  }

  const handleEditUser = async (user: any) => {
    const newVipTier = prompt(`VIP seviyesini güncelle:\n(Bronze, Gold, Platinum, Diamond)`, user.vip_tier || 'Bronze')
    if (!newVipTier) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vip_tier: newVipTier
        })
      })

      if (!response.ok) {
        throw new Error('Kullanıcı güncellenemedi')
      }

      await loadUsers()
      alert('Kullanıcı başarıyla güncellendi!')
    } catch (error: any) {
      alert('Hata: ' + (error.message || 'Kullanıcı güncellenemedi'))
    }
  }

  const handleImportProducts = (importedData: any[]) => {
    const newProducts = importedData.map(data => ({
      ...data,
      id: data.id || `imported-${Date.now()}-${Math.random()}`,
      price: parseInt(data.price) || 0,
      originalPrice: data.originalPrice ? parseInt(data.originalPrice) : undefined,
      images: typeof data.images === 'string' ? data.images.split(',') : data.images || [''],
      sizes: typeof data.sizes === 'string' ? data.sizes.split(',') : data.sizes || [],
      colors: typeof data.colors === 'string' ? data.colors.split(',') : data.colors || [],
      materials: typeof data.materials === 'string' ? data.materials.split(',') : data.materials || [],
      inStock: data.inStock === 'true' || data.inStock === true,
      isLimitedEdition: data.isLimitedEdition === 'true' || data.isLimitedEdition === true,
      isNew: data.isNew === 'true' || data.isNew === true,
    }))
    
    setProductsList([...productsList, ...newProducts])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Hayaku Admin</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin User</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <button
                onClick={async () => {
                  try {
                    const { signOut } = await import('@/lib/auth')
                    await signOut()
                    window.location.href = '/admin/login'
                  } catch (error) {
                    console.error('Logout error:', error)
                    window.location.href = '/admin/login'
                  }
                }}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'dashboard' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'products' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Ürünler</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('brands')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'brands' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Crown className="h-5 w-5" />
                  <span>Markalar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Siparişler</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'categories' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Archive className="h-5 w-5" />
                  <span>Kategori Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('stock')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'stock' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Archive className="h-5 w-5" />
                  <span>Stok Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sizes')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'sizes' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Beden Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'colors' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Star className="h-5 w-5" />
                  <span>Renk Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'materials' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Award className="h-5 w-5" />
                  <span>Malzeme Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'users' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Kullanıcılar</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('loyalty')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'loyalty' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Crown className="h-5 w-5" />
                  <span>MEN VIP CLUB</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'campaigns' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Percent className="h-5 w-5" />
                  <span>Kampanya Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('social')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'social' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Send className="h-5 w-5" />
                  <span>Sosyal Medya</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('hashtags')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'hashtags' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Hash className="h-5 w-5" />
                  <span>Hashtag Yönetimi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'integrations' 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Archive className="h-5 w-5" />
                  <span>İntegrasyonlar</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <ImportExportButtons
                  data={recentOrders}
                  filename="dashboard_orders"
                  entityName="sipariş"
                />
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Sipariş</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                      <p className="text-sm text-green-600">+{stats.todayOrders} bugün</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Ürün</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                      <p className="text-sm text-gray-500">aktif</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      <p className="text-sm text-gray-500">kayıtlı</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('tr-TR')} TL</p>
                      <p className="text-sm text-green-600">+{stats.todayRevenue.toLocaleString('tr-TR')} TL bugün</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Sipariş ID</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Müşteri</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Tutar</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Durum</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">Tarih</th>
                          <th className="text-left py-2 text-sm font-medium text-gray-600">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id} className="border-b border-gray-100">
                            <td className="py-3 text-sm font-medium">#{order.id}</td>
                            <td className="py-3 text-sm text-gray-900">{order.customer}</td>
                            <td className="py-3 text-sm text-gray-900">{order.amount.toLocaleString('tr-TR')}₺</td>
                            <td className="py-3">
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                                order.status === 'Kargo' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-600">{order.date}</td>
                            <td className="py-3">
                              <button className="text-green-600 hover:text-green-800">
                                <Eye className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h2>
                <div className="flex items-center space-x-4">
                  <ImportExportButtons
                    data={productsList}
                    filename="products"
                    onImport={handleImportProducts}
                    entityName="ürün"
                  />
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Ürün</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Ürün ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  {/* Filter Badges */}
                  <div className="space-y-4">
                    {/* Brand Filter Badges */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Markalar</h3>
                      <div className="flex flex-wrap gap-2">
                        {brands.map((brand: any) => (
                          <button
                            key={brand.id}
                            onClick={() => setSelectedBrandFilter(selectedBrandFilter === brand.id ? '' : brand.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedBrandFilter === brand.id
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {brand.name}
                          </button>
                        ))}
                        {selectedBrandFilter && (
                          <button
                            onClick={() => setSelectedBrandFilter('')}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            ✕ Temizle
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Category Filter Badges */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Kategoriler</h3>
                      <div className="flex flex-wrap gap-2">
                        {productCategories.map((category: any) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategoryFilter(selectedCategoryFilter === category.id ? '' : category.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              selectedCategoryFilter === category.id
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                        {selectedCategoryFilter && (
                          <button
                            onClick={() => setSelectedCategoryFilter('')}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            ✕ Temizle
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Active Filters Summary */}
                    {(selectedBrandFilter || selectedCategoryFilter) && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Aktif filtreler:</span>
                          <span className="font-medium">
                            {filteredProducts.length} ürün gösteriliyor
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedBrandFilter('')
                            setSelectedCategoryFilter('')
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Tüm filtreleri temizle
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Ürün</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Marka</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Kategori</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Fiyat</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Stok</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product: any) => (
                        <tr key={product.id} className="border-b border-gray-100">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.className = 'w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center';
                                        parent.innerHTML = '<span class="text-gray-500 text-xs">Resim Yok</span>';
                                      }
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">Resim Yok</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">ID: {product.id?.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-900">{product.brand}</td>
                          <td className="p-4 text-sm text-gray-900">{product.category}</td>
                          <td className="p-4 text-sm text-gray-900">{product.price.toLocaleString('tr-TR')}₺</td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'Stokta' : 'Tükendi'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleViewProduct(product)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Görüntüle"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="text-green-600 hover:text-green-800"
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h2>
                <ImportExportButtons
                  data={orders}
                  filename="orders"
                  entityName="sipariş"
                />
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bugünkü Siparişler</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bekleyen Siparişler</p>
                      <p className="text-2xl font-bold text-gray-900">{orders.filter((o: any) => o.status === 'pending').length}</p>
                    </div>
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Bugünkü Ciro</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.todayRevenue.toLocaleString('tr-TR')} TL</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </div>

              {/* Order Status Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-600 mr-2">Durum:</span>
                  {['Tümü', 'Beklemede', 'Kargo', 'Tamamlandı'].map(status => (
                    <button
                      key={status}
                      className="px-4 py-2 text-sm rounded-full border transition-colors bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    >
                      {status} ({status === 'Tümü' ? orders.length : orders.filter((o: any) => {
                        const statusMap: any = {
                          'Beklemede': 'pending',
                          'Kargo': 'shipped',
                          'Tamamlandı': 'delivered'
                        }
                        return o.status === statusMap[status]
                      }).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Sipariş ara..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {isLoadingData ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                  ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürünler</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                                <div className="text-sm text-gray-500">Müşteri</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.amount.toLocaleString('tr-TR')} TL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                              order.status === 'Kargo' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Beklemede' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Önceki
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Sonraki
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">1</span> - <span className="font-medium">{recentOrders.length}</span> arası, toplam <span className="font-medium">{recentOrders.length}</span> sonuç
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Önceki
                        </button>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600">
                          1
                        </button>
                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Sonraki
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h2>
                <div className="flex space-x-3">
                  <ImportExportButtons
                    data={categories}
                    filename="categories_export"
                    entityName="kategori"
                  />
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    onClick={() => setActiveTab('add-category')}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ana Kategori Ekle</span>
                  </button>
                </div>
              </div>

              {/* Category Tree */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-3">
                  {categories.filter(cat => !cat.parent_id).map((category) => (
                    <CategoryTreeNode 
                      key={category.id} 
                      category={category} 
                      categories={categories}
                      onEdit={(cat) => console.log('Edit:', cat)}
                      onDelete={(cat) => console.log('Delete:', cat)}
                      onAddChild={(cat) => console.log('Add child:', cat)}
                    />
                  ))}
                </div>

                {categories.length === 0 && (
                  <div className="text-center py-12">
                    <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori yok</h3>
                    <p className="text-gray-600 mb-4">İlk kategorinizi ekleyerek başlayın.</p>
                    <button 
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setActiveTab('add-category')}
                    >
                      Kategori Ekle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Marka Yönetimi</h2>
                <div className="flex space-x-3">
                  <ImportExportButtons
                    data={brands}
                    filename="brands_export"
                    entityName="marka"
                  />
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    onClick={() => setActiveTab('add-brand')}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Marka Ekle</span>
                  </button>
                </div>
              </div>

              {/* Brands Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                  <div key={brand.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-lg flex items-center justify-center">
                          <Crown className="h-6 w-6 text-luxury-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                          <p className="text-sm text-gray-500">{brand.country}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          title="Düzenle"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          title="Sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{brand.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        brand.is_featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {brand.is_featured ? 'Öne Çıkan' : 'Normal'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        brand.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {brand.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {brands.length === 0 && (
                <div className="text-center py-12">
                  <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz marka yok</h3>
                  <p className="text-gray-600 mb-4">İlk markanızı ekleyerek başlayın.</p>
                  <button 
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => setActiveTab('add-brand')}
                  >
                    Marka Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sizes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Beden Yönetimi</h2>
                <div className="flex space-x-3">
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Beden Grubu Ekle</span>
                  </button>
                </div>
              </div>

              {/* Category-based Size Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Size List for this Category */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Mevcut Bedenler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* Example sizes - this should come from database */}
                        {category.slug === 'clothing' && ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <span key={size} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{size}</span>
                            <button className="hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {category.slug === 'footwear' && ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'].map((size) => (
                          <span key={size} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{size}</span>
                            <button className="hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        {category.slug === 'accessories' && ['One Size', 'S/M', 'L/XL'].map((size) => (
                          <span key={size} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{size}</span>
                            <button className="hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add New Size */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Yeni beden ekle..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori yok</h3>
                  <p className="text-gray-600 mb-4">Beden yönetimi için önce kategori oluşturun.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'colors' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Renk Yönetimi</h2>
                <div className="flex space-x-3">
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Renk Paleti Ekle</span>
                  </button>
                </div>
              </div>

              {/* Category-based Color Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Color List for this Category */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Mevcut Renkler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* Example colors - this should come from database */}
                        {category.slug === 'clothing' && [
                          { name: 'Siyah', hex: '#000000' },
                          { name: 'Beyaz', hex: '#FFFFFF' },
                          { name: 'Lacivert', hex: '#1E3A8A' },
                          { name: 'Gri', hex: '#6B7280' },
                          { name: 'Kırmızı', hex: '#DC2626' },
                          { name: 'Yeşil', hex: '#16A34A' }
                        ].map((color) => (
                          <div key={color.name} className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm text-gray-800">{color.name}</span>
                            <button className="text-red-500 hover:text-red-700 ml-2">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        {category.slug === 'footwear' && [
                          { name: 'Siyah', hex: '#000000' },
                          { name: 'Kahverengi', hex: '#92400E' },
                          { name: 'Beyaz', hex: '#FFFFFF' },
                          { name: 'Lacivert', hex: '#1E3A8A' }
                        ].map((color) => (
                          <div key={color.name} className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm text-gray-800">{color.name}</span>
                            <button className="text-red-500 hover:text-red-700 ml-2">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {category.slug === 'accessories' && [
                          { name: 'Altın', hex: '#F59E0B' },
                          { name: 'Gümüş', hex: '#9CA3AF' },
                          { name: 'Siyah', hex: '#000000' },
                          { name: 'Kahverengi', hex: '#92400E' }
                        ].map((color) => (
                          <div key={color.name} className="flex items-center space-x-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm text-gray-800">{color.name}</span>
                            <button className="text-red-500 hover:text-red-700 ml-2">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add New Color */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Renk adı..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                        <input
                          type="color"
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Predefined Color Palette */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-500">Hızlı seçim:</span>
                        {[
                          '#000000', '#FFFFFF', '#DC2626', '#16A34A', '#1E3A8A', '#7C2D12',
                          '#F59E0B', '#9333EA', '#EC4899', '#6B7280'
                        ].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori yok</h3>
                  <p className="text-gray-600 mb-4">Renk yönetimi için önce kategori oluşturun.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'materials' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Malzeme Yönetimi</h2>
                <div className="flex space-x-3">
                  <button 
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Malzeme Kategorisi Ekle</span>
                  </button>
                </div>
              </div>

              {/* Category-based Material Management */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-amber-600" />
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      <button className="text-amber-600 hover:text-amber-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Material List for this Category */}
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Mevcut Malzemeler:</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* Example materials - this should come from database */}
                        {category.slug === 'clothing' && [
                          'Pamuk', 'Polyester', 'Yün', 'İpek', 'Keten', 'Viskon', 'Modal', 'Kaşmir', 'Elastan'
                        ].map((material) => (
                          <span key={material} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{material}</span>
                            <button className="hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        
                        {category.slug === 'footwear' && [
                          'Deri', 'Süet', 'Canvas', 'Mesh', 'Sentetik', 'Nubuk', 'Kauçuk'
                        ].map((material) => (
                          <span key={material} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{material}</span>
                            <button className="hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}

                        {category.slug === 'accessories' && [
                          'Altın', 'Gümüş', 'Pirinç', 'Çelik', 'Deri', 'Kumaş', 'Plastik', 'Cam'
                        ].map((material) => (
                          <span key={material} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{material}</span>
                            <button className="hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}

                        {category.slug === 'bags' && [
                          'Deri', 'Kanvas', 'Naylon', 'Sentetik', 'Süet', 'PVC', 'Kumaş'
                        ].map((material) => (
                          <span key={material} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full flex items-center space-x-2">
                            <span>{material}</span>
                            <button className="hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add New Material */}
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Malzeme adı..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                        <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Material Properties */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-xs text-gray-600">Yıkanabilir</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-xs text-gray-600">Su geçirmez</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-xs text-gray-600">Nefes alır</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-xs text-gray-600">Elastik</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {categories.length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kategori yok</h3>
                  <p className="text-gray-600 mb-4">Malzeme yönetimi için önce kategori oluşturun.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h2>
                <div className="flex space-x-3">
                  <ImportExportButtons
                    data={users}
                    filename="users"
                    entityName="kullanıcı"
                  />
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Kullanıcı</span>
                  </button>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Diamond Kullanıcılar</p>
                      <p className="text-2xl font-bold text-gray-900">{users.filter((u: any) => u.vip_tier === 'Diamond').length}</p>
                    </div>
                    <Crown className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                      <p className="text-2xl font-bold text-gray-900">{users.reduce((sum: number, u: any) => sum + parseFloat(u.total_spent || 0), 0).toLocaleString('tr-TR')} TL</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* User Filters */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  {/* User Type Filter */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-600 mr-2">Kullanıcı Tipi:</span>
                    {['Tümü', 'Bronze', 'Gold', 'Platinum', 'Diamond'].map(type => (
                      <button
                        key={type}
                        className="px-3 py-1 text-xs rounded-full border transition-colors bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                      >
                        {type} ({type === 'Tümü' ? users.length : users.filter((u: any) => u.vip_tier === type).length})
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* Status Filter */}
                  <span className="text-sm font-medium text-gray-600 mr-2">Durum:</span>
                  {['Tümü', 'Active', 'Inactive'].map(status => (
                    <button
                      key={status}
                      className="px-3 py-1 text-xs rounded-full border transition-colors bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                    >
                      {status === 'Active' ? 'Aktif' : status === 'Inactive' ? 'Pasif' : status} ({status === 'Tümü' ? users.length : users.length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Listesi</h3>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Kullanıcı ara..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  {isLoadingData ? (
                    <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
                  ) : users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Henüz kullanıcı bulunmuyor</div>
                  ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP Seviye</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sipariş</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harcama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Giriş</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium text-sm">
                                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.full_name || 'İsimsiz'}</div>
                                <div className="text-sm text-gray-500">ID: {user.id?.substring(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email || '-'}</div>
                            <div className="text-sm text-gray-500">{user.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.vip_tier === 'Diamond' ? 'bg-purple-100 text-purple-800' :
                              user.vip_tier === 'Platinum' ? 'bg-gray-100 text-gray-800' :
                              user.vip_tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                              user.vip_tier === 'Bronze' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.vip_tier || 'Bronze'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.total_orders || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {parseFloat(user.total_spent || 0).toLocaleString('tr-TR')} TL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('tr-TR') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => window.open(`/account?user=${user.id}`, '_blank')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Görüntüle"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loyalty' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Crown className="h-8 w-8 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900">MEN VIP CLUB - Loyalty & Dealer System</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <ImportExportButtons
                    data={vipMembers}
                    filename="vip_members"
                    entityName="VIP üye"
                  />
                  <button 
                    onClick={() => setShowAddMember(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
                  >
                    <Crown className="h-4 w-4" />
                    <span>Yeni VIP Üye</span>
                  </button>
                </div>
              </div>

              {/* VIP Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Diamond Üyeler</p>
                      <p className="text-2xl font-bold">
                        {vipMembers.filter(m => m.tier === 'Diamond').length}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-100">Platinum Üyeler</p>
                      <p className="text-2xl font-bold">
                        {vipMembers.filter(m => m.tier === 'Platinum').length}
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-gray-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100">Gold Üyeler</p>
                      <p className="text-2xl font-bold">
                        {vipMembers.filter(m => m.tier === 'Gold').length}
                      </p>
                    </div>
                    <Crown className="h-8 w-8 text-amber-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Toplam İndirim</p>
                      <p className="text-2xl font-bold">
                        {vipMembers.reduce((sum, member) => sum + (member.totalSpent * member.discount / 100), 0).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                </div>
              </div>

              {/* VIP Members Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">VIP Üyeler & Bayiler</h3>
                    <div className="flex items-center space-x-4">
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Tüm Seviyeler</option>
                        <option value="Diamond">Diamond</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Bronze">Bronze</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="">Tüm Bayiler</option>
                        <option value="Premium Dealer">Premium Dealer</option>
                        <option value="Regional Dealer">Regional Dealer</option>
                        <option value="Local Dealer">Local Dealer</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Üye</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Seviye</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Bayi Tipi</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Puan</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Toplam Harcama</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Komisyon %</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Bölge</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">Durum</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-600">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vipMembers.map(member => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                member.tier === 'Diamond' ? 'bg-yellow-500' :
                                member.tier === 'Platinum' ? 'bg-gray-500' :
                                member.tier === 'Gold' ? 'bg-amber-500' : 'bg-orange-500'
                              }`}>
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                                <p className="text-xs text-gray-500">{member.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              member.tier === 'Diamond' ? 'bg-yellow-100 text-yellow-800' :
                              member.tier === 'Platinum' ? 'bg-gray-100 text-gray-800' :
                              member.tier === 'Gold' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {member.tier === 'Diamond' ? '💎' : 
                               member.tier === 'Platinum' ? '⚪' :
                               member.tier === 'Gold' ? '🟡' : '🟤'} {member.tier}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-900">{member.dealerType}</td>
                          <td className="p-4 text-sm font-medium text-gray-900">
                            {member.points.toLocaleString('tr-TR')}
                          </td>
                          <td className="p-4 text-sm text-gray-900">
                            {member.totalSpent.toLocaleString('tr-TR')} TL
                          </td>
                          <td className="p-4 text-sm font-medium text-green-600">
                            %{member.discount}
                          </td>
                          <td className="p-4 text-sm text-gray-900">{member.region}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {member.status === 'Active' ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loyalty Tiers Info */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">💎</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Diamond</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 100,000+ TL harcama</li>
                    <li>• %15 kart indirimi</li>
                    <li>• Premium Dealer statüsü</li>
                    <li>• Özel ürün erişimi</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚪</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Platinum</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 25,000+ TL harcama</li>
                    <li>• %8 kart indirimi</li>
                    <li>• Regional Dealer statüsü</li>
                    <li>• Öncelikli destek</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🟡</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Gold</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 10,000+ TL harcama</li>
                    <li>• %5 kart indirimi</li>
                    <li>• Local Dealer statüsü</li>
                    <li>• Ücretsiz kargo</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🟤</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Bronze</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 0+ TL harcama</li>
                    <li>• %2 kart indirimi</li>
                    <li>• Temel üye statüsü</li>
                    <li>• Puan biriktirme</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kampanya Yönetimi</h2>
                <div className="flex space-x-3">
                  <ImportExportButtons
                    data={campaigns}
                    filename="campaigns"
                    entityName="kampanya"
                  />
                  <button
                    onClick={() => setShowAddCampaign(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Kampanya</span>
                  </button>
                </div>
              </div>

              {/* Active Campaigns Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Aktif Kampanyalar</p>
                      <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.active).length}</p>
                    </div>
                    <Percent className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ortalama İndirim</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {Math.round(campaigns.reduce((acc, c) => acc + parseInt(c.discount), 0) / campaigns.length)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Kampanya Geliri</p>
                      <p className="text-2xl font-bold text-gray-900">87,450 TL</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Campaigns Table */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Tüm Kampanyalar</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kampanya</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İndirim</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bitiş Tarihi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {campaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={campaign.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                                <div className="text-sm text-gray-500">{campaign.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              -{campaign.discount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{campaign.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.validUntil}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              campaign.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {campaign.active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Stock Management Tab */}
          {activeTab === 'stock' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Envanter Yönetimi</h2>
                <div className="flex space-x-3">
                  <button
                    onClick={async () => {
                      const alerts = await loadLowStockAlerts()
                      if (alerts.length > 0) {
                        alert(`${alerts.length} ürün için düşük stok uyarısı var!`)
                      } else {
                        alert('Düşük stok uyarısı bulunmuyor.')
                      }
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Düşük Stok Uyarıları</span>
                  </button>
                  <ImportExportButtons
                    data={inventory}
                    filename="inventory_management"
                    entityName="envanter"
                  />
                </div>
              </div>

              {/* Stock Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
                      <p className="text-2xl font-bold text-gray-900">{inventory.length || productsList.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Stokta Var</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventory.filter((i: any) => i.quantity > 0 && i.track_inventory).length || 
                         productsList.filter((p: any) => p.inStock).length}
                      </p>
                    </div>
                    <Archive className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventory.filter((i: any) => 
                          i.track_inventory && 
                          i.quantity > 0 && 
                          i.quantity <= i.low_stock_threshold
                        ).length}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tükenen</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {inventory.filter((i: any) => 
                          i.track_inventory && 
                          i.quantity === 0 && 
                          !i.allow_backorder
                        ).length}
                      </p>
                    </div>
                    <Archive className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Inventory Management Table */}
              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Envanter Listesi</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const lowStock = inventory.filter((i: any) => 
                          i.track_inventory && 
                          i.quantity > 0 && 
                          i.quantity <= i.low_stock_threshold
                        )
                        if (lowStock.length > 0) {
                          alert(`${lowStock.length} ürün düşük stokta!`)
                        }
                      }}
                      className="text-sm text-yellow-600 hover:text-yellow-700"
                    >
                      Düşük Stokları Göster
                    </button>
                  </div>
                </div>
                {isLoadingData ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miktar</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eşik</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ön Sipariş</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Takip</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventory.length > 0 ? inventory.map((item: any) => {
                          const product = item.products
                          const isLowStock = item.track_inventory && item.quantity > 0 && item.quantity <= item.low_stock_threshold
                          const isOutOfStock = item.track_inventory && item.quantity === 0 && !item.allow_backorder
                          const isPreOrder = item.track_inventory && item.quantity === 0 && item.allow_backorder
                          
                          return (
                            <tr key={item.id} className={isLowStock ? 'bg-yellow-50' : isOutOfStock ? 'bg-red-50' : ''}>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{product?.name || 'Bilinmeyen Ürün'}</div>
                                <div className="text-sm text-gray-500">SKU: {product?.sku || item.product_id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="number"
                                  defaultValue={item.quantity}
                                  onBlur={async (e) => {
                                    const newQuantity = parseInt(e.target.value) || 0
                                    await updateInventory(item.product_id, { quantity: newQuantity })
                                  }}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="number"
                                  defaultValue={item.low_stock_threshold}
                                  onBlur={async (e) => {
                                    const newThreshold = parseInt(e.target.value) || 5
                                    await updateInventory(item.product_id, { lowStockThreshold: newThreshold })
                                  }}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isOutOfStock ? 'bg-red-100 text-red-800' :
                                  isLowStock ? 'bg-yellow-100 text-yellow-800' :
                                  isPreOrder ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {isOutOfStock ? 'Tükendi' :
                                   isLowStock ? 'Düşük' :
                                   isPreOrder ? 'Ön Sipariş' :
                                   'Stokta'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={item.allow_backorder || false}
                                  onChange={async (e) => {
                                    await updateInventory(item.product_id, { allowBackorder: e.target.checked })
                                  }}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={item.track_inventory !== false}
                                  onChange={async (e) => {
                                    await updateInventory(item.product_id, { trackInventory: e.target.checked })
                                  }}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <button
                                  onClick={async () => {
                                    if (confirm('Stok güncellemesi yapmak istediğinizden emin misiniz?')) {
                                      await loadInventory()
                                    }
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Güncelle
                                </button>
                              </td>
                            </tr>
                          )
                        }) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              Envanter kaydı bulunamadı. Ürünler için envanter kayıtları oluşturulmalıdır.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sosyal Medya Yönetimi</h2>
                <div className="flex space-x-3">
                  <ImportExportButtons
                    data={socialPosts}
                    filename="social_media_posts"
                    entityName="gönderi"
                  />
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Yeni Gönderi</span>
                  </button>
                </div>
              </div>

              {/* Social Media Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Facebook Gönderileri</p>
                      <p className="text-2xl font-bold text-gray-900">{socialPosts.filter(p => p.platform === 'facebook').length}</p>
                    </div>
                    <Facebook className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Instagram Gönderileri</p>
                      <p className="text-2xl font-bold text-gray-900">{socialPosts.filter(p => p.platform === 'instagram').length}</p>
                    </div>
                    <Instagram className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">WhatsApp Mesajları</p>
                      <p className="text-2xl font-bold text-gray-900">{socialPosts.filter(p => p.platform === 'whatsapp').length}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Etkileşim</p>
                      <p className="text-2xl font-bold text-gray-900">24,587</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                  <Facebook className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Facebook'ta Paylaş</h3>
                  <p className="text-sm text-blue-100 mb-4">Yeni ürünleri ve kampanyaları Facebook'ta paylaş</p>
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">
                    Gönderi Oluştur
                  </button>
                </div>

                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-lg text-white">
                  <Instagram className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">Instagram'da Paylaş</h3>
                  <p className="text-sm text-pink-100 mb-4">Görsel içerikler ile Instagram'da etkileşim arttır</p>
                  <button className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-50 font-medium">
                    Story/Post Oluştur
                  </button>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                  <MessageCircle className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-2">WhatsApp Kampanyası</h3>
                  <p className="text-sm text-green-100 mb-4">VIP üyelere özel kampanya mesajları gönder</p>
                  <button className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 font-medium">
                    Mesaj Gönder
                  </button>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Son Paylaşımlar</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İçerik</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etkileşim</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {socialPosts.map(post => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-lg object-cover" src={post.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                <div className="text-sm text-gray-500">{post.content.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {post.platform === 'facebook' && <Facebook className="h-5 w-5 text-blue-600 mr-2" />}
                              {post.platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600 mr-2" />}
                              {post.platform === 'whatsapp' && <MessageCircle className="h-5 w-5 text-green-600 mr-2" />}
                              <span className="capitalize">{post.platform}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.scheduledDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' : 
                              post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status === 'published' ? 'Yayınlandı' : 
                               post.status === 'scheduled' ? 'Zamanlandı' : 'Taslak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{post.engagement || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Yeni Ürün Ekle</h3>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ürün adını girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marka *</label>
                  <select
                    value={newProduct.brandId}
                    onChange={(e) => {
                      const selectedBrand = brands.find((b: any) => b.id === e.target.value)
                      setNewProduct({
                        ...newProduct, 
                        brandId: e.target.value,
                        brand: selectedBrand?.name || ''
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Marka seçin</option>
                    {brands.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat *</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Fiyat girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori</label>
                  <input
                    type="text"
                    value={newProduct.subcategory}
                    onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Alt kategori"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üretim Yeri</label>
                  <input
                    type="text"
                    value={newProduct.craftedIn}
                    onChange={(e) => setNewProduct({...newProduct, craftedIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Üretim yeri"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ürün açıklaması"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedenler (virgülle ayırın)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renkler (virgülle ayırın)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewProduct({...newProduct, colors: e.target.value.split(',').map(c => c.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Siyah, Beyaz, Mavi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Malzemeler (virgülle ayırın)</label>
                  <input
                    type="text"
                    onChange={(e) => setNewProduct({...newProduct, materials: e.target.value.split(',').map(m => m.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Cotton, Polyester"
                  />
                </div>
              </div>
              
              {/* Stock ID Preview */}
              {newProduct.brand && newProduct.sizes.length > 0 && newProduct.colors.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Oluşturulacak Stok ID'leri:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {newProduct.sizes.flatMap((size: string) => 
                      newProduct.colors.map((color: string) => {
                        const stockId = generateStockId(newProduct.brand, size, color)
                        return (
                          <div key={`${size}-${color}`} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="text-sm font-mono text-gray-900">{stockId}</span>
                            <span className="text-xs text-gray-500">{size} - {color}</span>
                          </div>
                        )
                      })
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Toplam {newProduct.sizes.length * newProduct.colors.length} adet stok kodu oluşturulacak.
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({...newProduct, inStock: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Stokta</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isNew}
                    onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yeni Ürün</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newProduct.isLimitedEdition}
                    onChange={(e) => setNewProduct({...newProduct, isLimitedEdition: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sınırlı Edisyon</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Ürün Ekle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ürün Düzenle</h3>
              <button
                onClick={() => {
                  setShowEditProduct(false)
                  setEditingProduct(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ürün Adı *</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ürün adını girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marka *</label>
                  <select
                    value={editingProduct.brandId}
                    onChange={(e) => {
                      const selectedBrand = brands.find((b: any) => b.id === e.target.value)
                      setEditingProduct({
                        ...editingProduct, 
                        brandId: e.target.value,
                        brand: selectedBrand?.name || ''
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Marka seçin</option>
                    {brands.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat *</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Fiyat girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alt Kategori</label>
                  <input
                    type="text"
                    value={editingProduct.subcategory}
                    onChange={(e) => setEditingProduct({...editingProduct, subcategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Alt kategori"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Üretim Yeri</label>
                  <input
                    type="text"
                    value={editingProduct.craftedIn}
                    onChange={(e) => setEditingProduct({...editingProduct, craftedIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Üretim yeri"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ürün açıklaması"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedenler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={editingProduct.sizes.join(', ')}
                    onChange={(e) => setEditingProduct({...editingProduct, sizes: e.target.value.split(',').map(s => s.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renkler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={editingProduct.colors.join(', ')}
                    onChange={(e) => setEditingProduct({...editingProduct, colors: e.target.value.split(',').map(c => c.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Siyah, Beyaz, Mavi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Malzemeler (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={editingProduct.materials.join(', ')}
                    onChange={(e) => setEditingProduct({...editingProduct, materials: e.target.value.split(',').map(m => m.trim())})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Cotton, Polyester"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({...editingProduct, inStock: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Stokta</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNew}
                    onChange={(e) => setEditingProduct({...editingProduct, isNew: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yeni Ürün</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingProduct.isLimitedEdition}
                    onChange={(e) => setEditingProduct({...editingProduct, isLimitedEdition: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sınırlı Edisyon</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowEditProduct(false)
                  setEditingProduct(null)
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Güncelle</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {showViewProduct && viewingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ürün Detayları</h3>
              <button
                onClick={() => {
                  setShowViewProduct(false)
                  setViewingProduct(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Ürün Görselleri</h4>
                  <div className="space-y-4">
                    {viewingProduct.images && viewingProduct.images.length > 0 ? (
                      viewingProduct.images.map((image: string, index: number) => (
                        <div key={index} className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${viewingProduct.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center';
                                parent.innerHTML = '<span class="text-gray-500">Görsel yüklenemedi</span>';
                              }
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Görsel bulunamadı</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Ürün Adı</label>
                        <p className="text-sm font-medium text-gray-900">{viewingProduct.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Marka</label>
                        <p className="text-sm text-gray-900">{viewingProduct.brand || 'Bilinmiyor'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Kategori</label>
                        <p className="text-sm text-gray-900">{viewingProduct.category || 'Kategori Yok'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">SKU</label>
                        <p className="text-sm text-gray-900">{viewingProduct.sku || 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Fiyat</label>
                        <p className="text-sm font-bold text-gray-900">{viewingProduct.price?.toLocaleString('tr-TR')}₺</p>
                      </div>
                      {viewingProduct.compare_price && (
                        <div>
                          <label className="text-xs text-gray-500">Karşılaştırma Fiyatı</label>
                          <p className="text-sm text-gray-500 line-through">{viewingProduct.compare_price?.toLocaleString('tr-TR')}₺</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-gray-500">Stok Durumu</label>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          viewingProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {viewingProduct.inStock ? 'Stokta' : 'Tükendi'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {viewingProduct.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Açıklama</h4>
                      <p className="text-sm text-gray-600">{viewingProduct.description}</p>
                    </div>
                  )}

                  {viewingProduct.short_description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Kısa Açıklama</h4>
                      <p className="text-sm text-gray-600">{viewingProduct.short_description}</p>
                    </div>
                  )}

                  {viewingProduct.tags && viewingProduct.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Etiketler</h4>
                      <div className="flex flex-wrap gap-2">
                        {viewingProduct.tags.map((tag: string, index: number) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sistem Bilgileri</h4>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>ID: {viewingProduct.id}</p>
                      <p>Oluşturulma: {new Date(viewingProduct.created_at).toLocaleDateString('tr-TR')}</p>
                      {viewingProduct.updated_at && (
                        <p>Güncellenme: {new Date(viewingProduct.updated_at).toLocaleDateString('tr-TR')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  setShowViewProduct(false)
                  setViewingProduct(null)
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Kapat
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowViewProduct(false)
                    handleEditProduct(viewingProduct)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Düzenle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {showAddCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Yeni Kampanya Ekle</h3>
              <button
                onClick={() => setShowAddCampaign(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kampanya Başlığı *</label>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Kampanya başlığı girin"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İndirim Oranı *</label>
                  <input
                    type="text"
                    value={newCampaign.discount}
                    onChange={(e) => setNewCampaign({...newCampaign, discount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="örn: 25%"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Geçerlilik Tarihi *</label>
                  <input
                    type="date"
                    value={newCampaign.validUntil}
                    onChange={(e) => setNewCampaign({...newCampaign, validUntil: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newCampaign.category}
                    onChange={(e) => setNewCampaign({...newCampaign, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Kategori seçin</option>
                    <option value="clothing">Giyim</option>
                    <option value="footwear">Ayakkabı</option>
                    <option value="accessories">Aksesuar</option>
                    <option value="outerwear">Dış Giyim</option>
                    <option value="luxury">Lüks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input
                    type="url"
                    value={newCampaign.image}
                    onChange={(e) => setNewCampaign({...newCampaign, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Kampanya görseli URL'si"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Kampanya açıklaması"
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setShowAddCampaign(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (newCampaign.title && newCampaign.discount && newCampaign.validUntil) {
                      const newCamp = {
                        id: Date.now().toString(),
                        title: newCampaign.title,
                        description: newCampaign.description,
                        discount: newCampaign.discount,
                        validUntil: newCampaign.validUntil,
                        image: newCampaign.image || 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
                        category: newCampaign.category || 'general',
                        active: true
                      }
                      setCampaigns([...campaigns, newCamp])
                      setNewCampaign({
                        title: '',
                        description: '',
                        discount: '',
                        validUntil: '',
                        image: '',
                        category: '',
                        active: true
                      })
                      setShowAddCampaign(false)
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Kampanya Ekle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Social Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Yeni Gönderi Oluştur</h3>
              <button
                onClick={() => setShowCreatePost(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform *</label>
                  <select
                    value={newSocialPost.platform}
                    onChange={(e) => setNewSocialPost({...newSocialPost, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
                  <input
                    type="datetime-local"
                    value={newSocialPost.scheduledDate}
                    onChange={(e) => setNewSocialPost({...newSocialPost, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input
                    type="url"
                    value={newSocialPost.image}
                    onChange={(e) => setNewSocialPost({...newSocialPost, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Gönderi görseli URL'si"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hashtag'ler</label>
                  <input
                    type="text"
                    value={newSocialPost.hashtags}
                    onChange={(e) => setNewSocialPost({...newSocialPost, hashtags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="#fashion #luxury #hayaku"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik *</label>
                <textarea
                  value={newSocialPost.content}
                  onChange={(e) => setNewSocialPost({...newSocialPost, content: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Gönderi içeriğini yazın..."
                />
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (newSocialPost.content && newSocialPost.platform) {
                      const newPost = {
                        id: Date.now().toString(),
                        title: newSocialPost.content.substring(0, 50) + (newSocialPost.content.length > 50 ? '...' : ''),
                        content: newSocialPost.content,
                        platform: newSocialPost.platform,
                        image: newSocialPost.image || 'https://images.pexels.com/photos/1040424/pexels-photo-1040424.jpeg',
                        scheduledDate: newSocialPost.scheduledDate || new Date().toISOString().split('T')[0],
                        status: 'Draft',
                        engagement: 0
                      }
                      setSocialPosts([...socialPosts, newPost])
                      setNewSocialPost({
                        content: '',
                        platform: 'Instagram',
                        image: '',
                        hashtags: '',
                        scheduledDate: ''
                      })
                      setShowCreatePost(false)
                    }
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Gönderi Oluştur</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hashtags Tab */}
      {activeTab === 'hashtags' && (
        <HashtagManager />
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">İntegrasyonlar</h2>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Yeni Entegrasyon</span>
              </button>
            </div>
          </div>
          
          {/* Integration Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aktif Entegrasyonlar</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Archive className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bekleyen Kurulumlar</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">API Çağrıları (Bugün)</p>
                  <p className="text-2xl font-bold text-blue-600">12,847</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sistem Durumu</p>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Payment Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ödeme Sistemleri</h3>
                    <p className="text-sm text-gray-500">Kredi kartı ve online ödeme</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>İyzico</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>PayTR</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Stripe</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>PayPal</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Kargo Sistemleri</h3>
                    <p className="text-sm text-gray-500">Sevkiyat ve takip</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>MNG Kargo</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Yurtiçi Kargo</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>UPS</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
              </div>
            </div>

            {/* Social Media Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Send className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sosyal Medya</h3>
                    <p className="text-sm text-gray-500">Otomatik paylaşım</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Kısmi</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Instagram</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Facebook</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Twitter</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
              </div>
            </div>

            {/* Analytics Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">Veri analizi ve raporlama</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Google Analytics</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Google Tag Manager</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Hotjar</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
              </div>
            </div>

            {/* Email Marketing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">E-posta Pazarlama</h3>
                    <p className="text-sm text-gray-500">Otomatik e-posta kampanyaları</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Pasif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Mailchimp</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
                <div className="flex justify-between">
                  <span>SendGrid</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
                <div className="flex justify-between">
                  <span>Klaviyo</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
              </div>
            </div>

            {/* Inventory Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Archive className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Envanter Yönetimi</h3>
                    <p className="text-sm text-gray-500">Stok ve depo yönetimi</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Netsis</span>
                  <span className="text-green-600">✓ Bağlı</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo Tiger</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
                <div className="flex justify-between">
                  <span>SAP</span>
                  <span className="text-gray-400">○ Bağlı Değil</span>
                </div>
              </div>
            </div>
            
            {/* CRM Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">CRM Sistemleri</h3>
                    <p className="text-sm text-gray-500">Müşteri ilişkileri yönetimi</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Kısmi</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>HubSpot</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Salesforce</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pipedrive</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Accounting Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Muhasebe Sistemleri</h3>
                    <p className="text-sm text-gray-500">Mali işlemler ve raporlama</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Foriba</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Logo Go</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>QuickBooks</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Communication Integrations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">İletişim Araçları</h3>
                    <p className="text-sm text-gray-500">Chat ve destek sistemleri</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aktif</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>WhatsApp Business</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Zendesk</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓ Bağlı</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Edit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Intercom</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">○ Bağlı Değil</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Integration Activity Log */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Son Entegrasyon Aktiviteleri</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm">Tümünü Görüntüle</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">İyzico entegrasyonu güncellendi</p>
                  <p className="text-xs text-gray-500">2 saat önce</p>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Başarılı</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">WhatsApp Business API bağlantısı kuruldu</p>
                  <p className="text-xs text-gray-500">5 saat önce</p>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Tamamlandı</span>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Package className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">MNG Kargo API'sinde yavaşlama tespit edildi</p>
                  <p className="text-xs text-gray-500">1 gün önce</p>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">İzleniyor</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}