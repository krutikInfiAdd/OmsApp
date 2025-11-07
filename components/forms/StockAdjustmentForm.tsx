import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface StockAdjustmentFormProps {
  product: Product;
  onSave: (newStock: number) => void;
  onCancel: () => void;
}

export const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ product, onSave, onCancel }) => {
  const [newStock, setNewStock] = useState(product.stock.toString());

  useEffect(() => {
    setNewStock(product.stock.toString());
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Number(newStock));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h4 className="font-medium text-lg text-gray-800 dark:text-white">{product.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock: {product.stock} {product.unit}</p>
      </div>
      <div>
        <label htmlFor="newStock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          New Stock Quantity
        </label>
        <Input
          type="number"
          name="newStock"
          id="newStock"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          required
          className="mt-1"
          min="0"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
