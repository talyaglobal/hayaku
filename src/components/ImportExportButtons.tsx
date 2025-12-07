'use client'

import { useState } from 'react'
import { Download, Upload, FileSpreadsheet } from 'lucide-react'

interface ImportExportButtonsProps {
  data?: any[]
  filename?: string
  onImport?: (data: any[]) => void
  entityName?: string
}

export default function ImportExportButtons({ 
  data = [], 
  filename = 'data', 
  onImport,
  entityName = 'veri' 
}: ImportExportButtonsProps) {
  const [isImporting, setIsImporting] = useState(false)

  // CSV Export Function
  const exportToCSV = () => {
    if (!data.length) {
      alert('Dışa aktarılacak veri bulunamadı')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          // Handle nested objects and arrays
          const cellValue = typeof value === 'object' ? JSON.stringify(value) : value
          // Escape quotes and wrap in quotes if contains comma
          return typeof cellValue === 'string' && cellValue.includes(',') 
            ? `"${cellValue.replace(/"/g, '""')}"` 
            : cellValue
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // CSV Import Function
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        const parsedData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = values[index] || ''
            })
            return obj
          })

        onImport?.(parsedData)
        alert(`${parsedData.length} ${entityName} başarıyla içe aktarıldı`)
      } catch (error) {
        console.error('Import error:', error)
        alert('CSV dosyası içe aktarılırken hata oluştu')
      } finally {
        setIsImporting(false)
        event.target.value = '' // Reset input
      }
    }

    reader.readAsText(file)
  }

  // Generate Google Sheets Template
  const generateGoogleSheetsTemplate = () => {
    if (!data.length) {
      alert('Şablon oluşturmak için örnek veri bulunamadı')
      return
    }

    const headers = Object.keys(data[0])
    const sampleData = data.slice(0, 3) // Take first 3 rows as example
    
    const templateContent = [
      '# Google Sheets Şablonu',
      '# Bu satırları silin ve kendi verilerinizi ekleyin',
      '',
      headers.join(','),
      ...sampleData.map(row => 
        headers.map(header => row[header]).join(',')
      ),
      '',
      '# Şablon kullanımı:',
      '# 1. Bu içeriği Google Sheets\'e kopyalayın',
      '# 2. Verilerinizi düzenleyin', 
      '# 3. File > Download > CSV olarak indirin',
      '# 4. İndirilen CSV\'yi yukarıdaki "İçe Aktar" butonuyla yükleyin'
    ].join('\n')

    const blob = new Blob([templateContent], { type: 'text/plain;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_google_sheets_template.txt`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Export to CSV */}
      <button
        onClick={exportToCSV}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        disabled={!data.length}
      >
        <Download className="h-4 w-4" />
        <span>CSV İndir</span>
      </button>

      {/* Import from CSV */}
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isImporting}
        />
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isImporting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          disabled={isImporting}
        >
          <Upload className="h-4 w-4" />
          <span>{isImporting ? 'Yükleniyor...' : 'CSV İçe Aktar'}</span>
        </button>
      </div>

      {/* Google Sheets Template */}
      <button
        onClick={generateGoogleSheetsTemplate}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        disabled={!data.length}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Google Sheets Şablonu</span>
      </button>
    </div>
  )
}