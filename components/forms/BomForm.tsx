import React, { useState, useEffect, useMemo } from 'react';
import { BOM, BOMItem, Product } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { TrashIcon } from '../icons/TrashIcon';
import { CubeIcon } from '../icons/CubeIcon';

interface BomFormProps {
  bom?: BOM | null;
  products: Product[];
  onSave: (bom: Partial<BOM>) => void;
  onCancel: () => void;
}

type EditableBomItem = { productId: string, quantity: string };

export const BomForm: React.FC<BomFormProps> = ({ bom, products, onSave, onCancel }) => {
  const [finishedProductId, setFinishedProductId] = useState<string>('');
  const [items, setItems] = useState<EditableBomItem[]>([{ productId: '', quantity: '1' }]);
  const isEditing = !!bom;

  useEffect(() => {
    if (isEditing && bom) {
      setFinishedProductId(bom.product.id);
      setItems(bom.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity.toString(),
      })));
    }
  }, [bom, isEditing]);

  const handleItemChange = (index: number, field: keyof EditableBomItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: '1' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishedProductId || items.some(i => !i.productId || !i.quantity || Number(i.quantity) <= 0)) {
        alert('Please select a finished product and ensure all components have a selected product and a valid quantity.');
        return;
    }

    const finalProduct = products.find(p => p.id === finishedProductId);
    if (!finalProduct) {
        alert('Invalid finished product selected.');
        return;
    }

    const finalItems: BOMItem[] = items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return { product: product!, quantity: Number(item.quantity) };
    }).filter(item => item.product);

    onSave({
        product: finalProduct,
        items: finalItems,
    });
  };
  
  // Products available to be selected as the main finished good.
  const availableFinishedProducts = useMemo(() => {
      // In a more complex scenario, you might prevent products already used as components from being finished goods.
      return products;
  }, [products]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label htmlFor="finishedProductId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Finished Product
            </label>
            <select
                id="finishedProductId"
                value={finishedProductId}
                onChange={e => setFinishedProductId(e.target.value)}
                required
                className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
                <option value="">Select a product to build</option>
                {availableFinishedProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>

        <div>
            <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Components</h3>
            <div className="space-y-2">
                {items.map((item, index) => {
                    // Products available for this specific component dropdown.
                    const availableComponentProducts = products.filter(p => {
                        // Exclude the finished product
                        if (p.id === finishedProductId) return false;
                        // Exclude products already used in OTHER component rows
                        const isUsedElsewhere = items.some((it, i) => i !== index && it.productId === p.id);
                        return !isUsedElsewhere;
                    });

                    return (
                        <div key={index} className="flex items-center space-x-2">
                            <select
                                value={item.productId}
                                onChange={e => handleItemChange(index, 'productId', e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Select component</option>
                                {availableComponentProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <Input
                                type="number"
                                placeholder="Qty"
                                value={item.quantity}
                                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                                required
                                min="0.01"
                                step="0.01"
                                className="w-32"
                                icon={<CubeIcon />}
                            />
                            {items.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50">
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )
                })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="mt-2">
                Add Component
            </Button>
        </div>
      
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit">
                Save BOM
            </Button>
        </div>
    </form>
  );
};