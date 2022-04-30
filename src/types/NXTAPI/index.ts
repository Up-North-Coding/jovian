/*
 *
 * Interfaces for Jupiter Wallet's NXT API responses
 *
 */

export interface IBaseAPIResult {
  requestProcessingTime: number;
}

export interface IGetBlockchainStatusResult extends IBaseAPIResult {
  currentMinRollbackHeight: number;
  numberOfBlocks: number;
  isTestnet: boolean;
  includeExpiredPrunable: boolean;
  version: string;
  maxRollback: number;
  lastBlock: string;
  application: string;
  isScanning: boolean;
  isDownloading: boolean;
  cumulativeDifficulty: string;
  lastBlockchainFeederHeight: number;
  maxPrunableLifetime: number;
  time: number;
  lastBlockchainFeeder: string;
}

export interface IGetAccountResult extends IBaseAPIResult {
  account: string;
  accountRS: string;
  balanceNQT: string;
  description: string;
  forgedBalanceNQT: string;
  name: string;
  publicKey: string;
  unconfirmedBalanceNQT: string;
}

export interface IGetAccountIdResult extends IBaseAPIResult {
  accountRS: string;
  publicKey: string;
  account: string;
}

export interface IGetBalanceResult extends IBaseAPIResult {
  unconfirmedBalanceNQT: string;
  forgedBalanceNQT: string;
  balanceNQT: string;
}

export interface IUnsignedTransaction {
  sender?: string;
  senderRS: string;
  recipient?: string;
  recipientRS: string;
  amountNQT: string;
  version: number;
  type: number;
  subtype: number;
  phased: boolean;
  attachment: ITransactionAttachment;
  senderPublicKey?: string;
  feeNQT: string;
  deadline: number;
  secret: string;
  ecBlockHeight: number;
  timestamp: number;
}

export interface ITransactionAttachment {
  "version.PrunablePlainMessage"?: number;
  messageIsText?: boolean;
  messageHash?: string;
  message?: string;
  "version.OrdinaryPayment": number;
}

export interface ISignedTransactionResult extends IBaseAPIResult, IUnsignedTransaction {
  transactionJSON: {
    signature: string;
  };
}

export interface ISignedTransaction extends IUnsignedTransaction {
  signature: string;
}

export interface IBroadcastTransactionResult extends IBaseAPIResult {
  transaction: string;
  fullHash: string;
}

//
// Not used yet, move to the section above as these are used
//

export interface IBlock {
  previousBlockHash: string;
  payloadLength: number;
  totalAmountNQT: string;
  generationSignature: string;
  generator: string;
  generatorPublicKey: string;
  baseTarget: string;
  payloadHash: string;
  generatorRS: string; // Does it make sense to have an "address" type which is a string for clarity?
  numberOfTransactions: number;
  blockSignature: string;
  transactions: Array<ITransaction>;
  version: number;
  totalFeeNQT: string;
  previousBlock: string;
  cumulativeDifficulty: string;
  block: string;
  height: number;
  timestamp: number;
}

export interface ITransaction {
  signature: string;
  transactionIndex: number;
  type: number;
  phased: false;
  ecBlockId: string;
  signatureHash: string;
  attachment: ITransactionAttachment;
  senderRS: string;
  subtype: number;
  amountNQT: string;
  recipientRS: string;
  block: string;
  blockTimestamp: number;
  deadline: number;
  timestamp: number;
  height: number;
  senderPublicKey: string;
  feeNQT: string;
  confirmations: number;
  fullHash: string;
  version: number;
  sender: string;
  recipient: string;
  ecBlockHeight: number;
  transaction: string;
}

export interface IAsset {
  initialQuantityQNT: string;
  quantityQNT: string;
  accountRS: string;
  decimals: number;
  name: string;
  description: string;
  asset: string;
  account: string;
}

// GetAccountAssets()
export interface IAccountAsset {
  quantityQNT: string;
  unconfirmedQuantityQNT: string;
  asset: string;
}

export interface IOpenOrder {
  quantityQNT: string;
  priceNQT: string;
  transactionHeight: number;
  accountRS: string;
  transactionIndex: number;
  asset: string;
  type: string;
  account: string;
  order: string;
  height: number;
}

export interface IAccount {
  accountRS: string;
  name: string;
  description: string;
  forgedBalanceNQT: string;
  balanceNQT: string;
  unconfirmedBalanceNQT: string;
  publicKey: string;
  account: string;
}

export interface IAlias {
  aliasURI: string;
  aliasName: string;
  accountRS: string;
  alias: string;
  account: string;
  timestamp: number;
}

