import React, { useMemo } from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';
import { Account } from '../../types';

const JournalVoucherViewPage: React.FC = () => {
  const { voucherId } = useParams<{ voucherId: string }>();
  const { journalVouchers, chartOfAccounts } = useData();

  const voucher = journalVouchers.find(v => v.id === voucherId);

  const { totalAmount } = useMemo(() => {
    if (!voucher) return { totalAmount: 0 };
    return {
      totalAmount: voucher.entries.reduce((sum, entry) => sum + entry.debit, 0),
    };
  }, [voucher]);

  const handlePrint = () => {
    window.print();
  };
  
  const getAccountName = (accountId: string) => {
    return chartOfAccounts.find(acc => acc.id === accountId)?.name || 'Unknown Account';
  };

  if (!voucher) {
    return <Navigate to="/accounting/journal" replace />;
  }
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
          <NavLink to="/accounting/journal">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Vouchers</span>
            </Button>
          </NavLink>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button onClick={handlePrint} className="flex items-center space-x-2">
              <PrintIcon className="h-4 w-4" />
              <span>Print / PDF</span>
            </Button>
          </div>
        </div>

        <Card className="p-8 md:p-12 print-card">
          <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">Journal Voucher</h1>
              <p className="text-gray-500 dark:text-gray-400">{voucher.voucherNumber}</p>
            </div>
            <div className="text-right">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Date:</span>
                <span className="text-gray-800 dark:text-white ml-2">{voucher.date}</span>
            </div>
          </header>

          <main>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300 w-8/12">Particulars (Account)</th>
                    <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 w-2/12">Debit</th>
                    <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300 w-2/12">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {voucher.entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="p-3">{getAccountName(entry.accountId)}</td>
                      <td className="p-3 text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                      <td className="p-3 text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-700/50 font-bold">
                    <tr>
                        <td className="p-3 text-right">Total</td>
                        <td className="p-3 text-right">{formatCurrency(totalAmount)}</td>
                        <td className="p-3 text-right">{formatCurrency(totalAmount)}</td>
                    </tr>
                </tfoot>
              </table>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Narration</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                {voucher.narration}
              </p>
            </div>
          </main>
        </Card>
      </div>
    </div>
  );
};

export default JournalVoucherViewPage;
