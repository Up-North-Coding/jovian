//
// Snackbar message text
//

export const messageText = {
  // Transaction related messages
  transaction: {
    success: "Transaction Sent",
    failure: "Transaction Failed",
    cancel: "Transaction Cancelled",
  },

  // Order placement related messages
  orders: {
    success: "Order Placed",
    failure: "Failed to Place Order",
    sufficientDepth: "Sufficient Depth to Completely Execute Order",
    lowDepth: "Insufficient Depth to Complelty Execute Order, Proceed Only If You Know What You Are Doing!",
  },

  // Copy (clipboard) related messages
  copy: {
    success: "Copied to Clipboard",
    failure: "Failed to Copy",
  },

  // Modifications to userInfo (name, descr, etc..)
  userInfo: {
    success: "User Info updated successfully, please wait a block to see the changes.",
    failure: "Failed to Update User Info",
  },

  // Address book updates
  addressBook: {
    success: "Address Added Successfully",
    failure: "Failed to Add Address",
    delete: "Address Deleted Successfully",
    duplicate: "Duplicate Address, Address Already in Addressbook",
  },

  validation: {
    addressInvalid: "Invalid address, please try again.",
    quantityInvalid: "Invalid quantity, please try again.",
    priceInvalid: "Invalid price, please try again.",
    secretLengthWarning: "Warning: Normal seed phrases are 12 words long. The seed you entered was not. Did you enter your seed correctly?",
  },

  // critical/fatal errors
  critical: {
    missingAccountRsOrPublicKey: "CRITICAL: No accountRs or publicKey found, please try logging in again!",
    mitm: "URL is not nodes.jup.io, this is likely an imposter website trying to steal your coins. DO NOT LOG IN!",
    noBlockDetailToDisplay: "No block detail to display, this should not happen. Contact the team if this continues.",
  },

  // error messages (eg, api errors)
  errors: {
    api: "Api error fetching: {api}",
  },
};
