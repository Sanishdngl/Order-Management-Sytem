import { v4 as uuidv4 } from "uuid";

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  created_at: string;
}

let orders: Order[] = [
  {
    id: uuidv4(),
    customer_name: "John Doe",
    customer_email: "john@example.com",
    items: [{ product_id: 1, quantity: 1, price: 1999.99 }],
    total: 1999.99,
    status: "confirmed",
    created_at: new Date().toISOString(),
  },
];

export const OrderStore = {
  getAll: (status?: string): Order[] => {
    if (status) return orders.filter((o) => o.status === status);
    return orders;
  },

  getById: (id: string): Order | null => {
    return orders.find((o) => o.id === id) || null;
  },

  create: (data: {
    customer_name: string;
    customer_email: string;
    items: OrderItem[];
  }): Order => {
    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order: Order = {
      id: uuidv4(),
      ...data,
      total: Math.round(total * 100) / 100,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    orders.push(order);
    return order;
  },

  updateStatus: (id: string, status: Order["status"]): Order | null => {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    orders[index].status = status;
    return orders[index];
  },
};
