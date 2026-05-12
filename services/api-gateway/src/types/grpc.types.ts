import * as grpc from '@grpc/grpc-js';

// gRPC error shape
export interface GrpcError {
  code: number;
  message: string;
  httpStatus?: number;
  details?: string;
}

// Generic gRPC response wrapper
export interface GrpcResponse {
  success: boolean;
  message: string;
}

// Product shapes
export interface ProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
}

export interface ProductResponse extends GrpcResponse {
  product?: ProductData;
}

export interface ProductListResponse extends GrpcResponse {
  count: number;
  products: ProductData[];
}

export interface DeleteProductResponse extends GrpcResponse {}

// Order shapes
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
}

export interface OrderResponse extends GrpcResponse {
  order?: OrderData;
}

export interface OrderListResponse extends GrpcResponse {
  count: number;
  orders: OrderData[];
}

// Typed gRPC callback
type GrpcCallback<T> = (err: GrpcError | null, response: T) => void;

// Typed Product gRPC Client
export interface ProductClient extends grpc.Client {
  GetAllProducts(
    payload: { category: string },
    cb: GrpcCallback<ProductListResponse>,
  ): void;
  GetProduct(payload: { id: number }, cb: GrpcCallback<ProductResponse>): void;
  CreateProduct(payload: object, cb: GrpcCallback<ProductResponse>): void;
  UpdateProduct(payload: object, cb: GrpcCallback<ProductResponse>): void;
  DeleteProduct(
    payload: { id: number },
    cb: GrpcCallback<DeleteProductResponse>,
  ): void;
}

// Typed Order gRPC Client
export interface OrderClient extends grpc.Client {
  GetAllOrders(
    payload: { status: string },
    cb: GrpcCallback<OrderListResponse>,
  ): void;
  GetOrder(payload: { id: string }, cb: GrpcCallback<OrderResponse>): void;
  CreateOrder(payload: object, cb: GrpcCallback<OrderResponse>): void;
  UpdateOrderStatus(
    payload: { id: string; status: string },
    cb: GrpcCallback<OrderResponse>,
  ): void;
}
