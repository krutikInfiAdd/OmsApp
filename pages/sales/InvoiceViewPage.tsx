import React from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';

const InvoiceViewPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const { invoices, companies } = useData();

  const invoice = invoices.find(i => i.id === invoiceId);
  const company = invoice ? companies.find(c => c.id === invoice.customer.companyId) || companies[0] : null;

  const handlePrint = () => {
    window.print();
  };

  const { preDiscountSubtotal, totalDiscount, subtotal, taxSummary, grandTotal } = React.useMemo(() => {
    if (!invoice) return { preDiscountSubtotal: 0, totalDiscount: 0, subtotal: 0, taxSummary: {}, grandTotal: 0 };
    
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
  }, [invoice]);

  if (!invoice) {
    return <Navigate to="/sales/invoices" replace />;
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
          <NavLink to="/sales/invoices">
             <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Invoices</span>
             </Button>
          </NavLink>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" className="flex items-center space-x-2" disabled>
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button onClick={handlePrint} className="flex items-center space-x-2">
              <PrintIcon className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        <Card className="p-8 md:p-12 print-card" id="printable-invoice">
           <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                {company && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{company.address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">GSTIN: {company.gstin}</p>
                  </>
                )}
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold uppercase text-primary-600 dark:text-primary-400">Invoice</h1>
                <p className="text-gray-500 dark:text-gray-400">{invoice.invoiceNumber}</p>
                <div className="mt-2">
                   <Badge status={invoice.status} />
                </div>
              </div>
           </header>

           <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Bill To</h3>
                <p className="font-bold text-gray-800 dark:text-white">{invoice.customer.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.customer.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.customer.city}, {invoice.customer.state}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">GSTIN: {invoice.customer.gstin}</p>
              </div>
              <div className="text-right">
                  <div className="grid grid-cols-2 gap-x-4">
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Issue Date:</span>
                      <span className="text-gray-800 dark:text-white">{invoice.issueDate}</span>
                      <span className="font-semibold text-gray-600 dark:text-gray-300">Due Date:</span>
                      <span className="text-gray-800 dark:text-white">{invoice.dueDate}</span>
                  </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                          <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 w-1/12">#</th>
                          <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 w-5/12">Item & Description</th>
                          <th className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 w-1/12">Qty</th>
                          <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 w-2/12">Rate</th>
                          <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 w-3/12">Amount</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                          <td className="p-3 align-top">{index + 1}</td>
                          <td className="p-3 align-top">
                              <p className="font-semibold text-gray-800 dark:text-white">{item.product.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">HSN: {item.product.hsnCode}</p>
                          </td>
                          <td className="p-3 text-center align-top">{item.quantity}</td>
                          <td className="p-3 text-right align-top">{formatCurrency(item.rate)}</td>
                          <td className="p-3 text-right align-top">{formatCurrency(item.quantity * item.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
           </div>

           <div className="flex justify-end mt-8">
              <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-800 dark:text-white">{formatCurrency(preDiscountSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                      <span className="text-red-500">{formatCurrency(totalDiscount)}</span>
                  </div>
                   <div className="flex justify-between font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-700 dark:text-gray-300">Taxable Amount:</span>
                      <span className="text-gray-800 dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {Object.entries(taxSummary).map(([rate, amount]) => (
                      <div key={rate} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">GST @ {rate}%:</span>
                          <span className="text-gray-800 dark:text-white">{formatCurrency(amount as number)}</span>
                      </div>
                  ))}
                  <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3">
                      <span className="text-gray-900 dark:text-white">Grand Total:</span>
                      <span className="text-primary-600 dark:text-primary-400">{formatCurrency(grandTotal)}</span>
                  </div>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceViewPage;