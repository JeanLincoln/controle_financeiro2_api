export const handleAsync = <T>(promise: Promise<T>) =>
  promise.then((result) => [null, result]).catch((error) => [error]);
