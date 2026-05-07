export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
}

// Seed data
let products: Product[] = [
  {
    id: 1,
    name: "MacBook Pro",
    description: "Powerful Apple laptop",
    price: 1999.99,
    stock: 25,
    category: "Electronics",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Nike Air Max",
    description: "Premium running shoes",
    price: 129.99,
    stock: 80,
    category: "Footwear",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Coffee Maker",
    description: "Automatic drip coffee maker",
    price: 49.99,
    stock: 5,
    category: "Kitchen",
    created_at: new Date().toISOString(),
  },
];

let nextId = 4;

export const ProductStore = {
  getAll: (category?: string): Product[] => {
    if (category) return products.filter((p) => p.category === category);
    return products;
  },

  getById: (id: number): Product | null => {
    return products.find((p) => p.id === id) || null;
  },

  create: (data: Omit<Product, "id" | "created_at">): Product => {
    const product: Product = {
      ...data,
      id: nextId++,
      created_at: new Date().toISOString(),
    };
    products.push(product);
    return product;
  },

  update: (
    id: number,
    data: Partial<Omit<Product, "id" | "created_at">>
  ): Product | null => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...data };
    return products[index];
  },

  delete: (id: number): boolean => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};
