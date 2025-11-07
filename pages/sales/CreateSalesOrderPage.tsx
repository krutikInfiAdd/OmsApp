import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';
import { SalesOrderItem, SalesOrderStatus, SalesOrder, DiscountType } from '../../types';
import { TrashIcon } from '../../components/icons/TrashIcon';

type EditableSalesOrderItem = Omit<Partial<SalesOrderItem>, 'product'> & { productId?: string };

const CreateSalesOrderPage: React.FC = () => {
  const { customers, products, taxes, addSalesOrder, salesOrders } = useData();
  const navigate = useNavigate();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [shipmentDate, setShipmentDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });
  const [items, setItems] = useState<EditableSalesOrderItem[]>([{}]);
  
  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId);
  }, [selectedCustomerId, customers]);

  const handleItemChange = (index: number, field: keyof EditableSalesOrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].rate = product.rate;
        const tax = taxes.find(t => t.id === product.taxId);
        newItems[index].tax = tax?.rate || 0;
        newItems[index].discountValue = 0;
        newItems[index].discountType = 'percentage';
      }
    }
    setItems(newItems);
  };
  
  const handleAddItem = () => {
    setItems([...items, { discountType: 'percentage', discountValue: 0 }]);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };
  
  const { subtotal, taxSummary, grandTotal, totalDiscount, preDiscountSubtotal } = useMemo(() => {
    let preDiscountSubtotal = 0;
    let postDiscountSubtotal = 0;
    const taxSummary: { [rate: number]: number } = {};

    items.forEach(item => {
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const discountValue = Number(item.discountValue) || 0;
        const discountType = item.discountType || 'percentage';
        
        const itemTotalBeforeDiscount = quantity * rate;
        preDiscountSubtotal += itemTotalBeforeDiscount;

        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = itemTotalBeforeDiscount * (discountValue / 100);
        } else {
            discountAmount = Math.min(discountValue, itemTotalBeforeDiscount);
        }

        const discountedAmount = itemTotalBeforeDiscount - discountAmount;
        postDiscountSubtotal += discountedAmount;

        if (item.tax) {
            const taxRate = Number(item.tax);
            const taxAmount = discountedAmount * (taxRate / 100);
            taxSummary[taxRate] = (taxSummary[taxRate] || 0) + taxAmount;
        }
    });

    const totalTax = Object.values(taxSummary).reduce((acc, val) => acc + val, 0);
    const grandTotal = postDiscountSubtotal + totalTax;
    const totalDiscount = preDiscountSubtotal - postDiscountSubtotal;

    return { subtotal: postDiscountSubtotal, taxSummary, grandTotal, totalDiscount, preDiscountSubtotal };
  }, [items]);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  
  const handleSave = (status: SalesOrderStatus) => {
    if (!selectedCustomerId || items.length === 0) {
        alert("Please select a customer and add at least one item.");
        return;
    }

    const finalItems: SalesOrderItem[] = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Invalid product selected");
        const quantity = Number(item.quantity) || 0;
        const rate = Number(item.rate) || 0;
        const discountValue = Number(item.discountValue) || 0;
        const discountType = item.discountType || 'percentage';
        const tax = Number(item.tax) || 0;
        
        const itemTotalBeforeDiscount = quantity * rate;
        let discountAmount = 0;
        if (discountType === 'percentage') {
            discountAmount = itemTotalBeforeDiscount * (discountValue / 100);
        } else {
            discountAmount = Math.min(discountValue, itemTotalBeforeDiscount);
        }
        const discountedAmount = itemTotalBeforeDiscount - discountAmount;
        const totalWithTax = discountedAmount * (1 + (tax / 100));

        return {
            product: product,
            quantity: quantity,
            rate: rate,
            discountValue: discountValue,
            discountType: discountType as DiscountType,
            tax: tax,
            total: totalWithTax,
        }
    }).filter(item => item.quantity > 0 && item.rate > 0);

    if (finalItems.length === 0) {
        alert("Please ensure all items have valid quantity and rate.");
        return;
    }

    const newOrder: SalesOrder = {
        id: `SO${Date.now()}`,
        orderNumber: `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`,
        customer: selectedCustomer!,
        orderDate: orderDate,
        shipmentDate: shipmentDate,
        amount: grandTotal,
        status: status,
        items: finalItems,
    };

    addSalesOrder(newOrder);
    navigate('/sales/orders');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Sales Order</h1>
        <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleSave(SalesOrderStatus.Draft)}>Save as Draft</Button>
            <Button onClick={() => handleSave(SalesOrderStatus.Confirmed)}>Confirm Order</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
                    <select
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Select a customer</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {selectedCustomer && (
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                            <p className="font-semibold">{selectedCustomer.name}</p>
                            <p>{selectedCustomer.address}</p>
                            <p>{selectedCustomer.city}, {selectedCustomer.state}</p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase text-gray-800 dark:text-white">Sales Order</h2>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                         <div>
                            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Date</label>
                            <Input type="date" id="orderDate" value={orderDate} onChange={e => setOrderDate(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="shipmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipment Date</label>
                            <Input type="date" id="shipmentDate" value={shipmentDate} onChange={e => setShipmentDate(e.target.value)} />
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
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 px-2 w-36">Discount</th>
                            <th className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 px-2 w-24">Tax %</th>
                            <th className="text-right text-sm font-semibold text-gray-600 dark:text-gray-300 py-2 pl-2 w-32">Amount</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const quantity = Number(item.quantity) || 0;
                            const rate = Number(item.rate) || 0;
                            const discountValue = Number(item.discountValue) || 0;
                            const discountType = item.discountType || 'percentage';
                            const tax = Number(item.tax) || 0;

                            const amount = quantity * rate;
                            let discountAmount = 0;
                            if (discountType === 'percentage') {
                                discountAmount = amount * (discountValue / 100);
                            } else {
                                discountAmount = Math.min(discountValue, amount);
                            }
                           
                            const discountedAmount = amount - discountAmount;
                            const taxAmount = discountedAmount * (tax / 100);
                            const finalAmount = discountedAmount + taxAmount;

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
                                        <div className="flex items-center">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={item.discountValue || ''}
                                                onChange={e => handleItemChange(index, 'discountValue', e.target.value)}
                                                className="rounded-r-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleItemChange(index, 'discountType', item.discountType === 'percentage' ? 'fixed' : 'percentage')}
                                                className="px-2 h-[38px] border border-l-0 border-gray-300 rounded-r-md bg-gray-50 dark:bg-gray-600 dark:border-gray-500 text-sm font-medium"
                                                aria-label="Toggle discount type"
                                            >
                                                {item.discountType === 'fixed' ? '₹' : '%'}
                                            </button>
                                        </div>
                                    </td>
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
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(preDiscountSubtotal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <span className="font-medium text-red-500">- {formatCurrency(totalDiscount)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                         <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Taxable Amount</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                        </div>
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

export default CreateSalesOrderPage;