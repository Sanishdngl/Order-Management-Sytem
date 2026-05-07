import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { ProductStore } from "../data/products";

// GET single product
export const getProduct = (
  call: ServerUnaryCall<{ id: number }, object>,
  callback: sendUnaryData<object>
) => {
  const product = ProductStore.getById(call.request.id);

  if (!product) {
    return callback({
      code: status.NOT_FOUND,
      message: `Product ${call.request.id} not found`,
    });
  }

  callback(null, { success: true, message: "OK", product });
};

// GET all products
export const getAllProducts = (
  call: ServerUnaryCall<{ category: string }, object>,
  callback: sendUnaryData<object>
) => {
  const products = ProductStore.getAll(call.request.category || undefined);
  callback(null, { success: true, count: products.length, products });
};

// CREATE product
export const createProduct = (
  call: ServerUnaryCall<
    {
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
    },
    object
  >,
  callback: sendUnaryData<object>
) => {
  const { name, description, price, stock, category } = call.request;

  if (!name || !price || !category) {
    return callback({
      code: status.INVALID_ARGUMENT,
      message: "name, price and category are required",
    });
  }

  const product = ProductStore.create({
    name,
    description,
    price,
    stock,
    category,
  });
  callback(null, { success: true, message: "Product created", product });
};

// UPDATE product
export const updateProduct = (
  call: ServerUnaryCall<
    {
      id: number;
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
    },
    object
  >,
  callback: sendUnaryData<object>
) => {
  const { id, ...data } = call.request;
  const product = ProductStore.update(id, data);

  if (!product) {
    return callback({
      code: status.NOT_FOUND,
      message: `Product ${id} not found`,
    });
  }

  callback(null, { success: true, message: "Product updated", product });
};

// DELETE product
export const deleteProduct = (
  call: ServerUnaryCall<{ id: number }, object>,
  callback: sendUnaryData<object>
) => {
  const deleted = ProductStore.delete(call.request.id);

  if (!deleted) {
    return callback({
      code: status.NOT_FOUND,
      message: `Product ${call.request.id} not found`,
    });
  }

  callback(null, { success: true, message: "Product deleted" });
};
