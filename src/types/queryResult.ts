interface SuccessQueryResult<T> {
  error?: null;
  data: T;
}

interface ErrorQueryResult {
  error: Error;
  data?: null;
}

export type QueryResult<T> = SuccessQueryResult<T> | ErrorQueryResult;
