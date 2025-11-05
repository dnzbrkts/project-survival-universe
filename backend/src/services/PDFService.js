/**
 * PDF Oluşturma Servisi
 * PDF Generation Service
 */

class PDFService {
  /**
   * Fatura PDF oluştur
   * @param {Object} invoice - Fatura verisi
   * @returns {Buffer} PDF buffer
   */
  async generateInvoicePDF(invoice) {
    // Bu basit bir mock implementasyon
    // Gerçek uygulamada puppeteer, jsPDF veya benzeri kütüphaneler kullanılabilir
    
    const pdfContent = this.generateInvoiceHTML(invoice);
    
    // Mock PDF buffer (gerçek uygulamada PDF kütüphanesi kullanılacak)
    return Buffer.from(pdfContent, 'utf8');
  }

  /**
   * Fatura HTML şablonu oluştur
   * @param {Object} invoice - Fatura verisi
   * @returns {string} HTML içeriği
   */
  generateInvoiceHTML(invoice) {
    const { customer, items, creator } = invoice;
    
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fatura - ${invoice.invoice_number}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .customer-info, .company-info { width: 45%; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .totals { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; }
        .grand-total { font-weight: bold; font-size: 1.2em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${invoice.invoice_type === 'sales' ? 'SATIŞ FATURASI' : 'ALIŞ FATURASI'}</h1>
        <h2>Fatura No: ${invoice.invoice_number}</h2>
    </div>

    <div class="invoice-info">
        <div class="company-info">
            <h3>Şirket Bilgileri</h3>
            <p><strong>Şirket Adı:</strong> İşletme Yönetim Sistemi Ltd. Şti.</p>
            <p><strong>Adres:</strong> Örnek Mahalle, Örnek Sokak No:1</p>
            <p><strong>Telefon:</strong> +90 212 555 0000</p>
            <p><strong>E-posta:</strong> info@isletme.com</p>
        </div>
        
        <div class="customer-info">
            <h3>Müşteri Bilgileri</h3>
            <p><strong>Müşteri:</strong> ${customer.company_name}</p>
            <p><strong>Müşteri Kodu:</strong> ${customer.customer_code}</p>
            ${customer.tax_number ? `<p><strong>Vergi No:</strong> ${customer.tax_number}</p>` : ''}
            ${customer.tax_office ? `<p><strong>Vergi Dairesi:</strong> ${customer.tax_office}</p>` : ''}
            ${customer.address ? `<p><strong>Adres:</strong> ${customer.address}</p>` : ''}
            ${customer.phone ? `<p><strong>Telefon:</strong> ${customer.phone}</p>` : ''}
        </div>
    </div>

    <div class="invoice-details">
        <p><strong>Fatura Tarihi:</strong> ${new Date(invoice.invoice_date).toLocaleDateString('tr-TR')}</p>
        ${invoice.due_date ? `<p><strong>Vade Tarihi:</strong> ${new Date(invoice.due_date).toLocaleDateString('tr-TR')}</p>` : ''}
        <p><strong>Para Birimi:</strong> ${invoice.currency}</p>
        <p><strong>Durum:</strong> ${this.getStatusText(invoice.status)}</p>
        <p><strong>Ödeme Durumu:</strong> ${this.getPaymentStatusText(invoice.payment_status)}</p>
    </div>

    <table class="items-table">
        <thead>
            <tr>
                <th>Sıra</th>
                <th>Ürün/Hizmet</th>
                <th>Miktar</th>
                <th>Birim Fiyat</th>
                <th>İndirim %</th>
                <th>KDV %</th>
                <th>Tutar</th>
            </tr>
        </thead>
        <tbody>
            ${items.map((item, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        ${item.product ? item.product.product_name : 'Özel Kalem'}
                        ${item.description ? `<br><small>${item.description}</small>` : ''}
                    </td>
                    <td>${parseFloat(item.quantity).toLocaleString('tr-TR')} ${item.product?.unit || ''}</td>
                    <td>${parseFloat(item.unit_price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${invoice.currency}</td>
                    <td>%${parseFloat(item.discount_rate).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td>%${parseFloat(item.tax_rate).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                    <td>${parseFloat(item.line_total).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${invoice.currency}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="totals">
        <div class="total-row">
            <strong>Ara Toplam: ${parseFloat(invoice.subtotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${invoice.currency}</strong>
        </div>
        <div class="total-row">
            <strong>KDV Toplamı: ${parseFloat(invoice.tax_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${invoice.currency}</strong>
        </div>
        <div class="total-row grand-total">
            <strong>GENEL TOPLAM: ${parseFloat(invoice.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ${invoice.currency}</strong>
        </div>
    </div>

    ${invoice.notes ? `
    <div class="notes" style="margin-top: 30px;">
        <h4>Notlar:</h4>
        <p>${invoice.notes}</p>
    </div>
    ` : ''}

    <div class="footer" style="margin-top: 50px; text-align: center; font-size: 0.9em; color: #666;">
        <p>Bu fatura ${creator.first_name} ${creator.last_name} tarafından ${new Date(invoice.created_at).toLocaleString('tr-TR')} tarihinde oluşturulmuştur.</p>
    </div>
</body>
</html>`;
  }

  /**
   * Durum metni getir
   * @param {string} status - Durum kodu
   * @returns {string} Durum metni
   */
  getStatusText(status) {
    const statusMap = {
      'draft': 'Taslak',
      'approved': 'Onaylandı',
      'paid': 'Ödendi',
      'cancelled': 'İptal Edildi'
    };
    return statusMap[status] || status;
  }

  /**
   * Ödeme durumu metni getir
   * @param {string} paymentStatus - Ödeme durumu kodu
   * @returns {string} Ödeme durumu metni
   */
  getPaymentStatusText(paymentStatus) {
    const statusMap = {
      'unpaid': 'Ödenmedi',
      'partial': 'Kısmi Ödendi',
      'paid': 'Ödendi'
    };
    return statusMap[paymentStatus] || paymentStatus;
  }
}

module.exports = PDFService;