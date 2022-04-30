export interface ContextValues {
  isSignedIn?: boolean;
  signIn?: (account: string) => void;
}
