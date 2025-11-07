import React from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';
import { CreditDebitNoteType } from '../../types';

const CreditDebitNoteViewPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const { creditDebitNotes, companies } = useData();

  const note = creditDebitNotes.find(n => n.id === noteId);
  const company = note ? companies.find(c => c.id === note.customer.companyId) || companies[0] : null;

  const handlePrint = () => {
    window.print();
  };

  if (!note) {
    return <Navigate to="/accounting/credit-debit-notes" replace />;
  }

  const isCredit = note.type === CreditDebitNoteType.Credit;
  const title = isCredit ? 'Credit Note' : 'Debit Note';
  const titleColor = isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
          <NavLink to="/accounting/credit-debit-notes">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Notes</span>
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
              {company && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{company.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">GSTIN: {company.gstin}</p>
                </>
              )}
            </div>
            <div className="text-right">
              <h1 className={`text-4xl font-bold uppercase ${titleColor}`}>{title}</h1>
              <p className="text-gray-500 dark:text-gray-400">{note.noteNumber}</p>
              <div className="mt-2"><Badge status={note.status} /></div>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Details for</h3>
              <p className="font-bold text-gray-800 dark:text-white">{note.customer.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{note.customer.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">GSTIN: {note.customer.gstin}</p>
            </div>
            <div className="text-right">
              <div className="grid grid-cols-2 gap-x-4">
                <span className="font-semibold text-gray-600 dark:text-gray-300">Issue Date:</span>
                <span className="text-gray-800 dark:text-white">{note.issueDate}</span>
                {note.invoiceId && (
                  <>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Original Invoice:</span>
                    <span className="text-gray-800 dark:text-white">{note.invoiceId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
             <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Reason</h3>
             <p className="text-gray-800 dark:text-white">{note.reason}</p>
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-full max-w-sm space-y-3">
               <div className={`flex justify-between items-center text-2xl font-bold border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3`}>
                  <span className="text-gray-900 dark:text-white">Amount:</span>
                  <span className={titleColor}>{formatCurrency(note.amount)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreditDebitNoteViewPage;
