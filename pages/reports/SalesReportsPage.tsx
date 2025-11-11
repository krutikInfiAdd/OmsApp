import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { Input } from '../../components/ui/Input';
import { CalendarIcon } from '../../components/icons/CalendarIcon';
import { DataTable } from '../../components/ui/DataTable';
import { Column, Invoice } from '../../types';
import { Badge } from '../../components/ui/Badge';
import SalesReportPDF from '../../components/pdf/SalesReportPDF';

// Placeholder data for charts when no invoices are in the selected range
const placeholderSalesTrend = [
    { date: 'Day 1', sales: 40000 }, { date: 'Day 5', sales: 62000 },
    { date: 'Day 10', sales: 55000 }, { date: 'Day 15', sales: 78000 },
    { date: 'Day 20', sales: 83000 }, { date: 'Day 25', sales: 76000 },
    { date: 'Day 30', sales: 95000 },
];
const placeholderTopProducts = [
    { name: 'Sample A', quantity: 58 }, { name: 'Sample B', quantity: 45 },
    { name: 'Sample C', quantity: 32 }, { name: 'Sample D', quantity: 24 },
    { name: 'Sample E', quantity: 18 },
];


const SalesReportsPage: React.FC = () => {
  const { invoices } = useData();

  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState(getFirstDayOfMonth);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const issueDate = new Date(invoice.issueDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day
      return issueDate >= start && issueDate <= end;
    });
  }, [invoices, startDate, endDate]);

  const kpis = useMemo(() => {
    const totalSales = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvoices = filteredInvoices.length;
    const avgInvoiceValue = totalInvoices > 0 ? totalSales / totalInvoices : 0;

    const customerSales: { [key: string]: { name: string, total: number } } = {};
    filteredInvoices.forEach(inv => {
      if (!customerSales[inv.customer.id]) {
        customerSales[inv.customer.id] = { name: inv.customer.name, total: 0 };
      }
      customerSales[inv.customer.id].total += inv.amount;
    });

    const topCustomer = Object.values(customerSales).sort((a, b) => b.total - a.total)[0];

    return { totalSales, totalInvoices, avgInvoiceValue, topCustomer };
  }, [filteredInvoices]);
  
  const salesTrendData = useMemo(() => {
    if (filteredInvoices.length === 0) return placeholderSalesTrend;

    const dailySales: { [date: string]: number } = {};
    filteredInvoices.forEach(inv => {
      dailySales[inv.issueDate] = (dailySales[inv.issueDate] || 0) + inv.amount;
    });
    return Object.entries(dailySales)
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredInvoices]);

  const topSellingProductsData = useMemo(() => {
    if (filteredInvoices.length === 0) return placeholderTopProducts;
    
    const productQuantities: { [name: string]: number } = {};
    filteredInvoices.forEach(inv => {
      inv.items.forEach(item => {
        productQuantities[item.product.name] = (productQuantities[item.product.name] || 0) + item.quantity;
      });
    });
    return Object.entries(productQuantities)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredInvoices]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const handleDownloadPdf = async () => {
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '794px'; 
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);
    root.render(
      <SalesReportPDF
        startDate={startDate}
        endDate={endDate}
        kpis={kpis}
        salesTrendData={salesTrendData}
        topSellingProductsData={topSellingProductsData}
        filteredInvoices={filteredInvoices}
      />
    );
    
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const canvas = await html2canvas(tempContainer, {
      scale: 2, 
      useCORS: true,
      logging: false,
    });
    
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    let imgHeight = pdfWidth / ratio;
    
    let finalHeight = imgHeight;
    if (imgHeight > pdfHeight) {
        console.warn("Report content is taller than a single page. Content will be scaled to fit.");
        finalHeight = pdfHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
    pdf.save(`sales-report-${startDate}-to-${endDate}.pdf`);
  };

  const invoiceColumns: Column<Invoice>[] = [
    { header: 'Invoice #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.invoiceNumber}</span>, sortKey: 'invoiceNumber' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any },
    { header: 'Issue Date', accessor: 'issueDate', sortKey: 'issueDate' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
  ];

  return (
    <div className="space-y-8 print-wrapper">
      <div className="flex flex-col sm:flex-row justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Reports</h1>
         <Button onClick={handleDownloadPdf} className="flex items-center space-x-2 mt-4 sm:mt-0">
          <PrintIcon className="h-4 w-4" />
          <span>Print Report</span>
        </Button>
      </div>
      
      <Card className="print:shadow-none print:border-none print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h2 className="text-lg font-semibold">Report Filters</h2>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div>
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <Input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} icon={<CalendarIcon />} />
            </div>
            <div>
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
              <Input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} icon={<CalendarIcon />} />
            </div>
          </div>
        </div>

        <div className="hidden print:block text-center mb-4">
            <h2 className="text-xl font-bold">Sales Report</h2>
            <p>From {startDate} to {endDate}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          <Card>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{formatCurrency(kpis.totalSales)}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invoices</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{kpis.totalInvoices}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Invoice Value</h3>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{formatCurrency(kpis.avgInvoiceValue)}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Customer</h3>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white truncate">{kpis.topCustomer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(kpis.topCustomer?.total || 0)}</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            <Card>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Sales Trend</h3>
                <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(229, 231, 235, 0.5)" />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280' }} fontSize={12} />
                    <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', color: '#ffffff', borderRadius: '0.5rem' }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Sales (INR)" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top 5 Selling Products (by Qty)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={topSellingProductsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(229, 231, 235, 0.5)" />
                        <XAxis type="number" tick={{ fill: '#6b7280' }} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fill: '#6b7280' }} fontSize={12} interval={0} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', color: '#ffffff', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="quantity" fill="#8884d8" name="Quantity Sold" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>

        {/* Detailed Table */}
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detailed Invoice List</h3>
             <DataTable 
                columns={invoiceColumns} 
                data={filteredInvoices} 
                searchKeys={['invoiceNumber', 'customer.name']}
                searchPlaceholder="Search within this report..."
            />
        </div>
      </Card>
    </div>
  );
};

export default SalesReportsPage;
