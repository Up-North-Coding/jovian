//
// The best place to store parameters which aren't yet exposed to the user but which we may want to expose
//

// TODO: implement some of these items as advanced features?

// Transaction stuff
export const JUPGenesisTimestamp = 1508627969; // can be found in getConstants() API call as "epochBeginning", used to calculate the origination time of new transactions
export const standardFee = "5000"; // may need adjustment for different tx types, but for now everything is working with this fee
export const standardDeadline = 1440; // deadline for confirmation, required in most (all?) txs
export const standardTimestamp = Math.round(Date.now() / 1000) - JUPGenesisTimestamp; // Seconds since Genesis. sets the origination time of the tx (since broadcast can happen later).
export const standardTransactionVersion = 1; // Havn't seen anything but version 1 thus far
export const standardPhasedSetting = false; // we don't support phased tx's
export const standardECBlockheight = 0; // 0 seems like the safest choice here
export const AssetTransferType = 2;
export const AssetTransferSubType = 1;

// Gneral stuff
export const JUPSidebarWidth = 260; // controls the width of the sidebar nav/details
export const JUPSidebarMiniWidth = 100; // controls the width of the sidebar in mobile mode
export const userLocale = { localeStr: "en-US", options: { timeZone: "America/Chicago" } }; // CST for testing, controls date/time stamps for human readability
export const LongUnitPrecision = 8; // 8 digits of unit precision, used broadly
export const ShortUnitPrecision = 2; // 2 digits of unit precision, used broadly

//  Table stuff
export const TableRowsPerPageOptions = [3, 5]; // Which row count options should be displayed in tables
export const DefaultTableRowsPerPage = TableRowsPerPageOptions[0]; // default to the first option in the list of options
export const DefaultTransitionTime = 500; // Controls animation transition time for tables

// Block fetching stuff
export const BlockPollingFrequency = 5000; // how often to check for fresh blocks (higher number greatly reduces API call qty)
export const DefaultBlockOffset = 0; // fetching is done in reverse order so index 0 is the highest block
export const DefaultBlockFetchQty = 10000; // Number of blocks to fetch (dashboard, blocks page, etc..). Using 10,000 since we need 8,700 blocks to calculate daily transaction count.

// Snackbar stuff
export const MaximumSnackbarMessages = 3; // Maximum snackbar messages before they automatically roll off