// GetAccountLedger()
export interface ILedgerEntry {
  ledgerId: string;
  isTransactionEvent: boolean;
  balance: string;
  holdingType: string;
  accountRS: string;
  change: string;
  block: string;
  eventType:
    | "BLOCK_GENERATED"
    | "REJECT_PHASED_TRANSACTIOD"
    | "TRANSACTION_FED"
    | "ORDINARY_PAYMEND"
    | "ACCOUNT_INFD"
    | "ALIAS_ASSIGNMEND"
    | "ALIAS_BUD"
    | "ALIAS_DELETD"
    | "ALIAS_SELD"
    | "ARBITRARY_MESSAGD"
    | "HUB_ANNOUNCEMEND"
    | "PHASING_VOTE_CASTIND"
    | "POLL_CREATIOD"
    | "VOTE_CASTIND"
    | "ACCOUNT_PROPERTD"
    | "ACCOUNT_PROPERTY_DELETD"
    | "ASSET_ASK_ORDER_CANCELLATIOD"
    | "ASSET_ASK_ORDER_PLACEMEND"
    | "ASSET_BID_ORDER_CANCELLATIOD"
    | "ASSET_BID_ORDER_PLACEMEND"
    | "ASSET_DIVIDEND_PAYMEND"
    | "ASSET_ISSUANCD"
    | "ASSET_TRADD"
    | "ASSET_TRANSFED"
    | "ASSET_DELETD"
    | "DIGITAL_GOODS_DELISTED"
    | "DIGITAL_GOODS_DELISTIND"
    | "DIGITAL_GOODS_DELIVERD"
    | "DIGITAL_GOODS_FEEDBACD"
    | "DIGITAL_GOODS_LISTIND"
    | "DIGITAL_GOODS_PRICE_CHANGD"
    | "DIGITAL_GOODS_PURCHASD"
    | "DIGITAL_GOODS_PURCHASE_EXPIRED"
    | "DIGITAL_GOODS_QUANTITY_CHANGD"
    | "DIGITAL_GOODS_REFUND"
    | "ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASIND"
    | "ACCOUNT_CONTROL_PHASING_ONLD"
    | "CURRENCY_DELETIOD"
    | "CURRENCY_DISTRIBUTIOD"
    | "CURRENCY_EXCHANGD"
    | "CURRENCY_EXCHANGE_BUD"
    | "CURRENCY_EXCHANGE_SELD"
    | "CURRENCY_ISSUANCD"
    | "CURRENCY_MINTIND"
    | "CURRENCY_OFFER_EXPIRED"
    | "CURRENCY_OFFER_REPLACED"
    | "CURRENCY_PUBLISH_EXCHANGE_OFFED"
    | "CURRENCY_RESERVE_CLAID"
    | "CURRENCY_RESERVE_INCREASD"
    | "CURRENCY_TRANSFED"
    | "CURRENCY_UNDO_CROWDFUNDIND"
    | "TAGGED_DATA_UPLOAD"
    | "TAGGED_DATA_EXTEND"
    | "SHUFFLING_REGISTRATIOD"
    | "SHUFFLING_PROCESSIND"
    | "SHUFFLING_CANCELLATIOD"
    | "SHUFFLING_DISTRIBUTIOD";
  event: string;
  account: string;
  height: number;
  timestamp: number;
}

// GetBalance()
export interface IBalance {
  unconfirmedBalanceNQT: string;
  forgedBalanceNQT: string;
  balanceNQT: string;
}

// GetMyInfo()
export interface IMyPeerInfo {
  address: string;
  host: string;
}

export interface IPeerInfo {
  downloadedVolume: number;
  address: string;
  inbound: boolean;
  blockchainState: string;
  weight: number;
  uploadedVolume: number;
  services: Array<string>;
  version: string;
  platform: string;
  inboundWebSocket: boolean;
  lastUpdated: number;
  blacklisted: boolean;
  announcedAddress: string;
  apiPort: number;
  application: string;
  port: number;
  outboundWebSocket: boolean;
  lastConnectAttempt: number;
  state: number;
  shareAddress: boolean;
}

export interface ISearchAccountsAccount {
  accountRS: string;
  name: string;
  description: string;
  account: string;
}

// SearchAccounts()
export interface ISearchAccountsResult {
  accounts: Array<ISearchAccountsAccount>;
}

// SearchAssets()
export interface ISearchAssetsResult {
  assets: Array<IAsset>;
}

// GetAliasesLike()
export interface IGetAliasesLikeResult {
  aliases: Array<IAlias>;
}
