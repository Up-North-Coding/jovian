// returns true if the polling frequency has been reached
// returns false if the polling frequency has not been reached
export function isPollingFrequencyMet(frequency: number, lastHeight: number, currentHeight: number): boolean {
  // console.log(`frequency: ${frequency} lastHeight: ${lastHeight} currentHeight: ${currentHeight} next: ${lastHeight + frequency}`);
  return lastHeight + frequency <= currentHeight ? true : false;
}
