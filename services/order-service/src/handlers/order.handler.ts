import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { OrderStore } from "../data/orders";

// GET single order
export const getOrder = (
  call: ServerUnaryCall<{ id: string }, object>,
  callback: sendUnaryData<object>
) => {
  const order = OrderStore.getById(call.request.id);

  if (!order) {
    return callback({
      code: status.NOT_FOUND,
      message: `Order ${call.request.id} not found`,
    });
  }

  callback(null, { success: true, message: "OK", order });
};

// GET all orders
export const getAllOrders = (
  call: ServerUnaryCall<{ status: string }, object>,
  callback: sendUnaryData<object>
) => {
  const orders = OrderStore.getAll(call.request.status || undefined);
  callback(null, { success: true, count: orders.length, orders });
};

// CREATE order
export const createOrder = (
  call: ServerUnaryCall<
    {
      customer_name: string;
      customer_email: string;
      items: { product_id: number; quantity: number; price: number }[];
    },
    object
  >,
  callback: sendUnaryData<object>
) => {
  const { customer_name, customer_email, items } = call.request;

  if (!customer_name || !customer_email) {
    return callback({
      code: status.INVALID_ARGUMENT,
      message: "customer_name and customer_email are required",
    });
  }

  if (!items || items.length === 0) {
    return callback({
      code: status.INVALID_ARGUMENT,
      message: "Order must have at least one item",
    });
  }

  const order = OrderStore.create({ customer_name, customer_email, items });
  callback(null, { success: true, message: "Order created", order });
};

// UPDATE order status
export const updateOrderStatus = (
  call: ServerUnaryCall<{ id: string; status: string }, object>,
  callback: sendUnaryData<object>
) => {
  const validStatuses = ["pending", "confirmed", "shipped", "delivered"];

  if (!validStatuses.includes(call.request.status)) {
    return callback({
      code: status.INVALID_ARGUMENT,
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
  }

  const order = OrderStore.updateStatus(
    call.request.id,
    call.request.status as "pending" | "confirmed" | "shipped" | "delivered"
  );

  if (!order) {
    return callback({
      code: status.NOT_FOUND,
      message: `Order ${call.request.id} not found`,
    });
  }

  callback(null, { success: true, message: "Order status updated", order });
};
