import "dotenv/config";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
  getOrder,
  getAllOrders,
  createOrder,
  updateOrderStatus,
} from "./handlers/order.handler";

const PROTO_PATH = path.join(__dirname, "../../../proto/order.proto");
const PORT = process.env.GRPC_PORT || "50052";

// Load .proto file
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDef) as any;

// Create gRPC server
const server = new grpc.Server();

// Register service + handlers
server.addService(proto.order.OrderService.service, {
  GetOrder: getOrder,
  GetAllOrders: getAllOrders,
  CreateOrder: createOrder,
  UpdateOrderStatus: updateOrderStatus,
});

// Start server
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Order Service failed to start:", err);
      process.exit(1);
    }
    console.log(`Order Service running on port ${port}`);
  }
);
