import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { AccountType } from '../../types';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';

const YearEndClosingPage: React.FC = () => {
    const { journalVouchers, chartOfAccounts, performYearEndClosing } = useData();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const financialYear = 2024;

    const { netProfit, totalIncome, totalExpenses } = useMemo(() => {
        const balances = new Map<string, number>();
        chartOfAccounts.forEach(acc => balances.set(acc.id, 0));

        const relevantVouchers = journalVouchers.filter(jv => jv.date.startsWith(financialYear.toString()));

        relevantVouchers.forEach(voucher => {
            voucher.entries.forEach(entry => {
                const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
                if (account) {
                    const currentBalance = balances.get(entry.accountId) || 0;
                    if (account.type === AccountType.Income) {
                        balances.set(entry.accountId, currentBalance + entry.credit - entry.debit);
                    } else if (account.type === AccountType.Expense) {
                        balances.set(entry.accountId, currentBalance + entry.debit - entry.credit);
                    }
                }
            });
        });

        let totalIncome = 0;
        let totalExpenses = 0;
        balances.forEach((balance, accountId) => {
            const account = chartOfAccounts.find(acc => acc.id === accountId);
            if (account) {
                if (account.type === AccountType.Income) totalIncome += balance;
                if (account.type === AccountType.Expense) totalExpenses += balance;
            }
        });

        return { netProfit: totalIncome - totalExpenses, totalIncome, totalExpenses };
    }, [journalVouchers, chartOfAccounts, financialYear]);

    const handleCloseYear = () => {
        performYearEndClosing(financialYear);
        setIsClosed(true);
        setIsConfirmOpen(false);
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Year-End Closing</h1>

            <Card>
                <h2 className="text-xl font-semibold mb-2">About the Year-End Closing Process</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    The year-end closing process is a critical accounting step performed at the end of a financial year. This automated process will perform the following actions:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                    <li>Calculate the Net Profit or Loss for the year by summarizing all income and expense accounts.</li>
                    <li>Create a <span className="font-semibold">Closing Journal Voucher</span> on the last day of the year ({financialYear}-12-31) to transfer the net profit/loss to the "Retained Earnings" account.</li>
                    <li>Create an <span className="font-semibold">Opening Balance Voucher</span> on the first day of the next year ({financialYear + 1}-01-01) to carry forward all asset, liability, and equity balances.</li>
                </ul>
                <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-lg">
                    <p className="font-bold">Important: This action is irreversible for the selected financial year. Please ensure all transactions for the year have been entered before proceeding.</p>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Financial Summary for {financialYear}</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600 dark:text-gray-400">Total Income:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span className="text-gray-600 dark:text-gray-400">Total Expenses:</span>
                        <span className="font-semibold text-red-600">({formatCurrency(totalExpenses)})</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t-2 pt-3 mt-3">
                        <span>Net {netProfit >= 0 ? 'Profit' : 'Loss'} to be Transferred:</span>
                        <span className={netProfit >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>{formatCurrency(netProfit)}</span>
                    </div>
                </div>
            </Card>

            {isClosed ? (
                <div className="p-6 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg flex items-center space-x-4">
                    <CheckCircleIcon className="h-8 w-8" />
                    <div>
                        <h3 className="font-bold text-lg">Year {financialYear} has been successfully closed.</h3>
                        <p>A closing voucher and an opening balance voucher for {financialYear + 1} have been created in the Journal Vouchers section.</p>
                    </div>
                </div>
            ) : (
                <div className="flex justify-end">
                    <Button variant="danger" size="lg" onClick={() => setIsConfirmOpen(true)} disabled={isClosed}>
                        Start Year-End Closing for {financialYear}
                    </Button>
                </div>
            )}

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleCloseYear}
                title={`Confirm Closing for Year ${financialYear}`}
                message={`Are you absolutely sure you want to close the books for ${financialYear}? This will generate final closing entries and cannot be undone.`}
                confirmButtonText="Yes, Close the Year"
            />
        </div>
    );
};

export default YearEndClosingPage;
