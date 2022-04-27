export interface ContextValues {
  accountRs?: string;
  accountSeed?: string;
  accountName?: string;
  publicKey?: string;
  userLogin?: (account: string) => void;
  fetchFn?: () => Promise<void>;
  flushFn?: () => void;
}
