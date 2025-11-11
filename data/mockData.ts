import { Customer, Product, Invoice, InvoiceStatus, InvoiceItem, Company, Supplier, Vendor, Category, Subcategory, Tax, TaxType, SalesOrder, SalesOrderStatus, PurchaseOrder, PurchaseOrderStatus, Quotation, QuotationStatus, CreditDebitNote, CreditDebitNoteType, CreditDebitNoteStatus, Account, AccountType, JournalVoucher, BankStatementTransaction, GRN, GRNStatus, BOM, ProductionOrder, ProductionOrderStatus } from '../types';

export const mockCompanies: Company[] = [
  {
    id: 'COMP001',
    name: 'Zenith Innovations Inc.',
    gstin: '29AABCU9567R1Z5',
    pan: 'AABCU9567R',
    address: '123 Tech Park, Silicon Valley, Bangalore, Karnataka 560100',
    email: 'contact@zenithinnovations.com',
    phone: '+91 80 1234 5678',
    state: 'Karnataka',
    country: 'India',
  },
  {
    id: 'COMP002',
    name: 'Global Tech Corp',
    gstin: '27AACCG1234F1Z5',
    pan: 'AACCG1234F',
    address: '456 Cyber Towers, Hitech City, Hyderabad, Telangana 500081',
    email: 'info@globaltech.com',
    phone: '+91 40 8765 4321',
    state: 'Telangana',
    country: 'India',
  },
  {
    id: 'COMP003',
    name: 'Apex Solutions Ltd.',
    gstin: '24AAPCA5678G1Z6',
    pan: 'AAPCA5678G',
    address: '789 Infinity Park, Malad, Mumbai, Maharashtra 400064',
    email: 'support@apexsolutions.com',
    phone: '+91 22 2345 6789',
    state: 'Maharashtra',
    country: 'India',
  },
  {
    id: 'COMP004',
    name: 'Quantum Dynamics',
    gstin: '33AADCE8765H1Z2',
    pan: 'AADCE8765H',
    address: '101 Tidel Park, Taramani, Chennai, Tamil Nadu 600113',
    email: 'contact@quantumdynamics.dev',
    phone: '+91 44 3456 7890',
    state: 'Tamil Nadu',
    country: 'India',
  },
  {
    id: 'COMP005',
    name: 'Stellar Enterprises',
    gstin: '07AABCS4321K1Z9',
    pan: 'AABCS4321K',
    address: '212 DLF Cyber City, Gurgaon, Haryana 122002',
    email: 'sales@stellar.co.in',
    phone: '+91 124 4567 8901',
    state: 'Haryana',
    country: 'India',
  },
  {
    id: 'COMP006',
    name: 'Fusion Logistics',
    gstin: '21AACCF9876L1Z3',
    pan: 'AACCF9876L',
    address: '333 Logistics Hub, Peenya, Bangalore, Karnataka 560058',
    email: 'ops@fusionlogistics.com',
    phone: '+91 80 5678 9012',
    state: 'Karnataka',
    country: 'India',
  },
  {
    id: 'COMP007',
    name: 'Matrix Systems',
    gstin: '36AADCM4567M1Z7',
    pan: 'AADCM4567M',
    address: '444 Digital Plaza, Ameerpet, Hyderabad, Telangana 500016',
    email: 'admin@matrixsystems.com',
    phone: '+91 40 6789 0123',
    state: 'Telangana',
    country: 'India',
  },
  {
    id: 'COMP008',
    name: 'Orion Pharma',
    gstin: '27AACCO2345N1Z1',
    pan: 'AACCO2345N',
    address: '555 Health Park, Hinjewadi, Pune, Maharashtra 411057',
    email: 'contact@orionpharma.com',
    phone: '+91 20 7890 1234',
    state: 'Maharashtra',
    country: 'India',
  },
  {
    id: 'COMP009',
    name: 'BlueWave Consulting',
    gstin: '29AACCB8765P1Z4',
    pan: 'AACCB8765P',
    address: '666 Koramangala Heights, Bangalore, Karnataka 560034',
    email: 'consult@bluewave.com',
    phone: '+91 80 8901 2345',
    state: 'Karnataka',
    country: 'India',
  },
  {
    id: 'COMP010',
    name: 'Pinnacle Constructions',
    gstin: '09AABCP1234Q1Z8',
    pan: 'AABCP1234Q',
    address: '777 Realty Towers, Noida, Uttar Pradesh 201301',
    email: 'projects@pinnacle.com',
    phone: '+91 120 9012 3456',
    state: 'Uttar Pradesh',
    country: 'India',
  },
  {
    id: 'COMP011',
    name: 'Synergy Exports',
    gstin: '24AACCS5678R1Z2',
    pan: 'AACCS5678R',
    address: '888 Trade Center, SG Highway, Ahmedabad, Gujarat 380015',
    email: 'exports@synergy.com',
    phone: '+91 79 1234 5678',
    state: 'Gujarat',
    country: 'India',
  },
  {
    id: 'COMP012',
    name: 'Vertex Autos',
    gstin: '33AADCV8765S1Z6',
    pan: 'AADCV8765S',
    address: '999 Auto Hub, Sriperumbudur, Tamil Nadu 602105',
    email: 'info@vertexautos.com',
    phone: '+91 44 2345 6789',
    state: 'Tamil Nadu',
    country: 'India',
  },
  {
    id: 'COMP013',
    name: 'Evergreen Organics',
    gstin: '32AABCE4321T1Z3',
    pan: 'AABCE4321T',
    address: '11 Green Valley, Aluva, Kochi, Kerala 683101',
    email: 'care@evergreen.com',
    phone: '+91 484 3456 7890',
    state: 'Kerala',
    country: 'India',
  },
  {
    id: 'COMP014',
    name: 'Nova Softwares',
    gstin: '19AACCN9876U1Z7',
    pan: 'AACCN9876U',
    address: '22 Infotech Park, Salt Lake, Kolkata, West Bengal 700091',
    email: 'dev@novasoft.com',
    phone: '+91 33 4567 8901',
    state: 'West Bengal',
    country: 'India',
  },
  {
    id: 'COMP015',
    name: 'Horizon Hospitality',
    gstin: '08AADCH4567V1Z1',
    pan: 'AADCH4567V',
    address: '33 Pearl Plaza, Tonk Road, Jaipur, Rajasthan 302018',
    email: 'bookings@horizon.com',
    phone: '+91 141 5678 9012',
    state: 'Rajasthan',
    country: 'India',
  },
  {
    id: 'COMP016',
    name: 'Ignite Media',
    gstin: '27AACCB2345W1Z5',
    pan: 'AACCB2345W',
    address: '44 Media City, Film City, Mumbai, Maharashtra 400065',
    email: 'creative@ignitemedia.com',
    phone: '+91 22 6789 0123',
    state: 'Maharashtra',
    country: 'India',
  },
  {
    id: 'COMP017',
    name: 'Triton Shipping',
    gstin: '24AABCT8765X1Z9',
    pan: 'AABCT8765X',
    address: '55 Port House, Mundra, Gujarat 370421',
    email: 'shipping@triton.com',
    phone: '+91 2838 7890 1234',
    state: 'Gujarat',
    country: 'India',
  },
  {
    id: 'COMP018',
    name: 'Aether Airlines',
    gstin: '07AADCA4321Y1Z2',
    pan: 'AADCA4321Y',
    address: '66 Airport Road, IGI Airport, New Delhi, Delhi 110037',
    email: 'contact@aetherairlines.com',
    phone: '+91 11 8901 2345',
    state: 'Delhi',
    country: 'India',
  },
  {
    id: 'COMP019',
    name: 'Redwood Retail',
    gstin: '29AACCR9876Z1Z6',
    pan: 'AACCR9876Z',
    address: '77 Commercial Street, MG Road, Bangalore, Karnataka 560001',
    email: 'store@redwood.com',
    phone: '+91 80 9012 3456',
    state: 'Karnataka',
    country: 'India',
  },
  {
    id: 'COMP020',
    name: 'Catalyst Chemicals',
    gstin: '24AABCC1234A1Z0',
    pan: 'AABCC1234A',
    address: '88 Chemical Zone, Vapi, Gujarat 396195',
    email: 'sales@catalyst.com',
    phone: '+91 260 1234 5678',
    state: 'Gujarat',
    country: 'India',
  },
];

