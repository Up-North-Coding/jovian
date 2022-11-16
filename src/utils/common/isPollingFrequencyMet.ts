// returns true if the polling frequency has been reached
// returns false if the polling frequency has not been reached
export function isPollingFrequencyMet(frequency: number, lastHeight: number, currentHeight: number): boolean {
  return lastHeight + frequency <= currentHeight;
}
