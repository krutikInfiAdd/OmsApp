import React from 'react';
import { Invoice, Company } from '../../types';

interface InvoicePDFProps {
  invoice: Invoice;
  company: Company;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, company }) => {
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value);

  const { subtotal, taxSummary, grandTotal, totalDiscount, preDiscountSubtotal } = React.useMemo(() => {
    let preDiscountSubtotal = 0;
    let postDiscountSubtotal = 0;
    const taxSummary: { [rate: number]: number } = {};

    invoice.items.forEach(item => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const discountValue = Number(item.discountValue) || 0;
        const discountType = item.discountType || 'percentage';
        
        const itemTotalBeforeDiscount = quantity * rate;
        preDiscountSubtotal += itemTotalBeforeDiscount;

        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = itemTotalBeforeDiscount * (discountValue / 100);
        } else { // fixed
            discountAmount = Math.min(discountValue, itemTotalBeforeDiscount);
        }
        
        const discountedAmount = itemTotalBeforeDiscount - discountAmount;
        postDiscountSubtotal += discountedAmount;

        if (item.tax) {
            const taxRate = Number(item.tax);
            const taxAmount = discountedAmount * (taxRate / 100);
            taxSummary[taxRate] = (taxSummary[taxRate] || 0) + taxAmount;
        }
    });

    const totalTax = Object.values(taxSummary).reduce((acc, val) => acc + val, 0);
    const grandTotal = postDiscountSubtotal + totalTax;
    const totalDiscount = preDiscountSubtotal - postDiscountSubtotal;

    return { subtotal: postDiscountSubtotal, taxSummary, grandTotal, totalDiscount, preDiscountSubtotal };
  }, [invoice.items]);

  return (
    <div className="bg-white p-12 text-gray-800" style={{ width: '794px', minHeight: '1123px', fontFamily: 'Arial, sans-serif' }}>
      
      <header className="flex justify-between items-start pb-4 mb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold uppercase" style={{color: '#111827'}}>{company.name}</h1>
          <p className="text-xs text-gray-600">{company.address}</p>
          <p className="text-xs text-gray-600">{company.email} | {company.phone}</p>
          <p className="text-xs text-gray-600">GSTIN: {company.gstin}</p>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-bold uppercase" style={{color: '#1e3a8a'}}>INVOICE</h2>
          <table className="text-xs mt-2 w-full">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-600 text-right pr-2">Invoice #:</td>
                <td className="text-gray-800">{invoice.invoiceNumber}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 text-right pr-2">Date:</td>
                <td className="text-gray-800">{invoice.issueDate}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 text-right pr-2">Due Date:</td>
                <td className="text-gray-800">{invoice.dueDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>

      <main>
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase text-gray-500 mb-1">BILL TO</div>
          <div className="font-bold text-base text-gray-800">{invoice.customer.name}</div>
          <div className="text-xs text-gray-600">{invoice.customer.address}</div>
          <div className="text-xs text-gray-600">{invoice.customer.city}, {invoice.customer.state}</div>
          <div className="text-xs text-gray-600">GSTIN: {invoice.customer.gstin}</div>
        </div>

        <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr className="bg-gray-100 border-b border-t border-gray-200">
              <th className="p-2 text-left font-semibold text-gray-600" style={{ width: '5%' }}>#</th>
              <th className="p-2 text-left font-semibold text-gray-600" style={{ width: '30%' }}>ITEM</th>
              <th className="p-2 text-center font-semibold text-gray-600" style={{ width: '15%' }}>QTY</th>
              <th className="p-2 text-right font-semibold text-gray-600" style={{ width: '25%' }}>RATE</th>
              <th className="p-2 text-right font-semibold text-gray-600" style={{ width: '25%' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="p-2 align-top">{index + 1}</td>
                <td className="p-2 align-top" style={{ wordBreak: 'break-word' }}>
                  <div className="font-semibold text-gray-800">{item.product.name}</div>
                  <div className="text-gray-500">HSN: {item.product.hsnCode}</div>
                </td>
                <td className="p-2 text-center align-top">{item.quantity}</td>
                <td className="p-2 text-right align-top">{formatCurrency(item.rate)}</td>
                <td className="p-2 text-right align-top">{formatCurrency(item.quantity * item.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-end mt-4">
          <div className="w-full max-w-xs">
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1 text-gray-600">Subtotal</td>
                  <td className="py-1 text-right">{formatCurrency(preDiscountSubtotal)}</td>
                </tr>
                {totalDiscount > 0 && (
                  <tr>
                    <td className="py-1 text-gray-600">Discount</td>
                    <td className="py-1 text-right text-red-500">- {formatCurrency(totalDiscount)}</td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-1 pt-2 text-gray-700 border-t border-gray-200">Taxable Amount</td>
                  <td className="py-1 pt-2 text-right border-t border-gray-200">{formatCurrency(subtotal)}</td>
                </tr>
                {Object.entries(taxSummary).map(([rate, amount]) => (
                  <tr key={rate}>
                    <td className="py-1 text-gray-600">GST @ {rate}%</td>
                    {/* Fix: Explicitly cast 'amount' to number to resolve potential type inference issue. */}
                    <td className="py-1 text-right">{formatCurrency(amount as number)}</td>
                  </tr>
                ))}
                <tr className="font-bold text-sm text-gray-800 bg-gray-100">
                  <td className="p-2">Grand Total</td>
                  <td className="p-2 text-right">{formatCurrency(grandTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-gray-500 mt-auto pt-4 border-t">
          <p>Thank you for your business!</p>
          <p>{company.name} | {company.address}</p>
      </footer>
    </div>
  );
};

export default InvoicePDF;