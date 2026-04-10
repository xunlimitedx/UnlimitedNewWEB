'use client';

import React, { useRef } from 'react';
import { Printer } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

interface PrintInvoiceProps {
  order: Order;
}

export default function PrintInvoice({ order }: PrintInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.id.slice(0, 8).toUpperCase()}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company { font-size: 24px; font-weight: bold; color: #4f46e5; }
          .company-info { font-size: 12px; color: #666; margin-top: 8px; line-height: 1.6; }
          .invoice-title { font-size: 28px; font-weight: bold; text-align: right; color: #333; }
          .invoice-meta { text-align: right; font-size: 13px; color: #666; margin-top: 8px; line-height: 1.8; }
          .divider { border-top: 2px solid #e5e7eb; margin: 24px 0; }
          .bill-to { margin-bottom: 30px; }
          .bill-to h3 { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px; letter-spacing: 1px; }
          .bill-to p { font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #e5e7eb; letter-spacing: 0.5px; }
          td { padding: 12px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
          .totals { text-align: right; margin-bottom: 40px; }
          .totals p { font-size: 14px; margin-bottom: 6px; }
          .totals .total { font-size: 20px; font-weight: bold; color: #4f46e5; }
          .footer { text-align: center; font-size: 11px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="company">Unlimited IT Solutions</div>
            <div class="company-info">
              202 Marine Drive, Ramsgate, KZN 4285<br>
              Tel: 039 314 4359 | Cell: 082 556 9875<br>
              Email: info@unlimitedits.co.za<br>
              Web: www.unlimitedits.co.za
            </div>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
              Invoice #: ${order.id.slice(0, 8).toUpperCase()}<br>
              Date: ${formatDate(order.createdAt)}<br>
              Status: ${order.status?.toUpperCase() || 'PENDING'}
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="bill-to">
          <h3>Bill To</h3>
          <p>
            ${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || 'Customer'}<br>
            ${order.shippingAddress?.street || ''}<br>
            ${order.shippingAddress?.city || ''} ${order.shippingAddress?.province || ''} ${order.shippingAddress?.postalCode || ''}<br>
            ${order.shippingAddress?.phone || ''}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Unit Price</th>
              <th style="text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${(order.items || []).map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${formatCurrency(item.price)}</td>
                <td style="text-align:right">${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <p>Subtotal: ${formatCurrency(order.subtotal || order.total)}</p>
          ${order.shipping ? `<p>Shipping: ${formatCurrency(order.shipping)}</p>` : ''}
          ${order.discount ? `<p>Discount: -${formatCurrency(order.discount)}</p>` : ''}
          <p class="total">Total: ${formatCurrency(order.total)}</p>
        </div>
        <div class="footer">
          Thank you for your business!<br>
          Unlimited IT Solutions &bull; VAT reg available on request &bull; www.unlimitedits.co.za
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 bg-gray-100 hover:bg-primary-50 rounded-lg transition-colors"
      title="Print invoice"
    >
      <Printer className="w-4 h-4" />
      Print Invoice
    </button>
  );
}
