import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { AccountType, Account } from '../../types';
import { Input } from '../../components/ui/Input';
import { CalendarIcon } from '../../components/icons/CalendarIcon';

const BalanceSheetPage: React.FC = () => {
  const { journalVouchers, chartOfAccounts } = useData();
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    window.print();
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

  const accountBalances = useMemo(() => {
    const balances = new Map<string, number>();
    chartOfAccounts.forEach(acc => balances.set(acc.id, 0));

    const relevantVouchers = journalVouchers.filter(voucher => voucher.date <= asOfDate);

    relevantVouchers.forEach(voucher => {
      voucher.entries.forEach(entry => {
        const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
        if (account) {
          const currentBalance = balances.get(entry.accountId) || 0;
          let newBalance = currentBalance;
          
          switch (account.type) {
            case AccountType.Asset:
            case AccountType.Expense:
              newBalance += entry.debit - entry.credit;
              break;
            case AccountType.Liability:
            case AccountType.Equity:
            case AccountType.Income:
              newBalance += entry.credit - entry.debit;
              break;
          }
          balances.set(entry.accountId, newBalance);
        }
      });
    });

    const categorizedAccounts: {
      assets: (Account & { balance: number })[];
      liabilities: (Account & { balance: number })[];
      equity: (Account & { balance: number })[];
      income: (Account & { balance: number })[];
      expenses: (Account & { balance: number })[];
    } = {
      assets: [],
      liabilities: [],
      equity: [],
      income: [],
      expenses: [],
    };

    balances.forEach((balance, accountId) => {
      const account = chartOfAccounts.find(acc => acc.id === accountId);
      if (account) {
        const accountWithBalance = { ...account, balance };
        switch (account.type) {
          case AccountType.Asset:
            if(Math.abs(balance) > 0.001) categorizedAccounts.assets.push(accountWithBalance);
            break;
          case AccountType.Liability:
            if(Math.abs(balance) > 0.001) categorizedAccounts.liabilities.push(accountWithBalance);
            break;
          case AccountType.Equity:
            if(Math.abs(balance) > 0.001) categorizedAccounts.equity.push(accountWithBalance);
            break;
          case AccountType.Income:
             categorizedAccounts.income.push(accountWithBalance);
            break;
          case AccountType.Expense:
             categorizedAccounts.expenses.push(accountWithBalance);
            break;
        }
      }
    });

    const totalIncome = categorizedAccounts.income.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpenses = categorizedAccounts.expenses.reduce((sum, acc) => sum + acc.balance, 0);
    const netIncome = totalIncome - totalExpenses;

    const totalAssets = Array.from(balances.entries())
        .filter(([accountId]) => chartOfAccounts.find(a => a.id === accountId)?.type === AccountType.Asset)
        .reduce((sum, [, balance]) => sum + balance, 0);

    const totalLiabilities = Array.from(balances.entries())
        .filter(([accountId]) => chartOfAccounts.find(a => a.id === accountId)?.type === AccountType.Liability)
        .reduce((sum, [, balance]) => sum + balance, 0);
        
    const initialEquity = Array.from(balances.entries())
        .filter(([accountId]) => chartOfAccounts.find(a => a.id === accountId)?.type === AccountType.Equity)
        .reduce((sum, [, balance]) => sum + balance, 0);

    const totalEquity = initialEquity + netIncome;
    
    return {
        assets: categorizedAccounts.assets,
        liabilities: categorizedAccounts.liabilities,
        equity: categorizedAccounts.equity,
        netIncome,
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
    };
  }, [journalVouchers, chartOfAccounts, asOfDate]);

  const BalanceSheetSection: React.FC<{ title: string, accounts: (Account & { balance: number })[] }> = ({ title, accounts }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-2">{title}</h3>
      <ul className="space-y-1 text-sm">
        {accounts.map(account => (
          <li key={account.id} className="flex justify-between py-1">
            <span>{account.name}</span>
            <span>{formatCurrency(account.balance)}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Balance Sheet</h1>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center">
                    <label htmlFor="asOfDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 whitespace-nowrap">As of Date</label>
                    <Input 
                        type="date" 
                        id="asOfDate" 
                        value={asOfDate} 
                        onChange={e => setAsOfDate(e.target.value)} 
                        className="w-auto"
                        icon={<CalendarIcon />}
                    />
                </div>
                <Button onClick={handlePrint} className="flex items-center space-x-2">
                  <PrintIcon className="h-4 w-4" />
                  <span>Print / PDF</span>
                </Button>
            </div>
        </div>

        <Card className="p-8 md:p-12 print-card">
            <header className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Zenith Innovations Inc.</h2>
                 <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Balance Sheet</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">As of {asOfDate}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                {/* Liabilities and Equity Side */}
                <div className="flex flex-col">
                    <BalanceSheetSection title="Liabilities" accounts={accountBalances.liabilities} />
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-2">Equity</h3>
                        <ul className="space-y-1 text-sm">
                            {accountBalances.equity.map(account => (
                                <li key={account.id} className="flex justify-between py-1">
                                    <span>{account.name}</span>
                                    <span>{formatCurrency(account.balance)}</span>
                                </li>
                            ))}
                            <li className="flex justify-between py-1">
                                <span>Net Income / (Loss)</span>
                                <span>{formatCurrency(accountBalances.netIncome)}</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="mt-auto border-t-2 border-gray-800 dark:border-gray-300 pt-2 font-bold">
                        <div className="flex justify-between text-lg">
                            <span>Total Liabilities & Equity</span>
                            <span>{formatCurrency(accountBalances.totalLiabilitiesAndEquity)}</span>
                        </div>
                    </div>
                </div>

                {/* Assets Side */}
                <div className="flex flex-col mt-8 md:mt-0">
                    <BalanceSheetSection title="Assets" accounts={accountBalances.assets} />
                     <div className="mt-auto border-t-2 border-gray-800 dark:border-gray-300 pt-2 font-bold">
                        <div className="flex justify-between text-lg">
                            <span>Total Assets</span>
                            <span>{formatCurrency(accountBalances.totalAssets)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default BalanceSheetPage;