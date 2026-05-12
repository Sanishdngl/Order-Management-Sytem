import { Request, Response } from 'express';
import { orderClient } from '../clients/grpc.client';
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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall((p, cb) => orderClient.GetAllOrders(p, cb), {
      status: String(req.query.status ?? ''),
    });
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall((p, cb) => orderClient.GetOrder(p, cb), {
      id: req.params.id as string,
    });
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall(
      (p, cb) => orderClient.CreateOrder(p, cb),
      req.body,
    );
    res.status(201).json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const data = await grpcCall(
      (p, cb) => orderClient.UpdateOrderStatus(p, cb),
      { id: req.params.id as string, status: req.body.status as string },
    );
    res.json(data);
  } catch (err) {
    handleGrpcError(err, res);
  }
};
