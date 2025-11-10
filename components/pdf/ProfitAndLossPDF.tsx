import React from 'react';
import { Account } from '../../types';

// Define a type for the plData prop for clarity
interface PlData {
  salesRevenueAccount?: Account & { balance: number };
  otherIncomeAccounts: (Account & { balance: number })[];
  totalRevenue: number;
  cogsAccount?: Account & { balance: number };
  totalCOGS: number;
  grossProfit: number;
  otherExpenseAccounts: (Account & { balance: number })[];
  totalOtherExpenses: number;
  netProfitOrLoss: number;
}

interface ProfitAndLossPDFProps {
  plData: PlData;
  asOfDate: string;
  companyName: string;
}

const ProfitAndLossPDF: React.FC<ProfitAndLossPDFProps> = ({ plData, asOfDate, companyName }) => {
  
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
    return value < 0 ? `(${formatted})` : formatted;
  };

  const ReportTotalRow: React.FC<{ label: string, amount: number, isMajor?: boolean }> = ({ label, amount, isMajor }) => (
    <div className={`flex justify-between py-2 border-t ${isMajor ? 'border-gray-800 font-bold text-base' : 'border-gray-300 font-semibold'}`}>
      <span>{label}</span>
      <span>{formatCurrency(amount)}</span>
    </div>
  );

  return (
    <div className="bg-white p-12 text-gray-800" style={{ width: '794px', minHeight: '1123px', fontFamily: 'Arial, sans-serif' }}>
      <header className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#111827' }}>{companyName}</h2>
        <h3 className="text-xl font-semibold" style={{ color: '#374151' }}>Profit & Loss Statement</h3>
        <p className="text-sm text-gray-600">For the period ending {asOfDate}</p>
      </header>

      <main className="space-y-4">
        {/* Revenue Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
          <div className="pl-4 mt-1 space-y-1 text-sm">
            {plData.salesRevenueAccount && (
              <div className="flex justify-between py-1">
                <span>{plData.salesRevenueAccount.name}</span>
                <span>{formatCurrency(plData.salesRevenueAccount.balance)}</span>
              </div>
            )}
            {plData.otherIncomeAccounts.map(account => (
              <div key={account.id} className="flex justify-between py-1">
                <span>{account.name}</span>
                <span>{formatCurrency(account.balance)}</span>
              </div>
            ))}
          </div>
          <ReportTotalRow label="Total Revenue" amount={plData.totalRevenue} />
        </div>
        
        {/* COGS & Gross Profit */}
        <div>
          {plData.cogsAccount && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Cost of Goods Sold</h3>
              <div className="pl-4 mt-1 space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span>{plData.cogsAccount.name}</span>
                  <span>{formatCurrency(plData.cogsAccount.balance)}</span>
                </div>
              </div>
              <ReportTotalRow label="Total Cost of Goods Sold" amount={plData.totalCOGS} />
            </div>
          )}
          <ReportTotalRow label="Gross Profit" amount={plData.grossProfit} isMajor={true} />
        </div>

        {/* Expenses Section */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800">Operating Expenses</h3>
          <div className="pl-4 mt-1 space-y-1 text-sm">
            {plData.otherExpenseAccounts.map(account => (
              <div key={account.id} className="flex justify-between py-1">
                <span>{account.name}</span>
                <span>{formatCurrency(account.balance)}</span>
              </div>
            ))}
          </div>
          <ReportTotalRow label="Total Operating Expenses" amount={plData.totalOtherExpenses} />
        </div>

        {/* Net Profit/Loss Section */}
        <div className={`flex justify-between py-3 border-t-4 mt-4 font-bold text-xl ${plData.netProfitOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <span>Net {plData.netProfitOrLoss >= 0 ? 'Profit' : 'Loss'}</span>
          <span>{formatCurrency(plData.netProfitOrLoss)}</span>
        </div>
      </main>
    </div>
  );
};

export default ProfitAndLossPDF;