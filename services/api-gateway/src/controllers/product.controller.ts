import { Request, Response } from 'express';
import { productClient } from '../clients/grpc.client';
import { GrpcError } from '../types/grpc.types';

const grpcCall = <TPayload extends object, TResponse>(
  method: (
    payload: TPayload,
    cb: (err: GrpcError | null, res: TResponse) => void,
  ) => void,
  payload: TPayload,
): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    method(payload, (err: GrpcError | null, response: TResponse) => {
      if (err) {
        try {
          const parsed = JSON.parse(err.details || '{}');
          err.httpStatus = parsed.httpStatus;
          err.message = parsed.message || err.message;
        } catch {
          err.httpStatus = 500;
        }
        return reject(err);
      }
      resolve(response);
    });
  });
};

const handleGrpcError = (err: unknown, res: Response): void => {
  const grpcErr = err as GrpcError;
  res.status(grpcErr.httpStatus || 500).json({
    success: false,
    message: grpcErr.message || 'Internal server error',
  });
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall(
      (p, cb) => productClient.GetAllProducts(p, cb),
      { category: String(req.query.category ?? '') },
    );
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall((p, cb) => productClient.GetProduct(p, cb), {
      id: Number(req.params.id),
    });
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall(
      (p, cb) => productClient.CreateProduct(p, cb),
      req.body,
    );
    res.status(201).json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall((p, cb) => productClient.UpdateProduct(p, cb), {
      id: Number(req.params.id),
      ...req.body,
    });
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall((p, cb) => productClient.DeleteProduct(p, cb), {
      id: Number(req.params.id),
    });
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};
