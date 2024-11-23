export interface Address {
    line1: string;
    line2: string;
  }
  
  export interface UserData {
    _id: string;
    name: string;
    email: string; 
    phone: string;
    gender: string;
    dob: string;
    address: Address;
  }
  
  export type AdminCategoryData = {
    categoryname: string;
    description: string;
  }