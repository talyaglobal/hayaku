import nodemailer from 'nodemailer'

// Email configuration from environment variables
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'whatsmartapp@tsmartsupport.com',
    pass: process.env.SMTP_PASSWORD || 'Whatsmartapp2025!'
  }
}

// Create reusable transporter
const transporter = nodemailer.createTransport(emailConfig)

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP configuration error:', error)
  } else {
    console.log('SMTP server is ready to send emails')
  }
})

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  shippingAddress: {
    first_name?: string
    last_name?: string
    address?: string
    city?: string
    district?: string
    postal_code?: string
    country?: string
    phone?: string
  }
  trackingNumber?: string
  status?: string
  payment_status?: string
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #D4AF37; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .item { padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-size: 18px; font-weight: bold; margin-top: 15px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sipariş Onayı</h1>
            <p>Sipariş Numaranız: ${data.orderNumber}</p>
          </div>
          <div class="content">
            <p>Sayın ${data.customerName},</p>
            <p>Siparişiniz başarıyla alınmıştır. Sipariş detaylarınız aşağıdadır:</p>
            
            <div class="order-details">
              <h3>Sipariş Detayları</h3>
              <p><strong>Sipariş Tarihi:</strong> ${new Date(data.orderDate).toLocaleDateString('tr-TR')}</p>
              <p><strong>Sipariş Numarası:</strong> ${data.orderNumber}</p>
              
              <h4>Ürünler:</h4>
              ${data.items.map(item => `
                <div class="item">
                  <strong>${item.name}</strong> - Adet: ${item.quantity} - ${item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}
                </div>
              `).join('')}
              
              <div class="total">
                <p>Ara Toplam: ${data.subtotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}</p>
                <p>KDV: ${data.tax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}</p>
                <p>Kargo: ${data.shipping.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}</p>
                <p style="color: #D4AF37; font-size: 20px;">Toplam: ${data.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}</p>
              </div>
            </div>
            
            <div class="order-details">
              <h3>Teslimat Adresi</h3>
              <p>${data.shippingAddress.first_name} ${data.shippingAddress.last_name}</p>
              <p>${data.shippingAddress.address}</p>
              <p>${data.shippingAddress.district || ''} ${data.shippingAddress.city}</p>
              <p>${data.shippingAddress.postal_code} ${data.shippingAddress.country}</p>
              ${data.shippingAddress.phone ? `<p>Telefon: ${data.shippingAddress.phone}</p>` : ''}
            </div>
            
            <p>Siparişinizin durumunu takip etmek için hesabınıza giriş yapabilirsiniz.</p>
            <p>Teşekkür ederiz!</p>
          </div>
          <div class="footer">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Hayaku" <${emailConfig.auth.user}>`,
      to: data.customerEmail,
      subject: `Sipariş Onayı - ${data.orderNumber}`,
      html: htmlContent
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return false
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(data: OrderEmailData): Promise<boolean> {
  try {
    const statusMessages: Record<string, string> = {
      'pending': 'Siparişiniz bekleniyor',
      'confirmed': 'Siparişiniz onaylandı',
      'processing': 'Siparişiniz hazırlanıyor',
      'shipped': 'Siparişiniz kargoya verildi',
      'delivered': 'Siparişiniz teslim edildi',
      'cancelled': 'Siparişiniz iptal edildi',
      'refunded': 'Siparişiniz iade edildi'
    }

    const statusMessage = statusMessages[data.status || 'pending'] || 'Sipariş durumu güncellendi'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #D4AF37; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .status-box { background-color: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #D4AF37; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sipariş Durumu Güncellendi</h1>
          </div>
          <div class="content">
            <p>Sayın ${data.customerName},</p>
            <p>Siparişinizin durumu güncellenmiştir:</p>
            
            <div class="status-box">
              <h3>${statusMessage}</h3>
              <p><strong>Sipariş Numarası:</strong> ${data.orderNumber}</p>
              <p><strong>Yeni Durum:</strong> ${statusMessage}</p>
              ${data.trackingNumber ? `<p><strong>Takip Numarası:</strong> ${data.trackingNumber}</p>` : ''}
            </div>
            
            <p>Siparişinizin detaylarını görüntülemek için hesabınıza giriş yapabilirsiniz.</p>
            <p>Teşekkür ederiz!</p>
          </div>
          <div class="footer">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Hayaku" <${emailConfig.auth.user}>`,
      to: data.customerEmail,
      subject: `Sipariş Durumu Güncellendi - ${data.orderNumber}`,
      html: htmlContent
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order status update email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order status update email:', error)
    return false
  }
}

/**
 * Send order cancellation email
 */
export async function sendOrderCancellationEmail(data: OrderEmailData, reason?: string): Promise<boolean> {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 20px; }
          .cancellation-box { background-color: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #dc3545; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sipariş İptal Edildi</h1>
          </div>
          <div class="content">
            <p>Sayın ${data.customerEmail},</p>
            <p>Maalesef siparişiniz iptal edilmiştir.</p>
            
            <div class="cancellation-box">
              <h3>Sipariş Bilgileri</h3>
              <p><strong>Sipariş Numarası:</strong> ${data.orderNumber}</p>
              <p><strong>İptal Tarihi:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
              ${reason ? `<p><strong>İptal Nedeni:</strong> ${reason}</p>` : ''}
              <p><strong>Toplam Tutar:</strong> ${data.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${data.currency}</p>
            </div>
            
            ${data.payment_status === 'paid' ? `
              <p><strong>Ödeme İadesi:</strong> Ödemeniz 3-5 iş günü içinde hesabınıza iade edilecektir.</p>
            ` : ''}
            
            <p>Herhangi bir sorunuz varsa lütfen müşteri hizmetlerimizle iletişime geçin.</p>
            <p>Teşekkür ederiz!</p>
          </div>
          <div class="footer">
            <p>Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Hayaku" <${emailConfig.auth.user}>`,
      to: data.customerEmail,
      subject: `Sipariş İptal Edildi - ${data.orderNumber}`,
      html: htmlContent
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order cancellation email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending order cancellation email:', error)
    return false
  }
}
