export interface ContextValues {
  accountRs?: string;
  accountSeed?: string;
  fetchFn?: () => Promise<void>;
  flushFn?: () => void;
}
