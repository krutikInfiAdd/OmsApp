import React from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PrintIcon } from '../../components/icons/PrintIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';

const BomViewPage: React.FC = () => {
  const { bomId } = useParams<{ bomId: string }>();
  const { boms } = useData();

  const bom = boms.find(b => b.id === bomId);

  const handlePrint = () => {
    window.print();
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const totalMaterialCost = React.useMemo(() => {
    if (!bom) return 0;
    return bom.items.reduce((total, item) => total + (item.quantity * item.product.rate), 0);
  }, [bom]);

  if (!bom) {
    return <Navigate to="/production/bom" replace />;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 print-wrapper">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 print:hidden">
          <NavLink to="/production/bom">
             <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to BOMs</span>
             </Button>
          </NavLink>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <NavLink to={`/production/bom/edit/${bom.id}`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </NavLink>
            <Button onClick={handlePrint} className="flex items-center space-x-2">
              <PrintIcon className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        <Card className="p-8 md:p-12 print-card" id="printable-bom">
           <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{bom.product.name}</h1>
                <p className="text-gray-500 dark:text-gray-400">Bill of Materials: {bom.bomNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-600 dark:text-gray-300">Creation Date:</p>
                <p className="text-gray-800 dark:text-white">{bom.creationDate}</p>
              </div>
           </header>

           <main>
             <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Components</h2>
             <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Component Name</th>
                            <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Code</th>
                            <th className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300">Quantity</th>
                            <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">Rate</th>
                            <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">Cost</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {bom.items.map((item, index) => (
                        <tr key={index}>
                            <td className="p-3 font-medium text-gray-800 dark:text-white">{item.product.name}</td>
                            <td className="p-3 text-gray-600 dark:text-gray-300">{item.product.code}</td>
                            <td className="p-3 text-center">{item.quantity} {item.product.unit}</td>
                            <td className="p-3 text-right">{formatCurrency(item.product.rate)}</td>
                            <td className="p-3 text-right font-semibold">{formatCurrency(item.quantity * item.product.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                </table>
             </div>

             <div className="flex justify-end mt-8">
                <div className="w-full max-w-sm space-y-3">
                    <div className="flex justify-between items-center text-xl font-bold border-t-2 border-gray-300 dark:border-gray-600 pt-3 mt-3">
                        <span className="text-gray-900 dark:text-white">Total Material Cost:</span>
                        <span className="text-primary-600 dark:text-primary-400">{formatCurrency(totalMaterialCost)}</span>
                    </div>
                </div>
             </div>
           </main>
        </Card>
      </div>
    </div>
  );
};

export default BomViewPage;
