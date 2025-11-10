import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Invoice, Customer, Product, Company, Supplier, Vendor, Category, Subcategory, Tax, User, UserRole, SalesOrder, PurchaseOrder, SalesOrderStatus, PurchaseOrderStatus, Quotation, QuotationStatus, CreditDebitNote, CreditDebitNoteStatus, CreditDebitNoteType, JournalVoucher, Account, BankStatementTransaction, GRN, GRNStatus, BOM, BOMItem, AccountType, JournalVoucherEntry, ProductionOrder, ProductionOrderStatus } from '../types';
import { mockInvoices, mockCustomers, mockProducts, mockCompanies, mockSuppliers, mockVendors, mockCategories, mockSubcategories, mockTaxes, mockSalesOrders, mockPurchaseOrders, mockQuotations, mockCreditDebitNotes, mockJournalVouchers, mockChartOfAccounts, mockBankStatementTransactions, mockGrns, mockBoms, mockProductionOrders } from '../data/mockData';
import { mockUsers as initialUsers, setMockUsers } from '../data/users';

interface DataContextType {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  companies: Company[];
  suppliers: Supplier[];
  vendors: Vendor[];
  categories: Category[];
  subcategories: Subcategory[];
  taxes: Tax[];
  users: User[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  quotations: Quotation[];
  creditDebitNotes: CreditDebitNote[];
  journalVouchers: JournalVoucher[];
  chartOfAccounts: Account[];
  bankStatementTransactions: BankStatementTransaction[];
  grns: GRN[];
  boms: BOM[];
  productionOrders: ProductionOrder[];
  addInvoice: (invoice: Invoice) => void;
  addCustomer: (customerData: Partial<Customer>) => void;
  updateCustomer: (customerId: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;
  addCompany: (companyData: Partial<Company>) => void;
  updateCompany: (companyId: string, companyData: Partial<Company>) => void;
  deleteCompany: (companyId: string) => void;
  addSupplier: (supplierData: Partial<Supplier>) => void;
  updateSupplier: (supplierId: string, supplierData: Partial<Supplier>) => void;
  deleteSupplier: (supplierId: string) => void;
  addVendor: (vendorData: Partial<Vendor>) => void;
  updateVendor: (vendorId: string, vendorData: Partial<Vendor>) => void;
  deleteVendor: (vendorId: string) => void;
  addProduct: (productData: Partial<Product>) => void;
  updateProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  addCategory: (categoryData: Partial<Category>) => void;
  updateCategory: (categoryId: string, categoryData: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  addSubcategory: (subcategoryData: Partial<Subcategory>) => void;
  updateSubcategory: (subcategoryId: string, subcategoryData: Partial<Subcategory>) => void;
  deleteSubcategory: (subcategoryId: string) => void;
  addTax: (taxData: Partial<Tax>) => void;
  updateTax: (taxId: string, taxData: Partial<Tax>) => void;
  deleteTax: (taxId: string) => void;
  addUser: (userData: Partial<User>) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addSalesOrder: (order: SalesOrder) => void;
  addPurchaseOrder: (order: PurchaseOrder) => void;
  addQuotation: (quotation: Quotation) => void;
  updateQuotation: (quotationId: string, quotationData: Partial<Quotation>) => void;
  deleteQuotation: (quotationId: string) => void;
  addCreditDebitNote: (noteData: Partial<CreditDebitNote>) => void;
  updateCreditDebitNote: (noteId: string, noteData: Partial<CreditDebitNote>) => void;
  deleteCreditDebitNote: (noteId: string) => void;
  addJournalVoucher: (voucherData: Partial<JournalVoucher>) => void;
  updateJournalVoucher: (voucherId: string, voucherData: Partial<JournalVoucher>) => void;
  deleteJournalVoucher: (voucherId: string) => void;
  addGrn: (grnData: Omit<GRN, 'id' | 'grnNumber' | 'status'>, purchaseOrderId: string) => void;
  addBom: (bomData: Partial<BOM>) => void;
  updateBom: (bomId: string, bomData: Partial<BOM>) => void;
  deleteBom: (bomId: string) => void;
  performYearEndClosing: (year: number) => void;
  addProductionOrder: (orderData: Partial<ProductionOrder>) => void;
  updateProductionOrderStatus: (orderId: string, newStatus: ProductionOrderStatus, actualQty?: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(mockSubcategories);
  const [taxes, setTaxes] = useState<Tax[]>(mockTaxes);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [creditDebitNotes, setCreditDebitNotes] = useState<CreditDebitNote[]>(mockCreditDebitNotes);
  const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>(mockJournalVouchers);
  const [chartOfAccounts, setChartOfAccounts] = useState<Account[]>(mockChartOfAccounts);
  const [bankStatementTransactions, setBankStatementTransactions] = useState<BankStatementTransaction[]>(mockBankStatementTransactions);
  const [grns, setGrns] = useState<GRN[]>(mockGrns);
  const [boms, setBoms] = useState<BOM[]>(mockBoms);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(mockProductionOrders);


  const addInvoice = useCallback((invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
  }, []);

  const addSalesOrder = useCallback((order: SalesOrder) => {
    setSalesOrders(prev => [...prev, order]);
  }, []);

  const addPurchaseOrder = useCallback((order: PurchaseOrder) => {
    setPurchaseOrders(prev => [...prev, order]);
  }, []);
  
  const addQuotation = useCallback((quotation: Quotation) => {
    setQuotations(prev => [...prev, quotation]);
  }, []);
  
  const updateQuotation = useCallback((quotationId: string, quotationData: Partial<Quotation>) => {
    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, ...quotationData } as Quotation : q));
  }, []);

  const deleteQuotation = useCallback((quotationId: string) => {
    setQuotations(prev => prev.filter(q => q.id !== quotationId));
  }, []);

  // Credit/Debit Note Actions
  const addCreditDebitNote = useCallback((noteData: Partial<CreditDebitNote>) => {
    const noteTypePrefix = noteData.type === CreditDebitNoteType.Credit ? 'CN' : 'DN';
    const newNote: CreditDebitNote = {
      id: `CDN${Date.now()}`,
      noteNumber: `${noteTypePrefix}-2024-${String(creditDebitNotes.length + 1).padStart(3, '0')}`,
      status: CreditDebitNoteStatus.Draft,
      ...noteData,
    } as CreditDebitNote;
    setCreditDebitNotes(prev => [...prev, newNote]);
  }, [creditDebitNotes.length]);
  
  const updateCreditDebitNote = useCallback((noteId: string, noteData: Partial<CreditDebitNote>) => {
    setCreditDebitNotes(prev => prev.map(n => n.id === noteId ? { ...n, ...noteData } as CreditDebitNote : n));
  }, []);

  const deleteCreditDebitNote = useCallback((noteId: string) => {
    setCreditDebitNotes(prev => prev.filter(n => n.id !== noteId));
  }, []);

  // Journal Voucher Actions
  const addJournalVoucher = useCallback((voucherData: Partial<JournalVoucher>) => {
    const newVoucher: JournalVoucher = {
      id: `JV${Date.now()}`,
      voucherNumber: `JV-2024-${String(journalVouchers.length + 1).padStart(3, '0')}`,
      ...voucherData,
    } as JournalVoucher;
    setJournalVouchers(prev => [...prev, newVoucher]);
  }, [journalVouchers.length]);
  
  const updateJournalVoucher = useCallback((voucherId: string, voucherData: Partial<JournalVoucher>) => {
    setJournalVouchers(prev => prev.map(v => v.id === voucherId ? { ...v, ...voucherData } as JournalVoucher : v));
  }, []);

  const deleteJournalVoucher = useCallback((voucherId: string) => {
    setJournalVouchers(prev => prev.filter(v => v.id !== voucherId));
  }, []);

  // Customer Actions
  const addCustomer = useCallback((customerData: Partial<Customer>) => {
    const newCustomer: Customer = { id: `C${Date.now()}`, ...customerData } as Customer;
    setCustomers(prev => [...prev, newCustomer]);
  }, []);
  const updateCustomer = useCallback((customerId: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, ...customerData } as Customer : c));
  }, []);
  const deleteCustomer = useCallback((customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  }, []);

  // Company Actions
  const addCompany = useCallback((companyData: Partial<Company>) => {
    const newCompany: Company = { id: `COMP${Date.now()}`, ...companyData } as Company;
    setCompanies(prev => [...prev, newCompany]);
  }, []);
  const updateCompany = useCallback((companyId: string, companyData: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, ...companyData } as Company : c));
  }, []);
  const deleteCompany = useCallback((companyId: string) => {
    setCompanies(prev => prev.filter(c => c.id !== companyId));
  }, []);

  // Supplier Actions
  const addSupplier = useCallback((supplierData: Partial<Supplier>) => {
    const newSupplier: Supplier = { id: `SUP${Date.now()}`, ...supplierData } as Supplier;
    setSuppliers(prev => [...prev, newSupplier]);
  }, []);
  const updateSupplier = useCallback((supplierId: string, supplierData: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...supplierData } as Supplier : s));
  }, []);
  const deleteSupplier = useCallback((supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  }, []);

  // Vendor Actions
  const addVendor = useCallback((vendorData: Partial<Vendor>) => {
    const newVendor: Vendor = { id: `VEND${Date.now()}`, ...vendorData } as Vendor;
    setVendors(prev => [...prev, newVendor]);
  }, []);
  const updateVendor = useCallback((vendorId: string, vendorData: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...vendorData } as Vendor : v));
  }, []);
  const deleteVendor = useCallback((vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
  }, []);

  // Product Actions
  const addProduct = useCallback((productData: Partial<Product>) => {
    const newProduct: Product = { id: `P${Date.now()}`, stock: 0, ...productData } as Product;
    setProducts(prev => [...prev, newProduct]);
  }, []);
  const updateProduct = useCallback((productId: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } as Product : p));
  }, []);
  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const updateProductStock = useCallback((productId: string, newStock: number) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
  }, []);

  // Category Actions
  const addCategory = useCallback((categoryData: Partial<Category>) => {
    const newCategory: Category = { id: `CAT${Date.now()}`, ...categoryData } as Category;
    setCategories(prev => [...prev, newCategory]);
  }, []);
  const updateCategory = useCallback((categoryId: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...categoryData } as Category : c));
  }, []);
  const deleteCategory = useCallback((categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  }, []);

  // Subcategory Actions
  const addSubcategory = useCallback((subcategoryData: Partial<Subcategory>) => {
    const newSubcategory: Subcategory = { id: `SUB${Date.now()}`, ...subcategoryData } as Subcategory;
    setSubcategories(prev => [...prev, newSubcategory]);
  }, []);
  const updateSubcategory = useCallback((subcategoryId: string, subcategoryData: Partial<Subcategory>) => {
    setSubcategories(prev => prev.map(s => s.id === subcategoryId ? { ...s, ...subcategoryData } as Subcategory : s));
  }, []);
  const deleteSubcategory = useCallback((subcategoryId: string) => {
    setSubcategories(prev => prev.filter(s => s.id !== subcategoryId));
  }, []);

  // Tax Actions
  const addTax = useCallback((taxData: Partial<Tax>) => {
    const newTax: Tax = { id: `TAX${Date.now()}`, ...taxData } as Tax;
    setTaxes(prev => [...prev, newTax]);
  }, []);
  const updateTax = useCallback((taxId: string, taxData: Partial<Tax>) => {
    setTaxes(prev => prev.map(t => t.id === taxId ? { ...t, ...taxData } as Tax : t));
  }, []);
  const deleteTax = useCallback((taxId: string) => {
    setTaxes(prev => prev.filter(t => t.id !== taxId));
  }, []);

  // User Actions
  const addUser = useCallback((userData: Partial<User>) => {
    const newUser: User = { id: `U${Date.now()}`, role: UserRole.Sales, ...userData } as User;
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setMockUsers(updatedUsers);
  }, [users]);
  const updateUser = useCallback((userId: string, userData: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...userData } as User : u);
    setUsers(updatedUsers);
    setMockUsers(updatedUsers);
  }, [users]);
  const deleteUser = useCallback((userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    setMockUsers(updatedUsers);
  }, [users]);

  // GRN Actions
  const addGrn = useCallback((grnData: Omit<GRN, 'id' | 'grnNumber' | 'status'>, purchaseOrderId: string) => {
    const newGrn: GRN = {
      id: `GRN${Date.now()}`,
      grnNumber: `GRN-2024-${String(grns.length + 1).padStart(3, '0')}`,
      status: GRNStatus.Completed,
      ...grnData,
    };
    setGrns(prev => [...prev, newGrn]);

    // Update product stock
    newGrn.items.forEach(item => {
      const product = products.find(p => p.id === item.product.id);
      if (product) {
        updateProductStock(item.product.id, product.stock + item.receivedQuantity);
      }
    });
    
    // Update PO status
    setPurchaseOrders(prev => prev.map(po => 
      po.id === purchaseOrderId ? { ...po, status: PurchaseOrderStatus.Received } : po
    ));

  }, [grns.length, products, updateProductStock]);

  // BOM Actions
  const addBom = useCallback((bomData: Partial<BOM>) => {
    const newBom: BOM = {
      id: `BOM${Date.now()}`,
      bomNumber: `BOM-2024-${String(boms.length + 1).padStart(3, '0')}`,
      creationDate: new Date().toISOString().split('T')[0],
      ...bomData,
    } as BOM;
    setBoms(prev => [...prev, newBom]);
  }, [boms.length]);

  const updateBom = useCallback((bomId: string, bomData: Partial<BOM>) => {
    setBoms(prev => prev.map(b => (b.id === bomId ? { ...b, ...bomData } as BOM : b)));
  }, []);

  const deleteBom = useCallback((bomId: string) => {
    setBoms(prev => prev.filter(b => b.id !== bomId));
  }, []);
  
  // Production Order Actions
  const addProductionOrder = useCallback((orderData: Partial<ProductionOrder>) => {
    const newOrder: ProductionOrder = {
        id: `PROD${Date.now()}`,
        orderNumber: `PROD-2024-${String(productionOrders.length + 1).padStart(3, '0')}`,
        status: ProductionOrderStatus.Planned,
        ...orderData,
    } as ProductionOrder;
    setProductionOrders(prev => [...prev, newOrder]);
  }, [productionOrders.length]);

  const updateProductionOrderStatus = useCallback((orderId: string, newStatus: ProductionOrderStatus, actualQty?: number) => {
    setProductionOrders(prevOrders => {
        const order = prevOrders.find(o => o.id === orderId);
        if (!order) return prevOrders;

        const bom = boms.find(b => b.id === order.bomId);
        if (!bom) {
            console.error("BOM not found for production order");
            return prevOrders;
        }

        // Logic for inventory updates
        if (order.status === ProductionOrderStatus.Planned && newStatus === ProductionOrderStatus.InProgress) {
            // Deduct components from stock
            let canProceed = true;
            const stockUpdates: {productId: string, newStock: number}[] = [];

            bom.items.forEach(component => {
                const requiredQty = component.quantity * order.quantityToProduce;
                const componentProduct = products.find(p => p.id === component.product.id);
                if (!componentProduct || componentProduct.stock < requiredQty) {
                    alert(`Not enough stock for ${component.product.name}. Required: ${requiredQty}, Available: ${componentProduct?.stock || 0}`);
                    canProceed = false;
                } else {
                    stockUpdates.push({ productId: component.product.id, newStock: componentProduct.stock - requiredQty });
                }
            });

            if (!canProceed) return prevOrders; // Don't update status if stock is insufficient

            // Apply stock updates
            setProducts(currentProducts => {
                let updatedProducts = [...currentProducts];
                stockUpdates.forEach(update => {
                    updatedProducts = updatedProducts.map(p => p.id === update.productId ? {...p, stock: update.newStock} : p);
                });
                return updatedProducts;
            });
        } else if (order.status === ProductionOrderStatus.InProgress && newStatus === ProductionOrderStatus.Completed) {
            // Add finished good to stock
            const finishedProduct = products.find(p => p.id === bom.product.id);
            const quantityProduced = actualQty !== undefined ? actualQty : order.quantityToProduce;

            if (finishedProduct) {
                updateProductStock(finishedProduct.id, finishedProduct.stock + quantityProduced);
            }
        }
        
        // Update the order status
        return prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus, ...(actualQty !== undefined && { actualQuantityProduced: actualQty }) } as ProductionOrder : o);
    });
  }, [boms, products, updateProductStock]);

  const performYearEndClosing = useCallback((year: number) => {
    const retainedEarningsAccount = chartOfAccounts.find(acc => acc.name === 'Retained Earnings');
    if (!retainedEarningsAccount) {
        alert('"Retained Earnings" account not found. Cannot perform year-end closing.');
        return;
    }

    const yearEnd = `${year}-12-31`;
    const relevantVouchers = journalVouchers.filter(jv => jv.date.startsWith(year.toString()));
    const balances = new Map<string, number>();
    chartOfAccounts.forEach(acc => balances.set(acc.id, 0));

    relevantVouchers.forEach(voucher => {
        voucher.entries.forEach(entry => {
            const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
            if (account) {
                const currentBalance = balances.get(entry.accountId) || 0;
                let newBalance = currentBalance;
                if ([AccountType.Asset, AccountType.Expense].includes(account.type)) {
                    newBalance += entry.debit - entry.credit;
                } else {
                    newBalance += entry.credit - entry.debit;
                }
                balances.set(entry.accountId, newBalance);
            }
        });
    });

    const closingEntries: JournalVoucherEntry[] = [];
    let netProfit = 0;
    balances.forEach((balance, accountId) => {
        const account = chartOfAccounts.find(acc => acc.id === accountId);
        if (account && balance !== 0) {
            if (account.type === AccountType.Income) {
                closingEntries.push({ accountId, debit: balance, credit: 0 });
                netProfit += balance;
            } else if (account.type === AccountType.Expense) {
                closingEntries.push({ accountId, debit: 0, credit: balance });
                netProfit -= balance;
            }
        }
    });

    if (netProfit > 0) {
        closingEntries.push({ accountId: retainedEarningsAccount.id, debit: 0, credit: netProfit });
    } else if (netProfit < 0) {
        closingEntries.push({ accountId: retainedEarningsAccount.id, debit: Math.abs(netProfit), credit: 0 });
    }

    const closingVoucherData: Partial<JournalVoucher> = {
        date: yearEnd,
        narration: `Closing entries for ${year}. Transferring net profit/loss to Retained Earnings.`,
        entries: closingEntries,
    };
    
    // We create the new voucher object first
    const closingVoucher: JournalVoucher = {
        id: `JV${Date.now()}`,
        voucherNumber: `JV-${year}-CLOSE`,
        ...closingVoucherData,
    } as JournalVoucher;

    // Update balances based on this new closing voucher before calculating opening balances
    closingVoucher.entries.forEach(entry => {
        const account = chartOfAccounts.find(acc => acc.id === entry.accountId);
        if(account) {
             const currentBalance = balances.get(entry.accountId) || 0;
             let newBalance = currentBalance;
             if ([AccountType.Asset, AccountType.Expense].includes(account.type)) {
                newBalance += entry.debit - entry.credit;
             } else {
                newBalance += entry.credit - entry.debit;
             }
             balances.set(entry.accountId, newBalance);
        }
    });

    const openingEntries: JournalVoucherEntry[] = [];
    balances.forEach((balance, accountId) => {
        const account = chartOfAccounts.find(acc => acc.id === accountId);
        if (account && Math.abs(balance) > 0.001) { // Check for non-zero balances
            if (account.type === AccountType.Asset) {
                openingEntries.push({ accountId, debit: balance, credit: 0 });
            } else if ([AccountType.Liability, AccountType.Equity].includes(account.type)) {
                openingEntries.push({ accountId, debit: 0, credit: balance });
            }
        }
    });

    const openingVoucher: Partial<JournalVoucher> = {
        date: `${year + 1}-01-01`,
        narration: `Opening balance entries for the year ${year + 1}.`,
        entries: openingEntries,
    };

    // Add both vouchers to state at once
    setJournalVouchers(prev => [...prev, closingVoucher, {
      id: `JV${Date.now()+1}`,
      voucherNumber: `JV-${year+1}-OPEN`,
      ...openingVoucher
    } as JournalVoucher]);
    
}, [journalVouchers, chartOfAccounts]);


  return (
    <DataContext.Provider value={{ 
        invoices, customers, products, companies, suppliers, vendors, categories, subcategories, taxes, users,
        salesOrders, purchaseOrders, quotations, creditDebitNotes, journalVouchers, chartOfAccounts, bankStatementTransactions,
        grns, boms, productionOrders,
        addInvoice, addSalesOrder, addPurchaseOrder,
        addQuotation, updateQuotation, deleteQuotation,
        addCreditDebitNote, updateCreditDebitNote, deleteCreditDebitNote,
        addJournalVoucher, updateJournalVoucher, deleteJournalVoucher,
        addCustomer, updateCustomer, deleteCustomer,
        addCompany, updateCompany, deleteCompany,
        addSupplier, updateSupplier, deleteSupplier,
        addVendor, updateVendor, deleteVendor,
        addProduct, updateProduct, deleteProduct,
        updateProductStock,
        addCategory, updateCategory, deleteCategory,
        addSubcategory, updateSubcategory, deleteSubcategory,
        addTax, updateTax, deleteTax,
        addUser, updateUser, deleteUser,
        addGrn,
        addBom, updateBom, deleteBom,
        performYearEndClosing,
        addProductionOrder, updateProductionOrderStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};