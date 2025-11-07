import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { Gstr1B2BSummary, Gstr1B2CSummary, Gstr1HsnSummary, Invoice, ProductUnit } from '../../types';

type Gstr1Tab = 'b2b' | 'b2c' | 'hsn';

const Gstr1Page: React.FC = () => {
  const { invoices, companies } = useData();
  const [activeTab, setActiveTab] = useState<Gstr1Tab>('b2b');
  
  const currentYear = new Date().getFullYear();
  const [period, setPeriod] = useState({
      month: '07', // Default to July
      year: currentYear.toString(),
  });

  const handlePrint = () => window.print();
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const gstr1Data = useMemo(() => {
    // Assuming the user's company is the first one
    const ownCompany = companies[0];
    if (!ownCompany) return { b2b: [], b2c: [], hsn: [] };

    const filteredInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.issueDate);
        return invDate.getFullYear().toString() === period.year && (invDate.getMonth() + 1).toString().padStart(2, '0') === period.month;
    });

    // B2B Data
    const b2b: Gstr1B2BSummary[] = filteredInvoices
      .filter(inv => inv.customer.gstin)
      .map(inv => {
        let taxableValue = 0;
        let totalTax = 0;
        
        inv.items.forEach(item => {
            const itemValue = item.quantity * item.rate;
            const discount = item.discountType === 'percentage' ? itemValue * ((item.discountValue || 0) / 100) : (item.discountValue || 0);
            const itemTaxableValue = itemValue - discount;
            taxableValue += itemTaxableValue;
            totalTax += itemTaxableValue * (item.tax / 100);
        });

        const isInterState = ownCompany.state !== inv.customer.state;
        return {
            id: inv.id,
            gstin: inv.customer.gstin,
            receiverName: inv.customer.name,
            invoiceNumber: inv.invoiceNumber,
            invoiceDate: inv.issueDate,
            invoiceValue: inv.amount,
            placeOfSupply: inv.customer.state,
            taxableValue,
            igst: isInterState ? totalTax : 0,
            cgst: !isInterState ? totalTax / 2 : 0,
            sgst: !isInterState ? totalTax / 2 : 0,
        };
      });

    // B2C (Small) Data
    const b2cMap = new Map<string, Omit<Gstr1B2CSummary, 'id'>>();
    filteredInvoices
      .filter(inv => !inv.customer.gstin)
      .forEach(inv => {
        const isInterState = ownCompany.state !== inv.customer.state;
        inv.items.forEach(item => {
            const key = `${inv.customer.state}-${item.tax}`;
            const existing = b2cMap.get(key) || { placeOfSupply: inv.customer.state, taxRate: item.tax, taxableValue: 0, igst: 0, cgst: 0, sgst: 0 };
            
            const itemValue = item.quantity * item.rate;
            const discount = item.discountType === 'percentage' ? itemValue * ((item.discountValue || 0) / 100) : (item.discountValue || 0);
            const taxableValue = itemValue - discount;
            const taxAmount = taxableValue * (item.tax / 100);

            existing.taxableValue += taxableValue;
            if (isInterState) {
                existing.igst += taxAmount;
            } else {
                existing.cgst += taxAmount / 2;
                existing.sgst += taxAmount / 2;
            }
            b2cMap.set(key, existing);
        });
      });
    const b2c: Gstr1B2CSummary[] = Array.from(b2cMap.entries()).map(([id, data]) => ({ id, ...data }));

    // HSN Summary Data
    const hsnMap = new Map<string, Omit<Gstr1HsnSummary, 'id'>>();
    filteredInvoices.forEach(inv => {
        const isInterState = ownCompany.state !== inv.customer.state;
        inv.items.forEach(item => {
            const hsn = item.product.hsnCode;
            const existing = hsnMap.get(hsn) || { hsnCode: hsn, description: item.product.name, uqc: item.product.unit, totalQuantity: 0, totalValue: 0, taxableValue: 0, igst: 0, cgst: 0, sgst: 0 };
            
            const itemValue = item.quantity * item.rate;
            const discount = item.discountType === 'percentage' ? itemValue * ((item.discountValue || 0) / 100) : (item.discountValue || 0);
            const taxableValue = itemValue - discount;
            const taxAmount = taxableValue * (item.tax / 100);

            existing.totalQuantity += item.quantity;
            existing.totalValue += itemValue;
            existing.taxableValue += taxableValue;

             if (isInterState) {
                existing.igst += taxAmount;
            } else {
                existing.cgst += taxAmount / 2;
                existing.sgst += taxAmount / 2;
            }
            hsnMap.set(hsn, existing);
        });
    });
    const hsn: Gstr1HsnSummary[] = Array.from(hsnMap.entries()).map(([id, data]) => ({ id, ...data }));

    return { b2b, b2c, hsn };
  }, [invoices, companies, period]);

  const renderTabContent = () => {
    switch (activeTab) {
        case 'b2b': return <B2BTable data={gstr1Data.b2b} />;
        case 'b2c': return <B2CTable data={gstr1Data.b2c} />;
        case 'hsn': return <HSNTable data={gstr1Data.hsn} />;
        default: return null;
    }
  };

  const getTabClass = (tabName: Gstr1Tab) => 
    `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        activeTab === tabName 
        ? 'bg-primary-600 text-white' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">GSTR-1 Report</h1>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <select value={period.month} onChange={e => setPeriod(p => ({...p, month: e.target.value}))} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm">
             {Array.from({length: 12}, (_, i) => (
                <option key={i+1} value={String(i+1).padStart(2, '0')}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
             ))}
          </select>
           <select value={period.year} onChange={e => setPeriod(p => ({...p, year: e.target.value}))} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm">
             {Array.from({length: 5}, (_, i) => <option key={currentYear-i} value={currentYear-i}>{currentYear-i}</option>)}
          </select>
          <Button onClick={handlePrint} className="flex items-center space-x-2">
            <PrintIcon className="h-4 w-4" />
            <span>Print / PDF</span>
          </Button>
        </div>
      </div>
      
      <Card className="print-card">
        <div className="print:hidden mb-6">
            <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <button className={getTabClass('b2b')} onClick={() => setActiveTab('b2b')}>B2B Invoices</button>
                <button className={getTabClass('b2c')} onClick={() => setActiveTab('b2c')}>B2C (Small) Invoices</button>
                <button className={getTabClass('hsn')} onClick={() => setActiveTab('hsn')}>HSN Summary</button>
            </div>
        </div>
        
         <div className="print-content">
            <div className="hidden print:block text-center mb-4">
                <h2 className="text-xl font-bold">GSTR-1 Report</h2>
                <p>For Period: {period.month}/{period.year}</p>
            </div>
            {renderTabContent()}
         </div>
      </Card>
    </div>
  );
};

const B2BTable: React.FC<{ data: Gstr1B2BSummary[] }> = ({ data }) => (
    <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2 print:text-base">B2B Invoices</h3>
        <table className="min-w-full text-xs">
            <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    {['GSTIN', 'Receiver Name', 'Inv #', 'Inv Date', 'Inv Value', 'Place of Supply', 'Taxable Value', 'IGST', 'CGST', 'SGST'].map(h => 
                        <th key={h} className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">{h}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map(row => (
                    <tr key={row.id}>
                        <td className="p-2 whitespace-nowrap">{row.gstin}</td>
                        <td className="p-2 whitespace-nowrap">{row.receiverName}</td>
                        <td className="p-2">{row.invoiceNumber}</td>
                        <td className="p-2">{row.invoiceDate}</td>
                        <td className="p-2 text-right">{formatNumber(row.invoiceValue)}</td>
                        <td className="p-2">{row.placeOfSupply}</td>
                        <td className="p-2 text-right">{formatNumber(row.taxableValue)}</td>
                        <td className="p-2 text-right">{formatNumber(row.igst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.cgst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.sgst)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
const B2CTable: React.FC<{ data: Gstr1B2CSummary[] }> = ({ data }) => (
     <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2 print:text-base">B2C (Small) Summary</h3>
        <table className="min-w-full text-xs">
            <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    {['Place of Supply', 'Tax Rate (%)', 'Taxable Value', 'IGST', 'CGST', 'SGST'].map(h => 
                        <th key={h} className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300">{h}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map(row => (
                    <tr key={row.id}>
                        <td className="p-2">{row.placeOfSupply}</td>
                        <td className="p-2 text-right">{row.taxRate}</td>
                        <td className="p-2 text-right">{formatNumber(row.taxableValue)}</td>
                        <td className="p-2 text-right">{formatNumber(row.igst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.cgst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.sgst)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
const HSNTable: React.FC<{ data: Gstr1HsnSummary[] }> = ({ data }) => (
    <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2 print:text-base">HSN-wise Summary of Outward Supplies</h3>
        <table className="min-w-full text-xs">
            <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                    {['HSN', 'Description', 'UQC', 'Total Qty', 'Total Value', 'Taxable Value', 'IGST', 'CGST', 'SGST'].map(h => 
                        <th key={h} className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap">{h}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map(row => (
                    <tr key={row.id}>
                        <td className="p-2">{row.hsnCode}</td>
                        <td className="p-2">{row.description}</td>
                        <td className="p-2">{row.uqc}</td>
                        <td className="p-2 text-right">{formatNumber(row.totalQuantity)}</td>
                        <td className="p-2 text-right">{formatNumber(row.totalValue)}</td>
                        <td className="p-2 text-right">{formatNumber(row.taxableValue)}</td>
                        <td className="p-2 text-right">{formatNumber(row.igst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.cgst)}</td>
                        <td className="p-2 text-right">{formatNumber(row.sgst)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const formatNumber = (value: number) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);


export default Gstr1Page;