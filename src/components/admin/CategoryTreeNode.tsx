'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, Folder, FolderOpen } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  is_active: boolean
  is_featured: boolean
  description?: string
  sort_order: number
}

interface CategoryTreeNodeProps {
  category: Category
  categories: Category[]
  level?: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddChild: (parentCategory: Category) => void
}

export default function CategoryTreeNode({ 
  category, 
  categories, 
  level = 0,
  onEdit, 
  onDelete, 
  onAddChild 
}: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  // Find child categories
  const childCategories = categories.filter(cat => cat.parent_id === category.id)
  const hasChildren = childCategories.length > 0

  // Calculate indentation
  const indentLevel = level * 20

  return (
    <div className="select-none">
      {/* Category Item */}
      <div 
        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100 mb-2"
        style={{ marginLeft: `${indentLevel}px` }}
      >
        <div className="flex items-center space-x-3 flex-1">
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1 hover:bg-gray-200 rounded ${
              hasChildren ? 'text-gray-600' : 'text-transparent'
            }`}
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>

          {/* Folder Icon */}
          <div className="text-blue-500">
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-5 w-5" /> : <Folder className="h-5 w-5" />
            ) : (
              <Folder className="h-5 w-5" />
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h4 className="font-medium text-gray-900">{category.name}</h4>
              <span className="text-sm text-gray-500">({category.slug})</span>
              
              {/* Status Badges */}
              <div className="flex space-x-2">
                {category.is_featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Öne Çıkan
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>
            
            {category.description && (
              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddChild(category)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full"
            title="Alt kategori ekle"
          >
            <Plus className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
            title="Düzenle"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(category)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Child Categories */}
      {hasChildren && isExpanded && (
        <div className="space-y-0">
          {childCategories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((childCategory) => (
              <CategoryTreeNode
                key={childCategory.id}
                category={childCategory}
                categories={categories}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            ))}
        </div>
      )}
    </div>
  )
}