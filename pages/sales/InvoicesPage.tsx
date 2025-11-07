import React from 'react';
import ReactDOM from 'react-dom/client';
import { NavLink } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Invoice } from '../../types';
import { Column } from '../../types';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { DownloadIcon } from '../../components/icons/DownloadIcon';
import { Tooltip } from '../../components/ui/Tooltip';
import { useData } from '../../contexts/DataContext';
import InvoicePDF from '../../components/pdf/InvoicePDF';

const InvoicesPage: React.FC = () => {
  const { invoices, companies } = useData();
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

  const handleDownloadPdf = async (invoice: Invoice) => {
    const company = companies.find(c => c.id === invoice.customer.companyId) || companies[0];

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
    root.render(<InvoicePDF invoice={invoice} company={company} />);
    
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
        console.warn("Invoice content is taller than a single page. Content will be scaled to fit.");
        finalHeight = pdfHeight;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);
    pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
  };

  const columns: Column<Invoice>[] = [
    { header: 'Invoice #', accessor: (row) => <span className="font-medium text-primary-600 dark:text-primary-400">{row.invoiceNumber}</span>, sortKey: 'invoiceNumber' },
    { header: 'Customer', accessor: (row) => row.customer.name, sortKey: 'customer.name' as any }, // casting as workaround for nested key
    { header: 'Issue Date', accessor: 'issueDate', sortKey: 'issueDate' },
    { header: 'Due Date', accessor: 'dueDate', sortKey: 'dueDate' },
    { header: 'Amount', accessor: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>, sortKey: 'amount' },
    { header: 'Status', accessor: (row) => <Badge status={row.status} />, sortKey: 'status' },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-1">
          <Tooltip text="View">
            <NavLink
              to={`/sales/invoices/view/${row.id}`}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="View Invoice"
            >
              <EyeIcon className="h-4 w-4" />
            </NavLink>
          </Tooltip>
          <Tooltip text="Edit">
            <Button variant="ghost" size="sm" disabled>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip text="Download PDF">
            <Button variant="ghost" size="sm" onClick={() => handleDownloadPdf(row)}>
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Sales Invoices</h1>
        <NavLink to="/sales/invoices/new">
          <Button>Create New Invoice</Button>
        </NavLink>
      </div>
      
      <DataTable 
        columns={columns} 
        data={invoices} 
        searchKeys={['invoiceNumber', 'customer.name']}
        searchPlaceholder="Search by Invoice # or Customer..."
      />
    </div>
  );
};

export default InvoicesPage;