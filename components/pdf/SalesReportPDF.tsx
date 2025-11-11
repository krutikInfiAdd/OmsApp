import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Invoice } from '../../types';

interface SalesReportPDFProps {
  startDate: string;
  endDate: string;
  kpis: {
    totalSales: number;
    totalInvoices: number;
    avgInvoiceValue: number;
    topCustomer?: { name: string; total: number };
  };
  salesTrendData: { date: string; sales: number }[];
  topSellingProductsData: { name: string; quantity: number }[];
  filteredInvoices: Invoice[];
}

const SalesReportPDF: React.FC<SalesReportPDFProps> = ({
  startDate,
  endDate,
  kpis,
  salesTrendData,
  topSellingProductsData,
  filteredInvoices
}) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(value);

  return (
    <div className="bg-white p-12 text-gray-800" style={{ width: '794px', minHeight: '1123px', fontFamily: 'Arial, sans-serif' }}>
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold uppercase" style={{ color: '#111827' }}>Sales Report</h1>
        <p className="text-sm text-gray-600">For period: {startDate} to {endDate}</p>
      </header>

      <main>
        {/* KPIs */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a' }}>Key Metrics</h2>
          <div className="grid grid-cols-4 gap-4 text-center text-xs">
            <div className="p-2 border rounded">
              <h3 className="font-semibold text-gray-600">Total Sales</h3>
              <p className="font-bold text-base">{formatCurrency(kpis.totalSales)}</p>
            </div>
            <div className="p-2 border rounded">
              <h3 className="font-semibold text-gray-600">Total Invoices</h3>
              <p className="font-bold text-base">{kpis.totalInvoices}</p>
            </div>
            <div className="p-2 border rounded">
              <h3 className="font-semibold text-gray-600">Avg. Invoice Value</h3>
              <p className="font-bold text-base">{formatCurrency(kpis.avgInvoiceValue)}</p>
            </div>
            <div className="p-2 border rounded">
              <h3 className="font-semibold text-gray-600">Top Customer</h3>
              <p className="font-bold text-base truncate">{kpis.topCustomer?.name || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a' }}>Sales Trend</h2>
            <LineChart width={320} height={200} data={salesTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={8} />
              <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} fontSize={8} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend wrapperStyle={{fontSize: "10px"}}/>
              <Line type="monotone" dataKey="sales" name="Sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </div>
          <div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a' }}>Top 5 Products</h2>
            <BarChart width={320} height={200} data={topSellingProductsData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={8} />
              <YAxis type="category" dataKey="name" width={80} fontSize={8} interval={0} tick={{width: 70, textOverflow: 'ellipsis'}} />
              <Tooltip />
              <Legend wrapperStyle={{fontSize: "10px"}}/>
              <Bar dataKey="quantity" name="Qty Sold" fill="#8884d8" />
            </BarChart>
          </div>
        </section>
        
        {/* Detailed Table */}
        <section>
          <h2 className="text-lg font-bold mb-2" style={{ color: '#1e3a8a' }}>Detailed Invoice List</h2>
          <table className="w-full text-xs" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-gray-100 border-b border-t border-gray-200">
                <th className="p-2 text-left font-semibold text-gray-600">Invoice #</th>
                <th className="p-2 text-left font-semibold text-gray-600">Customer</th>
                <th className="p-2 text-left font-semibold text-gray-600">Date</th>
                <th className="p-2 text-right font-semibold text-gray-600">Amount</th>
                <th className="p-2 text-left font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.slice(0, 20).map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100">
                  <td className="p-2 align-top">{invoice.invoiceNumber}</td>
                  <td className="p-2 align-top">{invoice.customer.name}</td>
                  <td className="p-2 align-top">{invoice.issueDate}</td>
                  <td className="p-2 text-right align-top">{formatCurrency(invoice.amount)}</td>
                  <td className="p-2 align-top">{invoice.status}</td>
                </tr>
              ))}
            </tbody>
            {filteredInvoices.length > 20 && (
                <tfoot>
                    <tr>
                    <td colSpan={5} className="p-2 text-center text-gray-500">...and {filteredInvoices.length - 20} more invoices.</td>
                    </tr>
                </tfoot>
            )}
          </table>
        </section>
      </main>
      
      <footer className="text-center text-xs text-gray-500 mt-auto pt-4 border-t" style={{position: 'absolute', bottom: '2rem', left: '3rem', right: '3rem'}}>
          <p>This is a computer-generated report.</p>
      </footer>
    </div>
  );
};

export default SalesReportPDF;
