//
// Formats different types of things to better formatted types of things
//

import { JUPGenesisTimestamp, userLocale } from "./constants";

export function TimestampToDate(timestamp: number): string {
  return new Date(timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options);
}
