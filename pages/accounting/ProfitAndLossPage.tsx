import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { AccountType, Account } from '../../types';
import ProfitAndLossPDF from '../../components/pdf/ProfitAndLossPDF';

const ProfitAndLossPage: React.FC = () => {
  const { journalVouchers, chartOfAccounts } = useData();

  const plData = useMemo(() => {
    const balances = new Map<string, number>();
    chartOfAccounts.forEach(acc => balances.set(acc.id, 0));

    journalVouchers.forEach(voucher => {
      voucher.entries.forEach(entry => {
        const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
        if (account) {
          const currentBalance = balances.get(entry.accountId) || 0;
          let newBalance = currentBalance;
          
          switch (account.type) {
            case AccountType.Income:
              newBalance += entry.credit - entry.debit;
              break;
            case AccountType.Expense:
              newBalance += entry.debit - entry.credit;
              break;
            default:
              // Not an income or expense account
              break;
          }
          balances.set(entry.accountId, newBalance);
        }
      });
    });

    const incomeAccounts = chartOfAccounts
      .filter(acc => acc.type === AccountType.Income)
      .map(acc => ({ ...acc, balance: balances.get(acc.id) || 0 }))
      .filter(acc => acc.balance !== 0);

    const expenseAccounts = chartOfAccounts
      .filter(acc => acc.type === AccountType.Expense)
      .map(acc => ({ ...acc, balance: balances.get(acc.id) || 0 }))
      .filter(acc => acc.balance !== 0);

    const salesRevenueAccount = incomeAccounts.find(acc => acc.name.toLowerCase().includes('sales'));
    const otherIncomeAccounts = incomeAccounts.filter(acc => !acc.name.toLowerCase().includes('sales'));
    const totalRevenue = incomeAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    const cogsAccount = expenseAccounts.find(acc => acc.name.toLowerCase().includes('cost of goods sold'));
    const otherExpenseAccounts = expenseAccounts.filter(acc => !acc.name.toLowerCase().includes('cost of goods sold'));
    const totalCOGS = cogsAccount?.balance || 0;
    const totalOtherExpenses = otherExpenseAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    const grossProfit = totalRevenue - totalCOGS;
    const netProfitOrLoss = grossProfit - totalOtherExpenses;

    return {
      salesRevenueAccount,
      otherIncomeAccounts,
      totalRevenue,
      cogsAccount,
      totalCOGS,
      grossProfit,
      otherExpenseAccounts,
      totalOtherExpenses,
      netProfitOrLoss,
    };
  }, [journalVouchers, chartOfAccounts]);

  const handleDownloadPdf = async () => {
    const reportDate = new Date().toLocaleDateString('en-CA');
    const companyName = "Zenith Innovations Inc."; // Assuming the main company
    
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '794px'; 
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);
    root.render(
      <ProfitAndLossPDF 
        plData={plData}
        asOfDate={reportDate}
        companyName={companyName}
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
    
    let finalHeight = imgHeight;
    if (imgHeight > pdfHeight) {
        console.warn("P&L content is taller than a single page. Content will be scaled to fit.");
        finalHeight = pdfHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
    pdf.save(`profit-and-loss-${reportDate}.pdf`);
  };

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
      <div className={`flex justify-between py-2 border-t ${isMajor ? 'border-gray-800 dark:border-gray-300 font-bold text-base' : 'border-gray-300 dark:border-gray-600 font-semibold'}`}>
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profit & Loss Statement</h1>
            <Button onClick={handleDownloadPdf} className="flex items-center space-x-2">
              <PrintIcon className="h-4 w-4" />
              <span>Print / PDF</span>
            </Button>
        </div>

        <Card className="p-8 md:p-12 print-card">
            <header className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zenith Innovations Inc.</h2>
                 <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Profit & Loss Statement</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">For the period ending {new Date().toLocaleDateString('en-CA')}</p>
            </header>

            <div className="space-y-4">
              {/* Revenue Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue</h3>
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
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cost of Goods Sold</h3>
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
                 <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Operating Expenses</h3>
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
              <div className={`flex justify-between py-3 border-t-4 mt-4 font-bold text-xl ${plData.netProfitOrLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <span>Net {plData.netProfitOrLoss >= 0 ? 'Profit' : 'Loss'}</span>
                <span>{formatCurrency(plData.netProfitOrLoss)}</span>
              </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfitAndLossPage;