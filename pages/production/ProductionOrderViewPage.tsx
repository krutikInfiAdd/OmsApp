import React, { useState, useMemo } from 'react';
import { useParams, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon';
import { Badge } from '../../components/ui/Badge';
import { ProductionOrderStatus } from '../../types';
import { Input } from '../../components/ui/Input';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Modal } from '../../components/ui/Modal';
import { CubeIcon } from '../../components/icons/CubeIcon';

const ProductionOrderViewPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { productionOrders, boms, products, updateProductionOrderStatus } = useData();

    const [isConfirmStartOpen, setIsConfirmStartOpen] = useState(false);
    const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);
    const [actualQty, setActualQty] = useState('');

    const order = useMemo(() => productionOrders.find(o => o.id === orderId), [orderId, productionOrders]);
    const bom = useMemo(() => order ? boms.find(b => b.id === order.bomId) : null, [order, boms]);

    const componentRequirements = useMemo(() => {
        if (!bom || !order) return [];
        return bom.items.map(item => {
            const required = item.quantity * order.quantityToProduce;
            const available = products.find(p => p.id === item.product.id)?.stock || 0;
            return {
                ...item,
                required,
                available,
                sufficient: available >= required
            };
        });
    }, [bom, order, products]);

    if (!order || !bom) {
        // Could show loading state while finding
        return <Navigate to="/production/orders" replace />;
    }

    const handleStartProduction = () => {
        updateProductionOrderStatus(order.id, ProductionOrderStatus.InProgress);
        setIsConfirmStartOpen(false);
    };

    const handleCompleteProduction = () => {
        const qty = actualQty ? Number(actualQty) : order.quantityToProduce;
        updateProductionOrderStatus(order.id, ProductionOrderStatus.Completed, qty);
        setIsConfirmCompleteOpen(false);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <NavLink to="/production/orders">
                        <Button variant="outline" className="flex items-center space-x-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            <span>Back to Orders</span>
                        </Button>
                    </NavLink>
                    <div className="flex space-x-2 mt-4 sm:mt-0">
                        {order.status === ProductionOrderStatus.Planned && (
                            <Button onClick={() => setIsConfirmStartOpen(true)}>Start Production</Button>
                        )}
                        {order.status === ProductionOrderStatus.InProgress && (
                            <Button onClick={() => { setActualQty(order.quantityToProduce.toString()); setIsConfirmCompleteOpen(true); }}>Mark as Complete</Button>
                        )}
                    </div>
                </div>

                <Card className="p-8">
                    <header className="flex justify-between items-start pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{bom.product.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">Production Order: {order.orderNumber}</p>
                        </div>
                        <div className="text-right">
                            <Badge status={order.status} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Qty: <span className="font-semibold">{order.quantityToProduce}</span></p>
                        </div>
                    </header>
                    
                    <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                        <div><span className="font-semibold text-gray-500">Order Date:</span> {order.orderDate}</div>
                        <div><span className="font-semibold text-gray-500">Expected Completion:</span> {order.expectedCompletionDate}</div>
                        {order.status === ProductionOrderStatus.Completed && (
                            <div><span className="font-semibold text-gray-500">Qty Produced:</span> {order.actualQuantityProduced}</div>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Required Components</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-3 text-left font-semibold text-gray-600 dark:text-gray-300">Component</th>
                                    <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">Required Qty</th>
                                    <th className="p-3 text-right font-semibold text-gray-600 dark:text-gray-300">Stock Before Production</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {componentRequirements.map(comp => (
                                    <tr key={comp.product.id}>
                                        <td className="p-3">{comp.product.name}</td>
                                        <td className="p-3 text-right">{comp.required} {comp.product.unit}</td>
                                        <td className="p-3 text-right">{comp.available} {comp.product.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <ConfirmationModal
                isOpen={isConfirmStartOpen}
                onClose={() => setIsConfirmStartOpen(false)}
                onConfirm={handleStartProduction}
                title="Start Production?"
                message="This will deduct the required components from your inventory. This action cannot be undone."
                confirmButtonText="Yes, Start Production"
            />
            <Modal isOpen={isConfirmCompleteOpen} onClose={() => setIsConfirmCompleteOpen(false)} title="Complete Production Order">
                 <div className="space-y-4">
                    <p>Enter the actual quantity produced. This will add the finished goods to your inventory.</p>
                    <div>
                        <label htmlFor="actualQty" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Actual Quantity Produced</label>
                        <Input id="actualQty" type="number" value={actualQty} onChange={e => setActualQty(e.target.value)} required min="0" className="mt-1" icon={<CubeIcon />} />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsConfirmCompleteOpen(false)}>Cancel</Button>
                        <Button onClick={handleCompleteProduction}>Confirm Completion</Button>
                    </div>
                 </div>
            </Modal>
        </div>
    );
};

export default ProductionOrderViewPage;