import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../components/ui/Card';
import { dashboardMetrics, monthlySalesData } from '../data/mockData';
import { mockInvoices } from '../data/mockData';
import { Badge } from '../components/ui/Badge';

const DashboardPage: React.FC = () => {

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{formatCurrency(dashboardMetrics.totalRevenue)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Amount</h3>
          <p className="mt-1 text-3xl font-semibold text-orange-500">{formatCurrency(dashboardMetrics.pendingAmount)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Invoices</h3>
          <p className="mt-1 text-3xl font-semibold text-red-500">{dashboardMetrics.overdueInvoices}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">New Customers (This Month)</h3>
          <p className="mt-1 text-3xl font-semibold text-green-500">{dashboardMetrics.newCustomers}</p>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Monthly Sales</h3>
             <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(229, 231, 235, 0.5)" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      borderColor: '#4b5563',
                      color: '#ffffff',
                      borderRadius: '0.5rem'
                    }}
                    cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales (INR)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Invoices */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Invoices</h3>
            <ul className="space-y-4">
              {mockInvoices.slice(0, 5).map(invoice => (
                <li key={invoice.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invoice.customer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                     <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(invoice.amount)}</p>
                     <Badge status={invoice.status} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
