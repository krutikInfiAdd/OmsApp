import React from 'react';
import { BankStatementTransaction } from '../../types';

interface BookTransaction {
  id: string;
  date: string;
  description: string;
  debit: number;
  credit: number;
}

interface ReconciliationData {
  closingBankBalance: number;
  closingBookBalance: number;
  depositsInTransit: BookTransaction[];
  outstandingPayments: BookTransaction[];
  bankCreditsNotInBooks: BankStatementTransaction[];
  bankDebitsNotInBooks: BankStatementTransaction[];
  adjustedBankBalance: number;
  adjustedBookBalance: number;
}

interface BankReconciliationPDFProps {
  reconciliationData: ReconciliationData;
  asOfDate: string;
}

const BankReconciliationPDF: React.FC<BankReconciliationPDFProps> = ({ reconciliationData, asOfDate }) => {
  
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(value));
    return value < 0 ? `(${formatted})` : formatted;
  };

  return (
    <div className="bg-white p-12 text-gray-800" style={{ width: '794px', minHeight: '1123px', fontFamily: 'Arial, sans-serif' }}>
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase" style={{color: '#111827'}}>Zenith Innovations Inc.</h1>
        <h2 className="text-xl font-semibold" style={{color: '#374151'}}>Bank Reconciliation Statement</h2>
        <p className="text-sm text-gray-600">As of {asOfDate}</p>
      </header>

      <main>
        <div className="grid grid-cols-2 gap-x-8 text-xs">
          {/* Bank Side */}
          <div>
            <div className="flex justify-between font-bold border-b-2 border-black pb-1 mb-2">
              <span>Balance as per Bank Statement</span>
              <span>{formatCurrency(reconciliationData.closingBankBalance)}</span>
            </div>
            <p className="font-semibold mt-2">Add: Deposits in Transit</p>
            {reconciliationData.depositsInTransit.length > 0 ? (
                reconciliationData.depositsInTransit.map(tx => (
                    <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>{formatCurrency(tx.debit)}</span></div>
                ))
            ) : <p className="pl-4 text-gray-500 italic">None</p>}

            <p className="font-semibold mt-2">Less: Outstanding Payments</p>
            {reconciliationData.outstandingPayments.length > 0 ? (
                reconciliationData.outstandingPayments.map(tx => (
                    <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>({formatCurrency(tx.credit)})</span></div>
                ))
            ) : <p className="pl-4 text-gray-500 italic">None</p>}
            
            <div className="flex justify-between font-bold border-t-2 border-black pt-1 mt-2">
              <span>Adjusted Bank Balance</span>
              <span>{formatCurrency(reconciliationData.adjustedBankBalance)}</span>
            </div>
          </div>

          {/* Book Side */}
          <div>
            <div className="flex justify-between font-bold border-b-2 border-black pb-1 mb-2">
              <span>Balance as per Company Books</span>
              <span>{formatCurrency(reconciliationData.closingBookBalance)}</span>
            </div>
            <p className="font-semibold mt-2">Add: Bank Credits not in Books</p>
            {reconciliationData.bankCreditsNotInBooks.length > 0 ? (
                reconciliationData.bankCreditsNotInBooks.map(tx => (
                    <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>{formatCurrency(tx.credit)}</span></div>
                ))
            ) : <p className="pl-4 text-gray-500 italic">None</p>}

            <p className="font-semibold mt-2">Less: Bank Debits not in Books</p>
            {reconciliationData.bankDebitsNotInBooks.length > 0 ? (
                reconciliationData.bankDebitsNotInBooks.map(tx => (
                    <div key={tx.id} className="flex justify-between pl-4"><span>{tx.description}</span><span>({formatCurrency(tx.debit)})</span></div>
                ))
            ) : <p className="pl-4 text-gray-500 italic">None</p>}
            
            <div className="flex justify-between font-bold border-t-2 border-black pt-1 mt-2">
              <span>Adjusted Book Balance</span>
              <span>{formatCurrency(reconciliationData.adjustedBookBalance)}</span>
            </div>
          </div>
        </div>

        {/* Difference */}
        <div className={`mt-8 p-3 rounded font-bold text-base flex justify-between ${Math.abs(reconciliationData.adjustedBankBalance - reconciliationData.adjustedBookBalance) < 0.01 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span>DIFFERENCE</span>
          <span>{formatCurrency(reconciliationData.adjustedBankBalance - reconciliationData.adjustedBookBalance)}</span>
        </div>
      </main>
      <footer className="text-center text-xs text-gray-500 mt-auto pt-8 border-t absolute bottom-12 left-12 right-12">
          <p>This is a computer-generated report.</p>
      </footer>
    </div>
  );
};

export default BankReconciliationPDF;
