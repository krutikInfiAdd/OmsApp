import React from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { BOM } from '../../types';
import { BomForm } from '../../components/forms/BomForm';
import { Card } from '../../components/ui/Card';

const EditBomPage: React.FC = () => {
    const { bomId } = useParams<{ bomId: string }>();
    const { products, boms, updateBom } = useData();
    const navigate = useNavigate();

    const bomToEdit = boms.find(b => b.id === bomId);

    const handleSave = (bomData: Partial<BOM>) => {
        if (bomId) {
            updateBom(bomId, bomData);
        }
        navigate('/production/bom');
    };

    if (!bomToEdit) {
        return <Navigate to="/production/bom" replace />;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Bill of Materials</h1>
            <Card>
                <BomForm
                    bom={bomToEdit}
                    onSave={handleSave} 
                    onCancel={() => navigate('/production/bom')} 
                    products={products} 
                />
            </Card>
        </div>
    );
};

export default EditBomPage;
