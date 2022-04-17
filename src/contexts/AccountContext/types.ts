export interface ContextValues {
  accountRs?: string;
  accountSeed?: string;
  accountAlias?: string;
  userLogin?: (account: string) => void;
  fetchFn?: () => Promise<void>;
  flushFn?: () => void;
}
