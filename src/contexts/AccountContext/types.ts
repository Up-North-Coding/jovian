export interface ContextValues {
  accountId?: string;
  accountRs?: string;
  accountSeed?: string;
  accountName?: string;
  publicKey?: string;
  balance?: string;
  userLogin?: (account: string) => void;
  fetchFn?: () => Promise<void>;
  flushFn?: () => void;
}
