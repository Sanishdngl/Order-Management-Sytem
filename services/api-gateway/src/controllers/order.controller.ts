import { Request, Response } from "express";
import { orderClient } from "../clients/grpc.client";

const grpcCall = <T>(method: Function, payload: object): Promise<T> => {
  return new Promise((resolve, reject) => {
    method.call(orderClient, payload, (err: Error, response: T) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
};

// GET /api/orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      orderClient.GetAllOrders.bind(orderClient),
      { status: req.query.status || "" }
    );
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
export const getOrder = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(orderClient.GetOrder.bind(orderClient), {
      id: req.params.id,
    });
    res.json(data);
  } catch (err: any) {
    const status = err.code === 5 ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      orderClient.CreateOrder.bind(orderClient),
      req.body
    );
    res.status(201).json(data);
  } catch (err: any) {
    const status = err.code === 3 ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      orderClient.UpdateOrderStatus.bind(orderClient),
      { id: req.params.id, status: req.body.status }
    );
    res.json(data);
  } catch (err: any) {
    const status = err.code === 5 ? 404 : err.code === 3 ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
