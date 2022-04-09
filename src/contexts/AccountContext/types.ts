export interface ContextValues {
  accountRs?: string;
  accountSeed?: string;

  // CR: define the function args here as a best practice along with it's return type instead of 'Function'
  fetchFn?: Function;
}
