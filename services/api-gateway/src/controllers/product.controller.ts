import { Request, Response } from "express";
import { productClient } from "../clients/grpc.client";

// Helper — wraps gRPC callback into a Promise
const grpcCall = <T>(method: Function, payload: object): Promise<T> => {
  return new Promise((resolve, reject) => {
    method.call(productClient, payload, (err: any, response: T) => {
      if (err) {
        // Try to parse enriched error from error interceptor
        try {
          const parsed = JSON.parse(err.details);
          err.httpStatus = parsed.httpStatus;
          err.message = parsed.message;
        } catch {
          err.httpStatus = 500;
        }
        return reject(err);
      }
      resolve(response);
    });
  });
};

// GET /api/products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      productClient.GetAllProducts.bind(productClient),
      { category: req.query.category || "" }
    );
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      productClient.GetProduct.bind(productClient),
      { id: Number(req.params.id) }
    );
    res.json(data);
  } catch (err: any) {
    const status = err.code === 5 ? 404 : 500; // 5 = NOT_FOUND
    res.status(status).json({ success: false, message: err.message });
  }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      productClient.CreateProduct.bind(productClient),
      req.body
    );
    res.status(201).json(data);
  } catch (err: any) {
    const status = err.code === 3 ? 400 : 500; // 3 = INVALID_ARGUMENT
    res.status(status).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      productClient.UpdateProduct.bind(productClient),
      { id: Number(req.params.id), ...req.body }
    );
    res.json(data);
  } catch (err: any) {
    const status = err.code === 5 ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall<any>(
      productClient.DeleteProduct.bind(productClient),
      { id: Number(req.params.id) }
    );
    res.json(data);
  } catch (err: any) {
    const status = err.code === 5 ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};
