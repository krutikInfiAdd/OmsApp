import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BOM } from '../../types';
import { CubeIcon } from '../../components/icons/CubeIcon';
import { CalendarIcon } from '../../components/icons/CalendarIcon';

const CreateProductionOrderPage: React.FC = () => {
    const { boms, products, addProductionOrder } = useData();
    const navigate = useNavigate();

    const [selectedBomId, setSelectedBomId] = useState<string>('');
    const [quantity, setQuantity] = useState('1');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [expectedDate, setExpectedDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    });

    const selectedBom = useMemo(() => boms.find(b => b.id === selectedBomId), [boms, selectedBomId]);

    const componentRequirements = useMemo(() => {
        if (!selectedBom) return [];
        const qty = Number(quantity) || 0;
        return selectedBom.items.map(item => {
            const required = item.quantity * qty;
            const available = products.find(p => p.id === item.product.id)?.stock || 0;
            return {
                ...item,
                required,
                available,
                sufficient: available >= required
            };
        });
    }, [selectedBom, quantity, products]);
    
    const canProduce = componentRequirements.every(c => c.sufficient);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBomId || Number(quantity) <= 0) {
            alert('Please select a product and enter a valid quantity.');
            return;
        }

        if (!canProduce) {
            if (!window.confirm('There is insufficient stock for some components. Do you want to create the production order anyway?')) {
                return;
            }
        }
        
        addProductionOrder({
            bomId: selectedBomId,
            quantityToProduce: Number(quantity),
            orderDate,
            expectedCompletionDate: expectedDate,
        });

        navigate('/production/orders');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">New Production Order</h1>
                <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/production/orders')}>Cancel</Button>
                    <Button type="submit">Create Order</Button>
                </div>
            </div>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="bomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product to Produce</label>
                        <select
                            id="bomId"
                            value={selectedBomId}
                            onChange={e => setSelectedBomId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Select a product with a BOM</option>
                            {boms.map(b => <option key={b.id} value={b.id}>{b.product.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity to Produce</label>
                        <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" className="mt-1" icon={<CubeIcon />} />
                    </div>
                    <div>
                        <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                        <Input id="orderDate" type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)} required className="mt-1" icon={<CalendarIcon />} />
                    </div>
                    <div>
                        <label htmlFor="expectedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Completion</label>
                        <Input id="expectedDate" type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} required className="mt-1" icon={<CalendarIcon />} />
                    </div>
                </div>
            </Card>

            {selectedBom && (
                <Card>
                    <h3 className="text-lg font-semibold mb-4">Required Components</h3>
                    {!canProduce && <p className="mb-4 p-3 bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-md text-sm">Warning: Insufficient stock for one or more components.</p>}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="p-2 text-left font-semibold text-gray-600 dark:text-gray-300">Component</th>
                                    <th className="p-2 text-right font-semibold text-gray-600 dark:text-gray-300">Required</th>
                                    <th className="p-2 text-right font-semibold text-gray-600 dark:text-gray-300">Available</th>
                                    <th className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentRequirements.map(comp => (
                                    <tr key={comp.product.id}>
                                        <td className="p-2">{comp.product.name}</td>
                                        <td className="p-2 text-right">{comp.required} {comp.product.unit}</td>
                                        <td className="p-2 text-right">{comp.available} {comp.product.unit}</td>
                                        <td className="p-2 text-center">
                                            {comp.sufficient ? <span className="text-green-600">✓ In Stock</span> : <span className="text-red-600">✗ Shortage</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </form>
    );
};

export default CreateProductionOrderPage;