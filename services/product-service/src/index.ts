import "dotenv/config";
import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import {
  getProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./handlers/product.handler";

const PROTO_PATH = path.join(__dirname, "../../../proto/product.proto");
const PORT = process.env.GRPC_PORT || "50051";

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
server.addService(proto.product.ProductService.service, {
  GetProduct: getProduct,
  GetAllProducts: getAllProducts,
  CreateProduct: createProduct,
  UpdateProduct: updateProduct,
  DeleteProduct: deleteProduct,
});

// Start server
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Product Service failed to start:", err);
      process.exit(1);
    }
    console.log(`Product Service running on port ${port}`);
  }
);
