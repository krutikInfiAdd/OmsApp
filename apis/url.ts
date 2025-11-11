const Prot = "7068";
export const BaseURl = `https://localhost:${Prot}/api`;



export const APISURLS = {
    LOGIN: `${BaseURl}/Auth/login`,

    REGISTER: `${BaseURl}/User/add`,

    Company: {
        Create: `${BaseURl}/Company/add`,
        GetAll: `${BaseURl}/Company/get-all`,
        Delete: `${BaseURl}/Company/delete`,
        Update: `${BaseURl}/Company/update`,
        DDL: `${BaseURl}/Company/get-list-items`,
    },


    Customers: {
        Create: `${BaseURl}/Customers/add`,
        GetAll: `${BaseURl}/Customers/get-all`,
        Delete: `${BaseURl}/Customers/delete`,
        Update: `${BaseURl}/Customers/update`,
    },

    Vendor: {
        GetAll: `${BaseURl}/Vendors/get-all`,
        Create: `${BaseURl}/Vendors/add`,
        Delete: `${BaseURl}/Vendors/delete`,
        Update: `${BaseURl}/Vendors/update`,
    },

    Categories: {
        GetAll: `${BaseURl}/Category/get-all`,
        Create: `${BaseURl}/Category/add`,
        Delete: `${BaseURl}/Category/delete`,
        Update: `${BaseURl}/Category/update`,
        DDL: `${BaseURl}/Category/get-list-items`,
    },

    SubCategories: {
        GetAll: `${BaseURl}/SubCategory/get-all`,
        Create: `${BaseURl}/SubCategory/add`,
        Delete: `${BaseURl}/SubCategory/delete`,
        Update: `${BaseURl}/SubCategory/update`,
        DDL: `${BaseURl}/SubCategory/get-list-items`,
    },


    Products: {
        GetAll: `${BaseURl}/Products/get-all`,
        Create: `${BaseURl}/Products/add`,
        Delete: `${BaseURl}/Products/delete`,
        Update: `${BaseURl}/Products/update`,
    },

    Supplier: {
        GetAll: `${BaseURl}/Suppliers/get-all`,
        Create: `${BaseURl}/Suppliers/add`,
        Delete: `${BaseURl}/Suppliers/delete`,
        Update: `${BaseURl}/Suppliers/update`,
    },



    TaxSlabs: {
        GetAll: `${BaseURl}/SubCategory/get-all`,
        Create: `${BaseURl}/SubCategory/add`,
        Delete: `${BaseURl}/SubCategory/delete`,
        Update: `${BaseURl}/SubCategory/update`,
        DDL: `${BaseURl}/TaxSlabs/get-list-items`,
    },



    //Generic api 
    // GETALLROLES: `${BaseURl + Generic}/api/Generic/get-all-role-ddl`,

    // GetAllTeaMember: `${BaseURl + Team}/api/Teams/get-all?PageNumber=0&PageSize=10`,

}