//
// Basic converter to handle the NQT (JQT?) balances returned from the API
//
// Docs: https://nxtdocs.jelurida.com/API#Quantity_Units_NXT.2C_NQT_and_QNT
//

export function NXTtoNQT(quantity: number) {
  return quantity * 10 ** 8;
}
