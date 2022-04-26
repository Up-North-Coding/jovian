export interface ContextValues {
  user?: string;
  signIn?: (account: string) => void;
}