export const mockCustomers: Customer[] = [
  { id: 'C001', name: 'Innovate Corp', email: 'contact@innovate.com', gstin: '29AABCU9567R1Z5', companyId: 'COMP001', mobile: '9876543210', address: '456 Innovation Drive, Tech City', city: 'Bangalore', state: 'Karnataka', country: 'India', creditLimit: 500000 },
  { id: 'C002', name: 'Quantum Solutions', email: 'info@quantum.dev', gstin: '27AABCU9567R1Z4', companyId: 'COMP002', mobile: '9988776655', address: '789 Quantum Lane', city: 'Pune', state: 'Maharashtra', country: 'India', creditLimit: 750000 },
  { id: 'C003', name: 'Apex Industries', email: 'support@apex.io', gstin: '24AABCU9567R1Z3', companyId: 'COMP003', mobile: '9123456789', address: '101 Apex Tower, Industrial Area', city: 'Ahmedabad', state: 'Gujarat', country: 'India', creditLimit: 600000 },
  { id: 'C004', name: 'Stellar Goods', email: 'sales@stellar.com', gstin: '36AABCU9567R1Z2', companyId: 'COMP004', mobile: '9555666777', address: '22 Stellar Street', city: 'Hyderabad', state: 'Telangana', country: 'India', creditLimit: 1000000 },
  { id: 'C005', name: 'Pioneer Ventures', email: 'contact@pioneer.com', gstin: '07AACCP1234F1Z5', companyId: 'COMP005', mobile: '9876501234', address: '33 Pioneer Plaza', city: 'Gurgaon', state: 'Haryana', country: 'India', creditLimit: 1200000 },
  { id: 'C006', name: 'Dynamic Traders', email: 'trade@dynamic.co', gstin: '29AABCD5432E1Z6', companyId: 'COMP006', mobile: '9988771122', address: '44 Dynamic Point', city: 'Bangalore', state: 'Karnataka', country: 'India', creditLimit: 450000 },
  { id: 'C007', name: 'Future Enterprises', email: 'info@future.net', gstin: '36AABCF9876G1Z7', companyId: 'COMP007', mobile: '9123498765', address: '55 Future Avenue', city: 'Hyderabad', state: 'Telangana', country: 'India', creditLimit: 850000 },
  { id: 'C008', name: 'Visionary Systems', email: 'support@visionary.tech', gstin: '27AACCV5678H1Z8', companyId: 'COMP008', mobile: '9555443322', address: '66 Visionary Towers', city: 'Mumbai', state: 'Maharashtra', country: 'India', creditLimit: 950000 },
  { id: 'C009', name: 'Brighton Logistics', email: 'logistics@brighton.com', gstin: '33AABCB2468I1Z9', companyId: 'COMP012', mobile: '9876512345', address: '77 Brighton Complex', city: 'Chennai', state: 'Tamil Nadu', country: 'India', creditLimit: 300000 },
  { id: 'C010', name: 'Omega Retail', email: 'retail@omega.store', gstin: '32AACCO3691J1Z0', companyId: 'COMP013', mobile: '9988772233', address: '88 Omega Mall', city: 'Kochi', state: 'Kerala', country: 'India', creditLimit: 550000 },
  { id: 'C011', name: 'Silverline Exports', email: 'exports@silverline.in', gstin: '19AABCS7531K1Z1', companyId: 'COMP014', mobile: '9123487654', address: '99 Silverline Building', city: 'Kolkata', state: 'West Bengal', country: 'India', creditLimit: 1500000 },
  { id: 'C012', name: 'Golden Services', email: 'service@golden.com', gstin: '08AADCG9513L1Z2', companyId: 'COMP015', mobile: '9555334411', address: '111 Golden Street', city: 'Jaipur', state: 'Rajasthan', country: 'India', creditLimit: 250000 },
  { id: 'C013', name: 'Alpha Innovations', email: 'alpha@innovations.com', gstin: '07AACCA1122M1Z3', companyId: 'COMP018', mobile: '9876523456', address: '222 Alpha Lane', city: 'New Delhi', state: 'Delhi', country: 'India', creditLimit: 2000000 },
  { id: 'C014', name: 'Vertex Solutions', email: 'solutions@vertex.dev', gstin: '29AACCV4455N1Z4', companyId: 'COMP019', mobile: '9988773344', address: '333 Vertex Point', city: 'Bangalore', state: 'Karnataka', country: 'India', creditLimit: 1100000 },
  { id: 'C015', name: 'Sunrise Traders', email: 'sunrise@traders.biz', gstin: '24AABCS7788O1Z5', companyId: 'COMP020', mobile: '9123476543', address: '444 Sunrise Plaza', city: 'Vapi', state: 'Gujarat', country: 'India', creditLimit: 400000 },
  { id: 'C016', name: 'Meridian Group', email: 'contact@meridian.group', gstin: '27AACCM9900P1Z6', companyId: 'COMP003', mobile: '9555221133', address: '555 Meridian Center', city: 'Pune', state: 'Maharashtra', country: 'India', creditLimit: 1300000 },
  { id: 'C017', name: 'Pacific Exports', email: 'pacific@exports.com', gstin: '24AACCP1212Q1Z7', companyId: 'COMP011', mobile: '9876534567', address: '666 Pacific Trade Hub', city: 'Surat', state: 'Gujarat', country: 'India', creditLimit: 900000 },
  { id: 'C018', name: 'Nexus Technologies', email: 'tech@nexus.io', gstin: '29AABCN4545R1Z8', companyId: 'COMP009', mobile: '9988774455', address: '777 Nexus Park', city: 'Bangalore', state: 'Karnataka', country: 'India', creditLimit: 1750000 },
  { id: 'C019', name: 'Everest Supplies', email: 'supplies@everest.com', gstin: '09AABCE8989S1Z9', companyId: 'COMP010', mobile: '9123465432', address: '888 Everest Heights', city: 'Noida', state: 'Uttar Pradesh', country: 'India', creditLimit: 650000 },
  { id: 'C020', name: 'Retail Customer', email: 'retail@example.com', gstin: '', companyId: 'COMP001', mobile: '9000011111', address: '123 Main Street', city: 'Mumbai', state: 'Maharashtra', country: 'India', creditLimit: 10000 },
];

