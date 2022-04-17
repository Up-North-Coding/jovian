//
// useful validation functions
//

// currently performs basic format checking, should be extended to support the JUP characters actually used in the NXT standards
// TODO: See if breaking the regex into individual hyphenated checks ["JUP", "ABCD", "EFGH"] is easier to read/write
export function isValidAddress(address) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/;

  if (JUPREGEX.test(address)) {
    return true;
  }
  return false;
}
