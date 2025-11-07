import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/sales/InvoicesPage';
import SalesOrdersPage from './pages/sales/SalesOrdersPage';
import PlaceholderPage from './pages/PlaceholderPage';
import { ThemeProvider } from './contexts/ThemeContext';
import CustomerMasterPage from './pages/settings/CustomerMasterPage';
import CompanyProfilePage from './pages/settings/CompanyProfilePage';
import SupplierMasterPage from './pages/settings/SupplierMasterPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import AuthLayout from './components/AuthLayout';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
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
                <Route path="/sales/orders" element={<SalesOrdersPage />} />
                <Route path="/sales/quotations" element={<PlaceholderPage title="Quotations" />} />
                <Route path="/purchases/orders" element={<PlaceholderPage title="Purchase Orders" />} />
                <Route path="/inventory/stock" element={<PlaceholderPage title="Stock Management" />} />
                <Route path="/production/bom" element={<PlaceholderPage title="Bill of Materials" />} />
                <Route path="/accounting/journal" element={<PlaceholderPage title="Journal Vouchers" />} />
                <Route path="/accounting/balance-sheet" element={<PlaceholderPage title="Balance Sheet" />} />
                <Route path="/reconciliation" element={<PlaceholderPage title="Bank Reconciliation" />} />
                <Route path="/gst/gstr1" element={<PlaceholderPage title="GSTR-1" />} />
                <Route path="/reports/sales" element={<PlaceholderPage title="Sales Reports" />} />
                <Route path="/settings/company" element={<CompanyProfilePage />} />
                <Route path="/settings/customers" element={<CustomerMasterPage />} />
                <Route path="/settings/suppliers" element={<SupplierMasterPage />} />
                <Route path="/settings/users" element={<PlaceholderPage title="User Roles & Permissions" />} />
              </Route>
            </Route>

            {/* Redirect any other path to root. If not authenticated, ProtectedRoute will handle redirect to signin */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;