export const mockSuppliers: Supplier[] = [
  { id: 'SUP001', name: 'Global Raw Materials', email: 'contact@globalraw.com', gstin: '29AABCS1234A1Z5', pan: 'AABCS1234A', address: '101 Industrial Area, Peenya', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9876543210' },
  { id: 'SUP002', name: 'Precision Components Ltd.', email: 'sales@precision.co.in', gstin: '27AACCP5678B1Z6', pan: 'AACCP5678B', address: 'Unit 5, MIDC, Chakan', city: 'Pune', state: 'Maharashtra', country: 'India', phone: '9123456789' },
  { id: 'SUP003', name: 'A-One Packaging Solutions', email: 'info@aonepack.com', gstin: '24AABCA9101C1Z7', pan: 'AABCA9101C', address: 'Plot 3, GIDC, Vapi', city: 'Vapi', state: 'Gujarat', country: 'India', phone: '9988776655' },
  { id: 'SUP004', name: 'Connect IT Hardware', email: 'support@connectit.dev', gstin: '36AADCC1122D1Z8', pan: 'AADCC1122D', address: '22 Nehru Place', city: 'New Delhi', state: 'Delhi', country: 'India', phone: '9555666777' },
  { id: 'SUP005', name: 'Vertex Steel Mills', email: 'inquiry@vertexsteel.com', gstin: '33AABCV3344E1Z9', pan: 'AABCV3344E', address: 'SIPCOT Industrial Complex', city: 'Chennai', state: 'Tamil Nadu', country: 'India', phone: '9876501234' },
  { id: 'SUP006', name: 'SynthFab Chemicals', email: 'accounts@synthfab.com', gstin: '21AACCS5566F1Z0', pan: 'AACCS5566F', address: 'Ankleshwar Industrial Estate', city: 'Ankleshwar', state: 'Gujarat', country: 'India', phone: '9988771122' },
  { id: 'SUP007', name: 'FastTrack Logistics', email: 'dispatch@fasttrack.log', gstin: '29AAACF7788G1Z1', pan: 'AAACF7788G', address: '44 Transport Nagar', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9123498765' },
  { id: 'SUP008', name: 'Office Essentials Depot', email: 'orders@officedepot.in', gstin: '27AADCO9900H1Z2', pan: 'AADCO9900H', address: 'Fort, Fountain', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '9555443322' },
  { id: 'SUP009', name: 'PowerUp Electricals', email: 'sales.pu@powerup.com', gstin: '19AABCP1212I1Z3', pan: 'AABCP1212I', address: 'Chandni Chowk Market', city: 'Kolkata', state: 'West Bengal', country: 'India', phone: '9876512345' },
  { id: 'SUP010', name: 'GreenLeaf Paper Products', email: 'greenleaf@paper.com', gstin: '32AACCG3434J1Z4', pan: 'AACCG3434J', address: 'Edayar Industrial Zone', city: 'Kochi', state: 'Kerala', country: 'India', phone: '9988772233' },
  { id: 'SUP011', name: 'Machine Masters Inc.', email: 'mmi.service@machines.com', gstin: '08AADCM5656K1Z5', pan: 'AADCM5656K', address: 'Sitapura Industrial Area', city: 'Jaipur', state: 'Rajasthan', country: 'India', phone: '9123487654' },
  { id: 'SUP012', name: 'Uniform Universe', email: 'uniforms@universe.style', gstin: '09AABCU7878L1Z6', pan: 'AABCU7878L', address: 'Sector 62, Garment Hub', city: 'Noida', state: 'Uttar Pradesh', country: 'India', phone: '9555334411' },
  { id: 'SUP013', name: 'PrintPerfect Solutions', email: 'contact@printperfect.com', gstin: '29AABCP9090M1Z7', pan: 'AABCP9090M', address: 'SP Road', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9876523456' },
  { id: 'SUP014', name: 'SafeChoice Security', email: 'admin@safechoice.sec', gstin: '27AACCS1313N1Z8', pan: 'AACCS1313N', address: 'Andheri East', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '9988773344' },
  { id: 'SUP015', name: 'Techno Tools & Spares', email: 'spares@technotools.com', gstin: '36AABCT3535O1Z9', pan: 'AABCT3535O', address: 'Balanagar Industrial Area', city: 'Hyderabad', state: 'Telangana', country: 'India', phone: '9123476543' },
];

export const mockVendors: Vendor[] = [
  { id: 'VEND001', name: 'Service Pro Tech', email: 'support@servicepro.com', gstin: '29AAECS1234A1Z5', pan: 'AAECS1234A', address: '111 Service Lane, Koramangala', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9876543211' },
  { id: 'VEND002', name: 'Creative Consultants', email: 'projects@creative.co', gstin: '27AACCP5678B1Z7', pan: 'BACCP5678B', address: '22 Creative Hub, Andheri', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '9123456780' },
  { id: 'VEND003', name: 'Marketing Masters', email: 'campaigns@marketingmasters.com', gstin: '07AABCM9101C1Z8', pan: 'CABCM9101C', address: '33 Marketing Ave, DLF Cyber City', city: 'Gurgaon', state: 'Haryana', country: 'India', phone: '9988776654' },
  { id: 'VEND004', name: 'Legal Eagles LLP', email: 'legal@eagles.law', gstin: '36AADCL1122D1Z9', pan: 'DADCL1122D', address: '44 Court Chambers, Connaught Place', city: 'New Delhi', state: 'Delhi', country: 'India', phone: '9555666778' },
  { id: 'VEND005', name: 'Facility Management Experts', email: 'ops@facilityexperts.com', gstin: '33AABCF3344E1Z0', pan: 'EABCF3344E', address: '55 OMR IT Corridor', city: 'Chennai', state: 'Tamil Nadu', country: 'India', phone: '9876501235' },
  { id: 'VEND006', name: 'CleanSweep Solutions', email: 'contact@cleansweep.com', gstin: '27AAACC4567F1Z1', pan: 'FACCC4567F', address: '66 Commercial Complex, Hinjewadi', city: 'Pune', state: 'Maharashtra', country: 'India', phone: '9122334455' },
  { id: 'VEND007', name: 'HR Connect', email: 'info@hrconnect.in', gstin: '36AABCH8765G1Z2', pan: 'GABCH8765G', address: '77 Hitech City Main Rd', city: 'Hyderabad', state: 'Telangana', country: 'India', phone: '9233445566' },
  { id: 'VEND008', name: 'Digital Wave Agency', email: 'hello@digitalwave.agency', gstin: '29AADCD9876H1Z3', pan: 'HADCD9876H', address: '88 MG Road, Trinity Circle', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9344556677' },
  { id: 'VEND009', name: 'SecureIT Services', email: 'security@secureit.co', gstin: '27AACCS3210I1Z4', pan: 'IACCS3210I', address: '99 BKC, Bandra', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '9455667788' },
  { id: 'VEND010', name: 'GreenScape Landscaping', email: 'projects@greenscape.com', gstin: '33AABCG1234J1Z5', pan: 'JABCG1234J', address: '110 Greenways Lane', city: 'Chennai', state: 'Tamil Nadu', country: 'India', phone: '9566778899' },
  { id: 'VEND011', name: 'CaterRight Events', email: 'events@caterright.com', gstin: '07AADCE5678K1Z6', pan: 'KADCE5678K', address: '121 Hauz Khas Village', city: 'New Delhi', state: 'Delhi', country: 'India', phone: '9677889900' },
  { id: 'VEND012', name: 'TravelWise Corporate', email: 'bookings@travelwise.corp', gstin: '06AABCT9012L1Z7', pan: 'LABCT9012L', address: '132 Golf Course Road', city: 'Gurgaon', state: 'Haryana', country: 'India', phone: '9788990011' },
  { id: 'VEND013', name: 'AuditPro Associates', email: 'partner@auditpro.com', gstin: '19AACCA3456M1Z8', pan: 'MACCA3456M', address: '143 Park Street', city: 'Kolkata', state: 'West Bengal', country: 'India', phone: '9899001122' },
  { id: 'VEND014', name: 'Innovate Web Devs', email: 'dev@innovateweb.io', gstin: '27AADCI7890N1Z9', pan: 'NADCI7890N', address: '154 Magarpatta City', city: 'Pune', state: 'Maharashtra', country: 'India', phone: '9900112233' },
  { id: 'VEND015', name: 'BrandBuilders PR', email: 'media@brandbuilders.com', gstin: '27AABCB2109O1Z0', pan: 'OABCB2109O', address: '165 Lower Parel', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '9011223344' },
  { id: 'VEND016', name: 'QuickFix Maintenance', email: 'service@quickfix.in', gstin: '29AACQ4321P1Z1', pan: 'PACQ4321P', address: '176 Electronic City', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '9122334455' }
];

export const mockCategories: Category[] = [
  { id: 'CAT001', name: 'Electronics', description: 'Devices and gadgets that use electricity.' },
  { id: 'CAT002', name: 'Office Supplies', description: 'Consumables and equipment regularly used in offices.' },
  { id: 'CAT003', name: 'Furniture', description: 'Chairs, desks, and storage for the workplace.' },
  { id: 'CAT004', name: 'Industrial', description: 'Materials and supplies for manufacturing and industrial processes.' },
  { id: 'CAT005', name: 'Software', description: 'Applications and programs for computers.' },
];

export const mockSubcategories: Subcategory[] = [
  { id: 'SUB001', name: 'Laptops & Computers', categoryId: 'CAT001', description: 'All kinds of personal computers and notebooks.' },
  { id: 'SUB002', name: 'Peripherals', categoryId: 'CAT001', description: 'Accessories like mice, keyboards, webcams, etc.' },
  { id: 'SUB003', name: 'Monitors', categoryId: 'CAT001', description: 'High-resolution displays for computers.' },
  { id: 'SUB004', name: 'Networking', categoryId: 'CAT001', description: 'Routers, switches, and networking cables.' },
  { id: 'SUB005', name: 'Stationery', categoryId: 'CAT002', description: 'Pens, paper, notebooks, and other writing materials.' },
  { id: 'SUB006', name: 'Consumables', categoryId: 'CAT002', description: 'Printer cartridges, toners, and other replaceable items.' },
  { id: 'SUB007', name: 'Chairs & Seating', categoryId: 'CAT003', description: 'Ergonomic office chairs and guest seating.' },
  { id: 'SUB008', name: 'Desks & Tables', categoryId: 'CAT003', description: 'Workstations, standing desks, and conference tables.' },
  { id: 'SUB009', name: 'Lubricants & Chemicals', categoryId: 'CAT004', description: 'Industrial grade chemicals for machinery.' },
  { id: 'SUB010', name: 'Fasteners', categoryId: 'CAT004', description: 'Nuts, bolts, screws, and other hardware.' },
  { id: 'SUB011', name: 'Accounting & ERP', categoryId: 'CAT005', description: 'Business management and financial software.' },
  { id: 'SUB012', name: 'Office Suites', categoryId: 'CAT005', description: 'Productivity software suites like Microsoft Office.' },
];

export const mockTaxes: Tax[] = [
  { id: 'TAX001', name: 'GST 5%', type: TaxType.GST, rate: 5, description: 'Standard GST rate for essential items.' },
  { id: 'TAX002', name: 'GST 12%', type: TaxType.GST, rate: 12, description: 'GST rate for processed foods, etc.' },
  { id: 'TAX003', name: 'GST 18%', type: TaxType.GST, rate: 18, description: 'Standard GST rate for most services and goods.' },
  { id: 'TAX004', name: 'GST 28%', type: TaxType.GST, rate: 28, description: 'GST rate for luxury items.' },
  { id: 'TAX005', name: 'Compensation Cess', type: TaxType.Cess, rate: 15, description: 'Cess on luxury cars and tobacco products.' },
  { id: 'TAX006', name: 'TDS on Rent (194-I)', type: TaxType.TDS, rate: 10, description: 'TDS applicable on rent payments exceeding the threshold.' },
  { id: 'TAX007', name: 'TDS on Professional Fees (194J)', type: TaxType.TDS, rate: 10, description: 'TDS on fees for professional or technical services.' },
];

export const mockProducts: Product[] = [
  { id: 'P001', name: 'Dell Latitude 7420 Laptop', code: 'LP-DELL-7420', hsnCode: '8471', unit: 'PCS', rate: 95000, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB001', stock: 25 },
  { id: 'P002', name: 'Logitech MX Master 3S Mouse', code: 'MSE-LOGI-MX3S', hsnCode: '847160', unit: 'PCS', rate: 8500, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB002', stock: 78 },
  { id: 'P003', name: 'Samsung Odyssey G9 Monitor', code: 'MON-SAM-G9', hsnCode: '8528', unit: 'PCS', rate: 120000, taxId: 'TAX004', categoryId: 'CAT001', subcategoryId: 'SUB003', stock: 8 },
  { id: 'P004', name: 'Office 365 Business Subscription', code: 'SUB-MS-365B', hsnCode: '9983', unit: 'SET', rate: 8000, taxId: 'TAX003', categoryId: 'CAT005', subcategoryId: 'SUB012', stock: 999 },
  { id: 'P005', name: 'Steelcase Ergonomic Chair', code: 'CHR-STL-ERGO', hsnCode: '9401', unit: 'PCS', rate: 45000, taxId: 'TAX004', categoryId: 'CAT003', subcategoryId: 'SUB007', stock: 0 },
  { id: 'P006', name: 'A4 Printing Paper Ream', code: 'PAP-A4-75GSM', hsnCode: '4802', unit: 'BOX', rate: 2500, taxId: 'TAX002', categoryId: 'CAT002', subcategoryId: 'SUB005', stock: 150 },
  { id: 'P007', name: 'Industrial Grade Lubricant', code: 'LUBE-IND-5L', hsnCode: '2710', unit: 'LTR', rate: 1200, taxId: 'TAX003', categoryId: 'CAT004', subcategoryId: 'SUB009', stock: 45 },
  { id: 'P008', name: 'Heavy Duty Steel Screws', code: 'SCR-STL-HD-1KG', hsnCode: '7318', unit: 'KG', rate: 450, taxId: 'TAX003', categoryId: 'CAT004', subcategoryId: 'SUB010', stock: 210 },
  { id: 'P009', name: 'Cisco Catalyst 9300 Switch', code: 'SW-CIS-9300', hsnCode: '8517', unit: 'PCS', rate: 150000, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB004', stock: 5 },
  { id: 'P010', name: 'TallyPrime Gold Software', code: 'SW-TALLY-GLD', hsnCode: '9973', unit: 'SET', rate: 54000, taxId: 'TAX003', categoryId: 'CAT005', subcategoryId: 'SUB011', stock: 999 },
  { id: 'P011', name: 'Executive Office Desk', code: 'DSK-EXEC-WD', hsnCode: '9403', unit: 'PCS', rate: 32000, taxId: 'TAX004', categoryId: 'CAT003', subcategoryId: 'SUB008', stock: 12 },
  { id: 'P012', name: 'Packing Tape Rolls (Box of 24)', code: 'TAPE-PACK-24', hsnCode: '3919', unit: 'BOX', rate: 900, taxId: 'TAX002', categoryId: 'CAT002', subcategoryId: 'SUB006', stock: 300 },
  { id: 'P013', name: 'Hand Sanitizer 5L Can', code: 'SAN-5L-CAN', hsnCode: '3808', unit: 'LTR', rate: 850, taxId: 'TAX003', categoryId: 'CAT002', subcategoryId: 'SUB006', stock: 88 },
  { id: 'P014', name: 'Custom PC Build', code: 'PC-CUSTOM-01', hsnCode: '8471', unit: 'SET', rate: 75000, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB001', stock: 5 },
  { id: 'P015', name: 'Intel Core i7 CPU', code: 'CPU-INT-I7', hsnCode: '8542', unit: 'PCS', rate: 30000, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB001', stock: 50 },
  { id: 'P016', name: 'Nvidia RTX 3060 GPU', code: 'GPU-NV-3060', hsnCode: '8473', unit: 'PCS', rate: 25000, taxId: 'TAX004', categoryId: 'CAT001', subcategoryId: 'SUB001', stock: 30 },
  { id: 'P017', name: '16GB DDR4 RAM', code: 'RAM-DDR4-16G', hsnCode: '8473', unit: 'PCS', rate: 4000, taxId: 'TAX003', categoryId: 'CAT001', subcategoryId: 'SUB001', stock: 100 },
];

const getTaxRateById = (taxId?: string): number => {
    if (!taxId) return 0;
    const tax = mockTaxes.find(t => t.id === taxId);
    return tax ? tax.rate : 0;
}

export const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: '2024-001',
    customer: mockCustomers[0],
    issueDate: '2024-07-15',
    dueDate: '2024-08-14',
    amount: 336300,
    status: InvoiceStatus.Paid,
    items: [
      { product: mockProducts[0], quantity: 3, rate: 95000, tax: 18, total: 336300 }
    ]
  },
  {
    id: 'INV002',
    invoiceNumber: '2024-002',
    customer: mockCustomers[1],
    issueDate: '2024-07-20',
    dueDate: '2024-08-19',
    amount: 132160,
    status: InvoiceStatus.Pending,
    items: [
        { product: mockProducts[0], quantity: 1, rate: mockProducts[0].rate, tax: getTaxRateById(mockProducts[0].taxId), total: 112100 },
        { product: mockProducts[1], quantity: 2, rate: mockProducts[1].rate, tax: getTaxRateById(mockProducts[1].taxId), total: 20060 }
    ]
  },
  {
    id: 'INV003',
    invoiceNumber: '2024-003',
    customer: mockCustomers[2],
    issueDate: '2024-06-10',
    dueDate: '2024-07-10',
    amount: 153600,
    status: InvoiceStatus.Overdue,
    items: [
        { product: mockProducts[2], quantity: 1, rate: mockProducts[2].rate, tax: getTaxRateById(mockProducts[2].taxId), total: 153600 }
    ]
  },
  {
    id: 'INV004',
    invoiceNumber: '2024-004',
    customer: mockCustomers[3],
    issueDate: '2024-07-22',
    dueDate: '2024-08-21',
    amount: 18880,
    status: InvoiceStatus.Pending,
    items: [
        { product: mockProducts[3], quantity: 2, rate: mockProducts[3].rate, tax: getTaxRateById(mockProducts[3].taxId), total: 18880 }
    ]
  },
  {
    id: 'INV005',
    invoiceNumber: '2024-005',
    customer: mockCustomers[0],
    issueDate: '2024-07-25',
    dueDate: '2024-08-24',
    amount: 57600,
    status: InvoiceStatus.Draft,
    items: [
        { product: mockProducts[4], quantity: 1, rate: mockProducts[4].rate, tax: getTaxRateById(mockProducts[4].taxId), total: 57600 }
    ]
  },
  {
    id: 'INV006',
    invoiceNumber: '2024-006',
    customer: mockCustomers[19],
    issueDate: '2024-07-28',
    dueDate: '2024-08-27',
    amount: 2800,
    status: InvoiceStatus.Paid,
    items: [
      { product: mockProducts[5], quantity: 1, rate: 2500, tax: 12, total: 2800 }
    ]
  },
  {
    id: 'INV007',
    invoiceNumber: '2024-007',
    customer: mockCustomers[4],
    issueDate: '2024-07-05',
    dueDate: '2024-08-04',
    amount: 7616,
    status: InvoiceStatus.Paid,
    items: [
      { product: mockProducts[5], quantity: 2, rate: mockProducts[5].rate, tax: getTaxRateById(mockProducts[5].taxId), total: 5600 },
      { product: mockProducts[11], quantity: 2, rate: mockProducts[11].rate, tax: getTaxRateById(mockProducts[11].taxId), total: 2016 },
    ]
  },
  {
    id: 'INV008',
    invoiceNumber: '2024-008',
    customer: mockCustomers[5],
    issueDate: '2024-07-11',
    dueDate: '2024-08-10',
    amount: 47200,
    status: InvoiceStatus.Pending,
    items: [
      { product: mockProducts[1], quantity: 4, rate: mockProducts[1].rate, tax: getTaxRateById(mockProducts[1].taxId), total: 40120 },
      { product: mockProducts[6], quantity: 5, rate: mockProducts[6].rate, tax: getTaxRateById(mockProducts[6].taxId), total: 7080 },
    ]
  },
  {
    id: 'INV009',
    invoiceNumber: '2024-009',
    customer: mockCustomers[6],
    issueDate: '2024-07-18',
    dueDate: '2024-08-17',
    amount: 203210,
    status: InvoiceStatus.Paid,
    items: [
      { product: mockProducts[0], quantity: 1, rate: mockProducts[0].rate, tax: getTaxRateById(mockProducts[0].taxId), total: 112100 },
      { product: mockProducts[1], quantity: 5, rate: mockProducts[1].rate, tax: getTaxRateById(mockProducts[1].taxId), total: 50150 },
      { product: mockProducts[10], quantity: 1, rate: mockProducts[10].rate, tax: getTaxRateById(mockProducts[10].taxId), total: 40960 },
    ]
  },
  {
    id: 'INV010',
    invoiceNumber: '2024-010',
    customer: mockCustomers[7],
    issueDate: '2024-07-26',
    dueDate: '2024-08-25',
    amount: 19015,
    status: InvoiceStatus.Pending,
    items: [
      { product: mockProducts[5], quantity: 5, rate: mockProducts[5].rate, tax: getTaxRateById(mockProducts[5].taxId), total: 14000 },
      { product: mockProducts[12], quantity: 5, rate: mockProducts[12].rate, tax: getTaxRateById(mockProducts[12].taxId), total: 5015 },
    ]
  },
];

export const mockSalesOrders: SalesOrder[] = [
  {
    id: 'SO001',
    orderNumber: 'SO-2024-001',
    customer: mockCustomers[4],
    orderDate: '2024-07-10',
    shipmentDate: '2024-07-20',
    amount: 177000,
    status: SalesOrderStatus.Shipped,
    items: [
      { product: mockProducts[8], quantity: 1, rate: 150000, tax: getTaxRateById(mockProducts[8].taxId), total: 177000 },
    ]
  },
  {
    id: 'SO002',
    orderNumber: 'SO-2024-002',
    customer: mockCustomers[5],
    orderDate: '2024-07-12',
    shipmentDate: '2024-07-22',
    amount: 63720,
    status: SalesOrderStatus.Confirmed,
    items: [
      { product: mockProducts[9], quantity: 1, rate: 54000, tax: getTaxRateById(mockProducts[9].taxId), total: 63720 },
    ]
  },
  {
    id: 'SO003',
    orderNumber: 'SO-2024-003',
    customer: mockCustomers[0],
    orderDate: '2024-07-28',
    shipmentDate: '2024-08-05',
    amount: 112100,
    status: SalesOrderStatus.Draft,
    items: [
      { product: mockProducts[0], quantity: 1, rate: 95000, tax: getTaxRateById(mockProducts[0].taxId), total: 112100 },
    ]
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    orderNumber: 'PO-2024-001',
    supplier: mockSuppliers[0],
    orderDate: '2024-07-05',
    expectedDeliveryDate: '2024-07-25',
    amount: 2832,
    status: PurchaseOrderStatus.Received,
    items: [
      { product: mockProducts[6], quantity: 2, rate: 1200, tax: getTaxRateById(mockProducts[6].taxId), total: 2832 },
    ]
  },
  {
    id: 'PO002',
    orderNumber: 'PO-2024-002',
    supplier: mockSuppliers[1],
    orderDate: '2024-07-08',
    expectedDeliveryDate: '2024-08-01',
    amount: 10620,
    status: PurchaseOrderStatus.Approved,
    items: [
      { product: mockProducts[7], quantity: 20, rate: 450, tax: getTaxRateById(mockProducts[7].taxId), total: 10620 },
    ]
  },
  {
    id: 'PO003',
    orderNumber: 'PO-2024-003',
    supplier: mockSuppliers[5],
    orderDate: '2024-07-29',
    expectedDeliveryDate: '2024-08-15',
    amount: 0,
    status: PurchaseOrderStatus.Draft,
    items: []
  }
];

export const mockQuotations: Quotation[] = [
  {
    id: 'QT001',
    quotationNumber: 'QT-2024-001',
    customer: mockCustomers[6],
    issueDate: '2024-07-01',
    expiryDate: '2024-07-31',
    amount: 112100,
    status: QuotationStatus.Accepted,
    items: [
      { product: mockProducts[0], quantity: 1, rate: 95000, tax: getTaxRateById(mockProducts[0].taxId), total: 112100 },
    ]
  },
  {
    id: 'QT002',
    quotationNumber: 'QT-2024-002',
    customer: mockCustomers[7],
    issueDate: '2024-07-15',
    expiryDate: '2024-08-14',
    amount: 105900,
    status: QuotationStatus.Sent,
    items: [
      { product: mockProducts[1], quantity: 10, rate: 8500, tax: getTaxRateById(mockProducts[1].taxId), total: 100300 },
      { product: mockProducts[5], quantity: 2, rate: 2500, tax: getTaxRateById(mockProducts[5].taxId), total: 5600 },
    ]
  },
  {
    id: 'QT003',
    quotationNumber: 'QT-2024-003',
    customer: mockCustomers[8],
    issueDate: '2024-07-20',
    expiryDate: '2024-08-19',
    amount: 0,
    status: QuotationStatus.Draft,
    items: []
  },
  {
    id: 'QT004',
    quotationNumber: 'QT-2024-004',
    customer: mockCustomers[9],
    issueDate: '2024-06-25',
    expiryDate: '2024-07-25',
    amount: 57600,
    status: QuotationStatus.Rejected,
    items: [
        { product: mockProducts[4], quantity: 1, rate: 45000, tax: getTaxRateById(mockProducts[4].taxId), total: 57600 }
    ]
  }
];

export const mockCreditDebitNotes: CreditDebitNote[] = [
  {
    id: 'CDN001',
    noteNumber: 'CN-2024-001',
    type: CreditDebitNoteType.Credit,
    customer: mockCustomers[0],
    invoiceId: 'INV001',
    issueDate: '2024-07-20',
    amount: 5000,
    reason: 'Goods returned: Damaged item',
    status: CreditDebitNoteStatus.Issued,
  },
  {
    id: 'CDN002',
    noteNumber: 'DN-2024-001',
    type: CreditDebitNoteType.Debit,
    customer: mockCustomers[1],
    issueDate: '2024-07-22',
    amount: 1200,
    reason: 'Price correction on invoice INV002',
    status: CreditDebitNoteStatus.Issued,
  },
  {
    id: 'CDN003',
    noteNumber: 'CN-2024-002',
    type: CreditDebitNoteType.Credit,
    customer: mockCustomers[3],
    issueDate: '2024-07-25',
    amount: 880,
    reason: 'Discount not applied on initial invoice',
    status: CreditDebitNoteStatus.Draft,
  },
];

export const mockChartOfAccounts: Account[] = [
  { id: 'ACC001', name: 'Cash', type: AccountType.Asset },
  { id: 'ACC002', name: 'Bank Account', type: AccountType.Asset },
  { id: 'ACC003', name: 'Accounts Receivable', type: AccountType.Asset },
  { id: 'ACC004', name: 'Inventory', type: AccountType.Asset },
  { id: 'ACC005', name: 'Prepaid Expenses', type: AccountType.Asset },
  { id: 'ACC101', name: 'Accounts Payable', type: AccountType.Liability },
  { id: 'ACC102', name: 'Unearned Revenue', type: AccountType.Liability },
  { id: 'ACC103', name: 'Loans Payable', type: AccountType.Liability },
  { id: 'ACC151', name: 'Capital Account', type: AccountType.Equity },
  { id: 'ACC152', name: 'Retained Earnings', type: AccountType.Equity },
  { id: 'ACC201', name: 'Sales Revenue', type: AccountType.Income },
  { id: 'ACC202', name: 'Service Revenue', type: AccountType.Income },
  { id: 'ACC301', name: 'Rent Expense', type: AccountType.Expense },
  { id: 'ACC302', name: 'Salaries Expense', type: AccountType.Expense },
  { id: 'ACC303', name: 'Utilities Expense', type: AccountType.Expense },
  { id: 'ACC304', name: 'Cost of Goods Sold', type: AccountType.Expense },
];

export const mockJournalVouchers: JournalVoucher[] = [
  {
    id: 'JV000',
    voucherNumber: 'JV-2024-000',
    date: '2024-07-01',
    narration: 'Initial capital investment by owner.',
    entries: [
      { accountId: 'ACC002', debit: 500000, credit: 0 },
      { accountId: 'ACC151', debit: 0, credit: 500000 },
    ],
  },
  {
    id: 'JV001',
    voucherNumber: 'JV-2024-001',
    date: '2024-07-10',
    narration: 'Cash sales made for the day.',
    entries: [
      { accountId: 'ACC001', debit: 50000, credit: 0 },
      { accountId: 'ACC201', debit: 0, credit: 50000 },
    ],
  },
  {
    id: 'JV002',
    voucherNumber: 'JV-2024-002',
    date: '2024-07-12',
    narration: 'Paid office rent for July via bank transfer.',
    entries: [
      { accountId: 'ACC301', debit: 25000, credit: 0 },
      { accountId: 'ACC002', debit: 0, credit: 25000 },
    ],
  },
  {
    id: 'JV003',
    voucherNumber: 'JV-2024-003',
    date: '2024-07-15',
    narration: 'Purchase of goods on credit from a supplier.',
    entries: [
      { accountId: 'ACC004', debit: 75000, credit: 0 },
      { accountId: 'ACC101', debit: 0, credit: 75000 },
    ],
  },
  {
    id: 'JV004',
    voucherNumber: 'JV-2024-004',
    date: '2024-07-28',
    narration: 'Payment to Global Raw Materials for supplies.',
    entries: [
      { accountId: 'ACC101', debit: 15000, credit: 0 },
      { accountId: 'ACC002', debit: 0, credit: 15000 },
    ],
  },
  {
    id: 'JV005',
    voucherNumber: 'JV-2024-005',
    date: '2024-07-25',
    narration: 'Received payment from Innovate Corp.',
    entries: [
      { accountId: 'ACC002', debit: 50000, credit: 0 },
      { accountId: 'ACC003', debit: 0, credit: 50000 },
    ],
  },
];

export const mockBankStatementTransactions: BankStatementTransaction[] = [
  { id: 'BST001', date: '2024-07-01', description: 'Opening Balance/Capital Infusion', debit: 0, credit: 500000 },
  { id: 'BST002', date: '2024-07-12', description: 'Rent Payment - July', debit: 25000, credit: 0 },
  { id: 'BST003', date: '2024-07-26', description: 'Client Payment - Innovate Corp', debit: 0, credit: 50000 },
  { id: 'BST004', date: '2024-07-31', description: 'Bank Service Charge', debit: 500, credit: 0 },
  { id: 'BST005', date: '2024-07-31', description: 'Interest Credited', debit: 0, credit: 1250 },
];

export const mockGrns: GRN[] = [
  {
    id: 'GRN001',
    grnNumber: 'GRN-2024-001',
    purchaseOrderId: 'PO001',
    purchaseOrderNumber: 'PO-2024-001',
    supplier: mockSuppliers[0],
    grnDate: '2024-07-25',
    status: GRNStatus.Completed,
    items: [
      {
        product: mockProducts[6],
        orderedQuantity: 2,
        receivedQuantity: 2,
      },
    ]
  }
];

export const mockBoms: BOM[] = [
  {
    id: 'BOM001',
    bomNumber: 'BOM-2024-001',
    product: mockProducts.find(p => p.id === 'P014')!,
    creationDate: '2024-07-20',
    items: [
      { product: mockProducts.find(p => p.id === 'P015')!, quantity: 1 },
      { product: mockProducts.find(p => p.id === 'P016')!, quantity: 1 },
      { product: mockProducts.find(p => p.id === 'P017')!, quantity: 2 },
    ]
  }
];

export const mockProductionOrders: ProductionOrder[] = [
  {
    id: 'PROD001',
    orderNumber: 'PROD-2024-001',
    bomId: 'BOM001',
    quantityToProduce: 5,
    orderDate: '2024-07-22',
    expectedCompletionDate: '2024-07-29',
    status: ProductionOrderStatus.Completed,
    actualQuantityProduced: 5,
  },
  {
    id: 'PROD002',
    orderNumber: 'PROD-2024-002',
    bomId: 'BOM001',
    quantityToProduce: 10,
    orderDate: '2024-07-28',
    expectedCompletionDate: '2024-08-05',
    status: ProductionOrderStatus.Planned,
  },
];

export const dashboardMetrics = {
    totalRevenue: 336300,
    pendingAmount: 132160 + 18880,
    overdueInvoices: 1,
    newCustomers: 4
};

export const monthlySalesData = [
    { name: 'Jan', sales: 400000 },
    { name: 'Feb', sales: 300000 },
    { name: 'Mar', sales: 500000 },
    { name: 'Apr', sales: 450000 },
    { name: 'May', sales: 600000 },
    { name: 'Jun', sales: 550000 },
    { name: 'Jul', sales: 700000 },
];