import * as grpc from "@grpc/grpc-js";

export const loggingInterceptor = (
  options: grpc.InterceptorOptions,
  nextCall: (options: grpc.InterceptorOptions) => grpc.InterceptingCall
): grpc.InterceptingCall => {
  const startTime = Date.now();
  let methodName = options.method_definition?.path || "unknown";

  return new grpc.InterceptingCall(nextCall(options), {
    // Runs before the request is sent
    start: (metadata, listener, next) => {
      console.log(`gRPC Request  → ${methodName}`);

      next(metadata, {
        // Runs when response is received
        onReceiveMessage: (message, nextMessage) => {
          const duration = Date.now() - startTime;
          console.log(`gRPC Response ← ${methodName} [${duration}ms]`);
          nextMessage(message);
        },

        // Runs when call status arrives
        onReceiveStatus: (status, nextStatus) => {
          if (status.code !== grpc.status.OK) {
            console.error(`gRPC Error ← ${methodName}`, {
              code: status.code,
              details: status.details,
            });
          }
          nextStatus(status);
        },
      });
    },
  });
};
