import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { BOM } from '../../types';
import { BomForm } from '../../components/forms/BomForm';
import { Card } from '../../components/ui/Card';

const CreateBomPage: React.FC = () => {
    const { products, addBom } = useData();
    const navigate = useNavigate();

    const handleSave = (bomData: Partial<BOM>) => {
        addBom(bomData);
        navigate('/production/bom');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Bill of Materials</h1>
            <Card>
                <BomForm 
                    onSave={handleSave} 
                    onCancel={() => navigate('/production/bom')} 
                    products={products} 
                />
            </Card>
        </div>
    );
};

export default CreateBomPage;
