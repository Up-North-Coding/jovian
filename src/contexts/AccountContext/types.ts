export interface ContextValues {
  accountId?: string;
  accountRs?: string;
  accountSeed?: string;
  accountName?: string;
  accountDescription?: string;
  publicKey?: string;
  balance?: string;
  userLogin?: (account: string) => void;
  userLogout?: () => void;
  fetchNewAccount?: () => Promise<void>;
  flushFn?: () => void;
}
