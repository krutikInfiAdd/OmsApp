import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { BankStatementTransaction } from '../../types';
import BankReconciliationPDF from '../../components/pdf/BankReconciliationPDF';

// Flattened journal voucher entry for easier processing
interface BookTransaction {
  id: string; // Journal Voucher ID
  date: string;
  description: string;
  debit: number;
  credit: number;
}

const BankReconciliationPage: React.FC = () => {
  const { journalVouchers, chartOfAccounts, bankStatementTransactions } = useData();
  
  const [clearedBankTxIds, setClearedBankTxIds] = useState<Set<string>>(new Set());
  const [clearedBookTxIds, setClearedBookTxIds] = useState<Set<string>>(new Set());

  const handleDownloadPdf = async () => {
    const reportDate = new Date().toLocaleDateString('en-CA');
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '794px'; 
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);
    root.render(
      <BankReconciliationPDF 
        reconciliationData={reconciliationData}
        asOfDate={reportDate}
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
    const imgWidth = pdfWidth;
    let imgHeight = imgWidth / ratio;
    
    // Check if content exceeds page height and scale if necessary
    let finalHeight = imgHeight;
    if (imgHeight > pdfHeight) {
        finalHeight = pdfHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
    pdf.save(`bank-reconciliation-${reportDate}.pdf`);
  };
  
  const toggleCleared = (id: string, type: 'bank' | 'book') => {
    if (type === 'bank') {
      setClearedBankTxIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else {
      setClearedBookTxIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }
  };

  const bookTransactions = useMemo<BookTransaction[]>(() => {
    const bankAccount = chartOfAccounts.find(acc => acc.name === 'Bank Account');
    if (!bankAccount) return [];

    return journalVouchers.flatMap(jv => {
      const bankEntry = jv.entries.find(e => e.accountId === bankAccount.id);
      if (bankEntry) {
        return [{
          id: jv.id,
          date: jv.date,
          description: jv.narration,
          debit: bankEntry.debit,
          credit: bankEntry.credit,
        }];
      }
      return [];
    });
  }, [journalVouchers, chartOfAccounts]);

  const reconciliationData = useMemo(() => {
    // 1. Starting Balances
    const closingBankBalance = bankStatementTransactions.reduce((bal, tx) => bal + tx.credit - tx.debit, 0);
    const closingBookBalance = bookTransactions.reduce((bal, tx) => bal + tx.debit - tx.credit, 0);

    // 2. Uncleared Book Items
    const depositsInTransit = bookTransactions.filter(tx => !clearedBookTxIds.has(tx.id) && tx.debit > 0);
    const totalDepositsInTransit = depositsInTransit.reduce((sum, tx) => sum + tx.debit, 0);

    const outstandingPayments = bookTransactions.filter(tx => !clearedBookTxIds.has(tx.id) && tx.credit > 0);
    const totalOutstandingPayments = outstandingPayments.reduce((sum, tx) => sum + tx.credit, 0);

    // 3. Uncleared Bank Items
    const bankCreditsNotInBooks = bankStatementTransactions.filter(tx => !clearedBankTxIds.has(tx.id) && tx.credit > 0);
    const totalBankCreditsNotInBooks = bankCreditsNotInBooks.reduce((sum, tx) => sum + tx.credit, 0);

    const bankDebitsNotInBooks = bankStatementTransactions.filter(tx => !clearedBankTxIds.has(tx.id) && tx.debit > 0);
    const totalBankDebitsNotInBooks = bankDebitsNotInBooks.reduce((sum, tx) => sum + tx.debit, 0);

    // 4. Adjusted Balances
    const adjustedBankBalance = closingBankBalance + totalDepositsInTransit - totalOutstandingPayments;
    const adjustedBookBalance = closingBookBalance + totalBankCreditsNotInBooks - totalBankDebitsNotInBooks;
    
    return {
      closingBankBalance,
      closingBookBalance,
      depositsInTransit,
      totalDepositsInTransit,
      outstandingPayments,
      totalOutstandingPayments,
      bankCreditsNotInBooks,
      totalBankCreditsNotInBooks,
      bankDebitsNotInBooks,
      totalBankDebitsNotInBooks,
      adjustedBankBalance,
      adjustedBookBalance,
    };
  }, [bankStatementTransactions, bookTransactions, clearedBankTxIds, clearedBookTxIds]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    
  const TransactionList: React.FC<{ title: string, transactions: (BookTransaction | BankStatementTransaction)[], clearedIds: Set<string>, type: 'book' | 'bank' }> = ({ title, transactions, clearedIds, type }) => (
    <Card>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
            <tr>
              <th className="p-2 w-8"></th>
              <th className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300">Description</th>
              <th className="p-2 text-right font-semibold text-gray-600 dark:text-gray-300">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map(tx => {
                const amount = type === 'bank' ? tx.credit - tx.debit : tx.debit - tx.credit;
                return (
                  <tr key={tx.id} className={clearedIds.has(tx.id) ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={clearedIds.has(tx.id)}
                        onChange={() => toggleCleared(tx.id, type)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        aria-label={`Clear transaction ${tx.description}`}
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap">{tx.date}</td>
                    <td className="p-2">{tx.description}</td>
                    <td className={`p-2 text-right whitespace-nowrap ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Bank Reconciliation</h1>
            <Button onClick={handleDownloadPdf} className="flex items-center space-x-2">
              <PrintIcon className="h-4 w-4" />
              <span>Print / PDF</span>
            </Button>
        </div>

        <Card className="p-6 md:p-8 print-card mb-8">
            <header className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bank Reconciliation Statement</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400">As of {new Date().toLocaleDateString('en-CA')}</p>
            </header>

            <div className="space-y-6 text-sm">
              {/* Reconciliation Summary Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Bank Side */}
                <div>
                  <div className="flex justify-between font-bold border-b pb-2">
                    <span>Balance as per Bank Statement</span>
                    <span>{formatCurrency(reconciliationData.closingBankBalance)}</span>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-gray-600 dark:text-gray-400">Add: Deposits in Transit</p>
                    {reconciliationData.depositsInTransit.length > 0 ? (
                        reconciliationData.depositsInTransit.map(tx => (
                            <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>{formatCurrency(tx.debit)}</span></div>
                        ))
                    ) : <p className="pl-4 text-gray-500 italic text-xs">None</p>}
                  </div>
                   <div className="py-2">
                    <p className="font-semibold text-gray-600 dark:text-gray-400">Less: Outstanding Payments</p>
                     {reconciliationData.outstandingPayments.length > 0 ? (
                        reconciliationData.outstandingPayments.map(tx => (
                            <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>({formatCurrency(tx.credit)})</span></div>
                        ))
                     ) : <p className="pl-4 text-gray-500 italic text-xs">None</p>}
                  </div>
                  <div className="flex justify-between font-bold border-t-2 border-gray-400 dark:border-gray-600 pt-2">
                    <span>Adjusted Bank Balance</span>
                    <span>{formatCurrency(reconciliationData.adjustedBankBalance)}</span>
                  </div>
                </div>

                {/* Book Side */}
                 <div>
                  <div className="flex justify-between font-bold border-b pb-2">
                    <span>Balance as per Company Books</span>
                    <span>{formatCurrency(reconciliationData.closingBookBalance)}</span>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-gray-600 dark:text-gray-400">Add: Bank Credits not in Books</p>
                     {reconciliationData.bankCreditsNotInBooks.length > 0 ? (
                        reconciliationData.bankCreditsNotInBooks.map(tx => (
                            <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>{formatCurrency(tx.credit)}</span></div>
                        ))
                     ) : <p className="pl-4 text-gray-500 italic text-xs">None</p>}
                  </div>
                   <div className="py-2">
                    <p className="font-semibold text-gray-600 dark:text-gray-400">Less: Bank Debits not in Books</p>
                     {reconciliationData.bankDebitsNotInBooks.length > 0 ? (
                        reconciliationData.bankDebitsNotInBooks.map(tx => (
                            <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>({formatCurrency(tx.debit)})</span></div>
                        ))
                     ) : <p className="pl-4 text-gray-500 italic text-xs">None</p>}
                  </div>
                  <div className="flex justify-between font-bold border-t-2 border-gray-400 dark:border-gray-600 pt-2">
                    <span>Adjusted Book Balance</span>
                    <span>{formatCurrency(reconciliationData.adjustedBookBalance)}</span>
                  </div>
                </div>
              </div>

              {/* Difference */}
              <div className={`mt-6 p-4 rounded-lg font-bold text-lg flex justify-between ${Math.abs(reconciliationData.adjustedBankBalance - reconciliationData.adjustedBookBalance) < 0.01 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                <span>DIFFERENCE</span>
                <span>{formatCurrency(reconciliationData.adjustedBankBalance - reconciliationData.adjustedBookBalance)}</span>
              </div>
            </div>
        </Card>
        
        {/* Transaction Lists for Clearing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:hidden">
          <TransactionList title="Bank Statement Transactions" transactions={bankStatementTransactions} clearedIds={clearedBankTxIds} type="bank" />
          <TransactionList title="Company Book Transactions (Bank)" transactions={bookTransactions} clearedIds={clearedBookTxIds} type="book" />
        </div>
      </div>
    </div>
  );
};

export default BankReconciliationPage;
