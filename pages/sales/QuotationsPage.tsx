import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Quotation, Column, QuotationStatus } from '../../types';
import { useData } from '../../contexts/DataContext';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { ConvertIcon } from '../../components/icons/ConvertIcon';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import QuotationPDF from '../../components/pdf/QuotationPDF';

const QuotationsPage: React.FC = () => {
  const { quotations, companies, deleteQuotation } = useData();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const handleDownloadPdf = async (quotation: Quotation) => {
    const company = companies.find(c => c.id === quotation.customer.companyId) || companies[0];

    if (!company) {
        alert("Company details not found. Cannot generate PDF.");
        return;
    }

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    // Use a fixed pixel width for reliable rendering with html2canvas (A4 width @ 96 DPI)
    tempContainer.style.width = '794px'; 
    document.body.appendChild(tempContainer);

    const root = ReactDOM.createRoot(tempContainer);
    root.render(<QuotationPDF quotation={quotation} company={company} />);
    
    // Wait for render to complete
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
    });
    
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    let imgHeight = imgWidth / ratio;
    
    let finalHeight = imgHeight;
    if (imgHeight > pdfHeight) {
        console.warn("Quotation content is taller than a single page. Content will be scaled to fit.");
        finalHeight = pdfHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
    pdf.save(`quotation-${quotation.quotationNumber}.pdf`);
  };

  const handleConvertToOrder = (quotation: Quotation) => {
    // In a real app, this would likely navigate to a 'Create Sales Order' page
    // pre-filled with data from the quotation.
    alert(`Converting quotation ${quotation.quotationNumber} to a Sales Order is not yet implemented.`);
  };

  const handleDelete = (quotationId: string) => {
    setQuotationToDelete(quotationId);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (quotationToDelete) {
      deleteQuotation(quotationToDelete);
    }
    setIsConfirmModalOpen(false);
    setQuotationToDelete(null);
  };


  const columns: Column<Quotation>[] = [
    { header: 'Quotation #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.quotationNumber}</span>, sortKey: 'quotationNumber' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any },
    { header: 'Issue Date', accessor: 'issueDate', sortKey: 'issueDate' },
    { header: 'Expiry Date', accessor: 'expiryDate', sortKey: 'expiryDate' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          {row.status === QuotationStatus.Accepted && (
            <Tooltip text="Convert to Order">
              <Button variant="ghost" size="sm" onClick={() => handleConvertToOrder(row)}>
                <ConvertIcon className="h-4 w-4 text-green-600" />
              </Button>
            </Tooltip>
          )}
          <Tooltip text="View">
            <NavLink
              to={`/sales/quotations/view/${row.id}`}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="View"
            >
              <EyeIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
          <Tooltip text="Edit">
             <NavLink 
              to={`/sales/quotations/edit/${row.id}`} 
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Edit"
             >
                <PencilIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
           <Tooltip text="Download PDF">
            <Button variant="ghost" size="sm" onClick={() => handleDownloadPdf(row)}>
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
           <Tooltip text="Delete">
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id)} className="text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Quotations</h1>
        <NavLink to="/sales/quotations/new">
          <Button>Create New Quotation</Button>
        </NavLink>
      </div>
      <DataTable
        columns={columns}
        data={quotations}
        searchKeys={['quotationNumber', 'customer.name']}
        searchPlaceholder="Search by Quotation # or Customer..."
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
      />
    </div>
  );
};

export default QuotationsPage;