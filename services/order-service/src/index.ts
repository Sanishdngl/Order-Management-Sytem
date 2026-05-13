import 'dotenv/config';
import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import {
  getOrder,
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from './handlers/order.handler';

const PORT = process.env.GRPC_PORT || '50052';
const isProd = process.env.NODE_ENV === 'production';

const PROTO_ROOT = path.join(__dirname, isProd ? '../proto' : '../../../proto');

const PROTO_PATH = path.join(PROTO_ROOT, 'services/order.proto');

// Load .proto file
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [PROTO_ROOT],
});

interface OrderServiceProto {
  order: {
    OrderService: {
      service: grpc.ServiceDefinition;
    };
  };
}

const proto = grpc.loadPackageDefinition(
  packageDef,
) as unknown as OrderServiceProto;

const server = new grpc.Server();

server.addService(proto.order.OrderService.service, {
  GetOrder: getOrder,
  GetAllOrders: getAllOrders,
  CreateOrder: createOrder,
  UpdateOrderStatus: updateOrderStatus,
});

server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Order Service failed to start:', err);
      process.exit(1);
    }
    console.log(`Order Service running on port ${port}`);
    console.log(`📁 Proto root: ${PROTO_ROOT}`);
    console.log(`📄 Proto path: ${PROTO_PATH}`);
  },
);
