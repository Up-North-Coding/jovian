//
// The best place to store parameters which aren't yet exposed to the user but which we may want to expose
//

// Used to calculate the origination time of new transactions
export const JUPGenesisTimestamp = 1508627969; // can be found in getConstants() API call as "epochBeginning"

// TODO: implement as advanced features?
export const standardFee = "5000"; // may need adjustment for different tx types, but for now everything is working with this fee
export const standardDeadline = 1440; // deadline for confirmation, required in most (all?) txs
export const userLocale = { localeStr: "en-US", options: { timeZone: "America/Chicago" } }; // CST for testing, controls date/time stamps for human readability
export const unitPrecision = 8; // 8 digits of unit precision, used broadly

export const TableRowsPerPageOptions = [3, 5];
export const DefaultTableRowsPerPage = TableRowsPerPageOptions[0]; // default to the first option in the list of options
