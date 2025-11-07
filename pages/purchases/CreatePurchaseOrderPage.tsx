import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';
import { PurchaseOrderItem, PurchaseOrderStatus, PurchaseOrder } from '../../types';
import { TrashIcon } from '../../components/icons/TrashIcon';

type EditablePurchaseOrderItem = Omit<Partial<PurchaseOrderItem>, 'product'> & { productId?: string };

const CreatePurchaseOrderPage: React.FC = () => {
  const { suppliers, products, taxes, addPurchaseOrder, purchaseOrders } = useData();
  const navigate = useNavigate();

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<EditablePurchaseOrderItem[]>([{}]);

  const selectedSupplier = useMemo(() => {
    return suppliers.find(s => s.id === selectedSupplierId);
  }, [selectedSupplierId, suppliers]);

  const handleItemChange = (index: number, field: keyof EditablePurchaseOrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].rate = product.rate;
        const tax = taxes.find(t => t.id === product.taxId);
        newItems[index].tax = tax?.rate || 0;
      }
    }
    setItems(newItems);
  };
  
  const handleAddItem = () => {
    setItems([...items, {}]);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const { subtotal, taxSummary, grandTotal } = useMemo(() => {
    let subtotal = 0;
    const taxSummary: { [rate: number]: number } = {};

    items.forEach(item => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const amount = quantity * rate;
        subtotal += amount;

        if (item.tax) {
            const taxRate = Number(item.tax);
            const taxAmount = amount * (taxRate / 100);
            taxSummary[taxRate] = (taxSummary[taxRate] || 0) + taxAmount;
        }
    });

    const totalTax = Object.values(taxSummary).reduce((acc, val) => acc + val, 0);
    const grandTotal = subtotal + totalTax;

    return { subtotal, taxSummary, grandTotal };
  }, [items]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  
  const handleSave = (status: PurchaseOrderStatus) => {
    if (!selectedSupplierId || items.length === 0) {
        alert("Please select a supplier and add at least one item.");
        return;
    }

    const finalItems: PurchaseOrderItem[] = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Invalid product selected");
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const tax = Number(item.tax) || 0;
        const totalWithTax = (quantity * rate) * (1 + (tax / 100));

        return { product, quantity, rate, tax, total: totalWithTax };
    }).filter(item => item.quantity > 0 && item.rate > 0);

    if (finalItems.length === 0) {
        alert("Please ensure all items have valid quantity and rate.");
        return;
    }

    const newOrder: PurchaseOrder = {
        id: `PO${Date.now()}`,
        orderNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
        supplier: selectedSupplier!,
        orderDate: orderDate,
        expectedDeliveryDate: expectedDeliveryDate,
        amount: grandTotal,
        status: status,
        items: finalItems,
    };

    addPurchaseOrder(newOrder);
    navigate('/purchases/orders');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Purchase Order</h1>
        <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleSave(PurchaseOrderStatus.Draft)}>Save as Draft</Button>
            <Button onClick={() => handleSave(PurchaseOrderStatus.Approved)}>Save & Approve</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier</label>
                    <select
                        value={selectedSupplierId}
                        onChange={(e) => setSelectedSupplierId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Select a supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {selectedSupplier && (
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-semibold">{selectedSupplier.name}</p>
                            <p>{selectedSupplier.address}</p>
                            <p>GSTIN: {selectedSupplier.gstin}</p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase text-gray-800 dark:text-white">Purchase Order</h2>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                         <div>
                            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                            <Input type="date" id="orderDate" value={orderDate} onChange={e => setOrderDate(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="expectedDeliveryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Date</label>
                            <Input type="date" id="expectedDeliveryDate" value={expectedDeliveryDate} onChange={e => setExpectedDeliveryDate(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
          </Card>
          <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 pr-2">Product/Service</th>
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 px-2 w-20">Qty</th>
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 px-2 w-28">Rate</th>
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 px-2 w-24">Tax %</th>
                            <th className="text-right text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 pl-2 w-32">Amount</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const quantity = Number(item.quantity) || 0;
                            const rate = Number(item.rate) || 0;
                            const tax = Number(item.tax) || 0;
                            const finalAmount = (quantity * rate) * (1 + (tax / 100));

                            return (
                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="py-2 pr-2">
                                        <select
                                            value={item.productId || ''}
                                            onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </td>
                                    <td className="py-2 px-2"><Input type="number" placeholder="1" value={item.quantity || ''} onChange={e => handleItemChange(index, 'quantity', e.target.value)} /></td>
                                    <td className="py-2 px-2"><Input type="number" placeholder="0.00" value={item.rate || ''} onChange={e => handleItemChange(index, 'rate', e.target.value)} /></td>
                                    <td className="py-2 px-2">
                                        <Input
                                            type="number"
                                            value={item.tax ?? ''}
                                            disabled
                                            className="bg-gray-100 dark:bg-gray-800"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="py-2 pl-2 text-right text-gray-900 dark:text-white">{formatCurrency(finalAmount)}</td>
                                    <td className="py-2 text-center">
                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(index)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <Button variant="outline" className="mt-4" onClick={handleAddItem}>Add Item</Button>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                    </div>
                     {Object.entries(taxSummary).map(([rate, amount]) => (
                        <div key={rate} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">GST @ {rate}%</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(amount as number)}</span>
                        </div>
                     ))}
                     <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                     <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900 dark:text-white">Grand Total</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(grandTotal)}</span>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;