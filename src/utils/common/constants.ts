//
// The best place to store parameters which aren't yet exposed to the user but which we may want to expose
//

// TODO: implement some of these items as advanced features?

type IStandardTimestamp = () => number;

// Transaction stuff
export const JUPGenesisTimestamp = 1508627969; // can be found in getConstants() API call as "epochBeginning", used to calculate the origination time of new transactions
export const standardFee = "5000"; // may need adjustment for different tx types, but for now everything is working with this fee
export const standardDeadline = 1440; // deadline for confirmation, required in most (all?) txs
export const standardTimestamp: IStandardTimestamp = () => Math.round(Date.now() / 1000) - JUPGenesisTimestamp; // Seconds since Genesis. sets the origination time of the tx (since broadcast can happen later).
export const standardTransactionVersion = 1; // Havn't seen anything but version 1 thus far
export const standardPhasedSetting = false; // we don't support phased tx's
export const standardECBlockheight = 0; // 0 seems like the safest choice here
export const AssetTransferType = 2; // tx type for asset transfers
export const AssetTransferSubType = 1; // tx sub type for asset transfers

// General stuff
export const JUPSidebarWidth = 280; // controls the width of the sidebar nav/details
export const userLocale = { localeStr: "en-US", options: { timeZone: "America/Chicago" } }; // CST for testing, controls date/time stamps for human readability
export const LongUnitPrecision = 8; // 8 digits of unit precision, used broadly
export const ShortUnitPrecision = 2; // 2 digits of unit precision, used broadly
export const PrecisionExponent = 8; // Used for conversion of NXT->NQT values
export const MaximumSupply = 1000000000; // Maximum JUP supply in human readable units
export const OneDayOfBlocks = 8640; // at ten seconds per block this is ~24 hours of blocks

//  Table stuff
export const TableRowsPerPageOptions = { short: [3, 5], long: [10, 25, 50, 100] }; // Which row count options should be displayed in tables
export const DefaultShortTableRowsPerPage = TableRowsPerPageOptions.short[0]; // default to the first option in the list of short options
export const DefaultLongTableRowsPerPage = TableRowsPerPageOptions.long[0]; // default to the first option in the list of long options
export const DefaultTransitionTime = 500; // Controls animation transition time for tables

// Block fetching stuff
export const BlockPollingFrequency = 5000; // how often to check for fresh blocks (higher number greatly reduces API call qty)
export const DefaultBlockOffset = 0; // fetching is done in reverse order so index 0 is the highest block
export const DefaultBlockFetchQty = 10000; // Number of blocks to fetch (dashboard, blocks page, etc..). Using 10,000 since we need 8,700 blocks to calculate daily transaction count.

// Peer fetching stuff
export const PeerPollingFrequency = 10; // how many blocks between re-fetching peer details

// Generator fetching stuff
export const GeneratorPollingFrequency = 10; // how many blocks between re-fetching generator details

// Snackbar stuff
export const MaximumSnackbarMessages = 3; // Maximum snackbar messages before they automatically roll off

// LEDA stuff
export const LedaNFTName = "nftleda"; // currently the name of all LEDA based NFTs on mainnet
