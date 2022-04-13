export interface ContextValues {
  accountRs?: string;
  accountSeed?: string;
  fetchFn?(): void;
  flushFn?(): void;
}
