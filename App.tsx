import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/sales/InvoicesPage';
import SalesOrdersPage from './pages/sales/SalesOrdersPage';
import { ThemeProvider } from './contexts/ThemeContext';
import CustomerMasterPage from './pages/settings/CustomerMasterPage';
import CompanyProfilePage from './pages/settings/CompanyProfilePage';
import SupplierMasterPage from './pages/settings/SupplierMasterPage';
import VendorMasterPage from './pages/settings/VendorMasterPage';
import ProductMasterPage from './pages/products/ProductMasterPage';
import CategoryMasterPage from './pages/products/CategoryMasterPage';
import SubcategoryMasterPage from './pages/products/SubcategoryMasterPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import AuthLayout from './components/AuthLayout';
import TaxMasterPage from './pages/settings/TaxMasterPage';
import UserRolesPage from './pages/settings/UserRolesPage';
import { DataProvider } from './contexts/DataContext';
import CreateInvoicePage from './pages/sales/CreateInvoicePage';
import PurchaseOrdersPage from './pages/purchases/PurchaseOrdersPage';
import CreateSalesOrderPage from './pages/sales/CreateSalesOrderPage';
import CreatePurchaseOrderPage from './pages/purchases/CreatePurchaseOrderPage';
import QuotationsPage from './pages/sales/QuotationsPage';
import CreateQuotationPage from './pages/sales/CreateQuotationPage';
import EditQuotationPage from './pages/sales/EditQuotationPage';
import QuotationViewPage from './pages/sales/QuotationViewPage';
import InvoiceViewPage from './pages/sales/InvoiceViewPage';
import StockManagementPage from './pages/inventory/StockManagementPage';
import PlaceholderPage from './pages/PlaceholderPage';
import CreditDebitNotesPage from './pages/accounting/CreditDebitNotesPage';
import CreditDebitNoteViewPage from './pages/accounting/CreditDebitNoteViewPage';
import JournalVouchersPage from './pages/accounting/JournalVouchersPage';
import JournalVoucherViewPage from './pages/accounting/JournalVoucherViewPage';
import BalanceSheetPage from './pages/accounting/BalanceSheetPage';
import BankReconciliationPage from './pages/accounting/BankReconciliationPage';
import Gstr1Page from './pages/gst/Gstr1Page';
import GrnPage from './pages/inventory/GrnPage';
import CreateGrnPage from './pages/inventory/CreateGrnPage';
import BomPage from './pages/production/BomPage';
import CreateBomPage from './pages/production/CreateBomPage';
import EditBomPage from './pages/production/EditBomPage';
import ProfitAndLossPage from './pages/accounting/ProfitAndLossPage';
import YearEndClosingPage from './pages/accounting/YearEndClosingPage';
import StockValuationPage from './pages/inventory/StockValuationPage';
import ProductionOrdersPage from './pages/production/ProductionOrdersPage';
import CreateProductionOrderPage from './pages/production/CreateProductionOrderPage';
import ProductionOrderViewPage from './pages/production/ProductionOrderViewPage';
import BomViewPage from './pages/production/BomViewPage';
import SalesReportsPage from './pages/reports/SalesReportsPage';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <DataProvider>
          <AuthProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/sales/invoices" element={<InvoicesPage />} />
                  <Route path="/sales/invoices/new" element={<CreateInvoicePage />} />
                  <Route path="/sales/orders" element={<SalesOrdersPage />} />
                  <Route path="/sales/orders/new" element={<CreateSalesOrderPage />} />
                  <Route path="/sales/quotations" element={<QuotationsPage />} />
                  <Route path="/sales/quotations/new" element={<CreateQuotationPage />} />
                  <Route path="/sales/quotations/edit/:quotationId" element={<EditQuotationPage />} />
                  <Route path="/purchases/orders" element={<PurchaseOrdersPage />} />
                  <Route path="/purchases/orders/new" element={<CreatePurchaseOrderPage />} />
                  <Route path="/inventory/stock" element={<StockManagementPage />} />
                  <Route path="/inventory/grn" element={<GrnPage />} />
                  <Route path="/inventory/grn/new/:purchaseOrderId" element={<CreateGrnPage />} />
                  <Route path="/inventory/valuation" element={<StockValuationPage />} />
                  <Route path="/products/master" element={<ProductMasterPage />} />
                  <Route path="/products/categories" element={<CategoryMasterPage />} />
                  <Route path="/products/subcategories" element={<SubcategoryMasterPage />} />
                  <Route path="/production/bom" element={<BomPage />} />
                  <Route path="/production/bom/new" element={<CreateBomPage />} />
                  <Route path="/production/bom/edit/:bomId" element={<EditBomPage />} />
                  <Route path="/production/orders" element={<ProductionOrdersPage />} />
                  <Route path="/production/orders/new" element={<CreateProductionOrderPage />} />
                  <Route path="/accounting/journal" element={<JournalVouchersPage />} />
                  <Route path="/accounting/credit-debit-notes" element={<CreditDebitNotesPage />} />
                  <Route path="/accounting/balance-sheet" element={<BalanceSheetPage />} />
                  <Route path="/accounting/profit-loss" element={<ProfitAndLossPage />} />
                  <Route path="/accounting/year-end-closing" element={<YearEndClosingPage />} />
                  <Route path="/reconciliation" element={<BankReconciliationPage />} />
                  <Route path="/gst/gstr1" element={<Gstr1Page />} />
                  <Route path="/reports/sales" element={<SalesReportsPage />} />
                  <Route path="/settings/company" element={<CompanyProfilePage />} />
                  <Route path="/settings/customers" element={<CustomerMasterPage />} />
                  <Route path="/settings/suppliers" element={<SupplierMasterPage />} />
                  <Route path="/settings/vendors" element={<VendorMasterPage />} />
                  <Route path="/settings/taxes" element={<TaxMasterPage />} />
                  <Route path="/settings/users" element={<UserRolesPage />} />
                </Route>
                
                {/* Standalone view pages */}
                <Route path="/sales/quotations/view/:quotationId" element={<QuotationViewPage />} />
                <Route path="/sales/invoices/view/:invoiceId" element={<InvoiceViewPage />} />
                <Route path="/accounting/credit-debit-notes/view/:noteId" element={<CreditDebitNoteViewPage />} />
                <Route path="/accounting/journal/view/:voucherId" element={<JournalVoucherViewPage />} />
                <Route path="/production/orders/view/:orderId" element={<ProductionOrderViewPage />} />
                <Route path="/production/bom/view/:bomId" element={<BomViewPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </DataProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;