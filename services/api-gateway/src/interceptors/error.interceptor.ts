import * as grpc from "@grpc/grpc-js";

// Maps gRPC status codes to HTTP status codes
export const grpcToHttpStatus: Record<number, number> = {
  [grpc.status.OK]: 200,
  [grpc.status.CANCELLED]: 499,
  [grpc.status.UNKNOWN]: 500,
  [grpc.status.INVALID_ARGUMENT]: 400,
  [grpc.status.NOT_FOUND]: 404,
  [grpc.status.ALREADY_EXISTS]: 409,
  [grpc.status.PERMISSION_DENIED]: 403,
  [grpc.status.UNAUTHENTICATED]: 401,
  [grpc.status.RESOURCE_EXHAUSTED]: 429,
  [grpc.status.UNAVAILABLE]: 503,
  [grpc.status.DEADLINE_EXCEEDED]: 504,
  [grpc.status.INTERNAL]: 500,
};

export const errorInterceptor = (
  options: grpc.InterceptorOptions,
  nextCall: (options: grpc.InterceptorOptions) => grpc.InterceptingCall
): grpc.InterceptingCall => {
  return new grpc.InterceptingCall(nextCall(options), {
    start: (metadata, listener, next) => {
      next(metadata, {
        onReceiveStatus: (status, nextStatus) => {
          if (status.code !== grpc.status.OK) {
            const httpStatus = grpcToHttpStatus[status.code] || 500;

            // Attach HTTP status to the error details for the controller
            const enrichedStatus = {
              ...status,
              details: JSON.stringify({
                message: status.details,
                httpStatus,
                grpcCode: status.code,
              }),
            };

            nextStatus(enrichedStatus);
            return;
          }
          nextStatus(status);
        },
      });
    },
  });
};
