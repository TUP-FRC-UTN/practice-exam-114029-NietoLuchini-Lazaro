export interface Order {
    id: string;
    customerName: string;
    email: string;
    products: Product[];
    total: number;
    orderCode: string;
    timestamp: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    stock: number;
    price: number;
  }