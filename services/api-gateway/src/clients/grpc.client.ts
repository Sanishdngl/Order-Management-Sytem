import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { loggingInterceptor } from '../interceptors/logger.interceptor';
import { errorInterceptor } from '../interceptors/error.interceptor';
import { ProductClient, OrderClient } from '../types/grpc.types';

interface ProductProto {
  product: {
    ProductService: typeof grpc.Client;
  };
}

interface OrderProto {
  order: {
    OrderService: typeof grpc.Client;
  };
}

const PRODUCT_PROTO = path.join(
  __dirname,
  '../../../../proto/services/product.proto',
);
const ORDER_PROTO = path.join(
  __dirname,
  '../../../../proto/services/order.proto',
);

const PROTO_ROOT = path.join(__dirname, '../../../../proto');

const loaderOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [PROTO_ROOT],
};

const channelOptions: grpc.ChannelOptions = {
  interceptors: [loggingInterceptor, errorInterceptor],
};

const productPackageDef = protoLoader.loadSync(PRODUCT_PROTO, loaderOptions);
const productProto = grpc.loadPackageDefinition(
  productPackageDef,
) as unknown as ProductProto;

const orderPackageDef = protoLoader.loadSync(ORDER_PROTO, loaderOptions);
const orderProto = grpc.loadPackageDefinition(
  orderPackageDef,
) as unknown as OrderProto;

export const productClient = new productProto.product.ProductService(
  process.env.PRODUCT_SERVICE_URL || 'localhost:50051',
  grpc.credentials.createInsecure(),
  channelOptions,
) as unknown as ProductClient;

export const orderClient = new orderProto.order.OrderService(
  process.env.ORDER_SERVICE_URL || 'localhost:50052',
  grpc.credentials.createInsecure(),
  channelOptions,
) as unknown as OrderClient;

console.log('gRPC clients initialized');
