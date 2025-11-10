import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { PurchaseOrder, GRNItem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';
import { CalendarIcon } from '../../components/icons/CalendarIcon';
import { CubeIcon } from '../../components/icons/CubeIcon';

const CreateGrnPage: React.FC = () => {
    const { purchaseOrderId } = useParams<{ purchaseOrderId: string }>();
    const navigate = useNavigate();
    const { purchaseOrders, addGrn } = useData();
    
    const [po, setPo] = useState<PurchaseOrder | null>(null);
    // Fix: Correct the state type for 'items' to avoid creating a 'never' type for `receivedQuantity`.
    const [items, setItems] = useState<(Omit<GRNItem, 'product' | 'receivedQuantity'> & { product: any, receivedQuantity: string })[]>([]);
    const [grnDate, setGrnDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const foundPo = purchaseOrders.find(p => p.id === purchaseOrderId);
        if (foundPo) {
            setPo(foundPo);
            setItems(foundPo.items.map(item => ({
                product: item.product,
                orderedQuantity: item.quantity,
                receivedQuantity: item.quantity.toString(), // Default to ordered quantity
            })));
        }
    }, [purchaseOrderId, purchaseOrders]);

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index].receivedQuantity = value;
        setItems(newItems);
    };

    const handleSave = () => {
        if (!po) return;

        const finalItems: GRNItem[] = items.map(item => ({
            product: item.product,
            orderedQuantity: item.orderedQuantity,
            receivedQuantity: Number(item.receivedQuantity) || 0,
        })).filter(item => item.receivedQuantity > 0);

        if (finalItems.length === 0) {
            alert('Please enter a received quantity for at least one item.');
            return;
        }

        addGrn({
            purchaseOrderId: po.id,
            purchaseOrderNumber: po.orderNumber,
            supplier: po.supplier,
            grnDate: grnDate,
            items: finalItems,
        }, po.id);

        navigate('/inventory/grn');
    };

    if (!po) {
        // Could show a loading state
        return <Navigate to="/purchases/orders" replace />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                 <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="!p-2">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Goods Received Note (GRN)</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">From Purchase Order: {po.orderNumber}</p>
                </div>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <p className="font-semibold text-gray-500 dark:text-gray-400">Supplier</p>
                        <p className="text-gray-800 dark:text-white font-medium">{po.supplier.name}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-500 dark:text-gray-400">PO Date</p>
                        <p className="text-gray-800 dark:text-white font-medium">{po.orderDate}</p>
                    </div>
                     <div>
                        <label htmlFor="grnDate" className="font-semibold text-gray-500 dark:text-gray-400">GRN Date</label>
                        <Input type="date" id="grnDate" value={grnDate} onChange={e => setGrnDate(e.target.value)} icon={<CalendarIcon />} />
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Items to Receive</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Product</th>
                                <th className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 w-40">Ordered Qty</th>
                                <th className="p-3 text-center font-semibold text-gray-600 dark:text-gray-300 w-48">Received Qty</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                           {items.map((item, index) => (
                             <tr key={item.product.id}>
                               <td className="p-3">{item.product.name}</td>
                               <td className="p-3 text-center">{item.orderedQuantity} {item.product.unit}</td>
                               <td className="p-3">
                                   <Input 
                                      type="number" 
                                      value={item.receivedQuantity}
                                      onChange={e => handleItemChange(index, e.target.value)}
                                      min="0"
                                      icon={<CubeIcon />}
                                    />
                               </td>
                             </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave}>Save GRN & Update Stock</Button>
            </div>
        </div>
    );
};

export default CreateGrnPage;