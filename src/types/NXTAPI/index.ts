/*
 *
 * Interfaces for Jupiter Wallet's NXT API responses
 *
 */

import { BigNumber } from "bignumber.js";

export interface IBaseAPIResult {
  error?: {
    message: string;
    code: string | number;
  };
}

interface IBaseApiResponse {
  requestProcessingTime: number;
}

export interface IGetBlockResult extends IBaseAPIResult {
  results?: IBlock & IBaseApiResponse;
}

export interface ICancelOrderResult extends IBaseAPIResult {
  results?: ICancelOrderType & IBaseApiResponse;
}

interface IBaseOrderType {
  signatureHash: string;
  unsignedTransactionBytes: string;
  transactionJSON: {
    senderPublicKey: string;
    signature: string;
    feeNQT: string;
    type: number;
    fullHash: string;
    version: number;
    ecBlockId: number;
    signatureHash: string;

    senderRS: string;
    subtype: number;
    amountNQT: string;
    sender: number;
    ecBlockHeight: number;
    deadline: number;
    transaction: number;
    timestamp: number;
    height: number;
  };
  broadcasted: boolean;
  requestProcessingTime: number;
  transactionBytes: string;
  fullHash: string;
  transaction: number;
}

export interface ICancelOrderType extends IBaseOrderType {
  attachment: {
    version: {
      BidOrderCancellation: number;
    };
    order: number;
  };
}

export interface IPlaceOrderType extends IBaseOrderType {
  attachment: {
    version: {
      BidOrderCancellation: number;
    };
    quantityQNT: string;
    priceNQT: string;
    asset: string;
  };
}

export interface IPlaceOrderResult extends IBaseAPIResult {
  results?: IPlaceOrderType & IBaseApiResponse;
}

export interface IGetBlockchainStatusResult extends IBaseAPIResult {
  results?: IGetBlockchainStatusType;
}

export interface IGetBlockchainStatusType extends IBaseAPIResult {
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
  results?: IGetAccountType;
}

export interface IGetAccountType extends IBaseApiResponse {
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
  results?: IGetAccountIdType;
}

export interface IGetAccountIdType extends IBaseApiResponse {
  accountRS: string;
  publicKey: string;
  account: string;
}

export interface IGetBalanceResult extends IBaseAPIResult {
  results?: IGetBalanceType;
}

export interface IGetBalanceType extends IBaseApiResponse {
  unconfirmedBalanceNQT: string;
  forgedBalanceNQT: string;
  balanceNQT: string;
}

export interface IGetBlocksResultType extends IBaseApiResponse {
  blocks: Array<IBlock>;
}

export interface IGetBlocksResult extends IBaseAPIResult {
  results?: IGetBlocksResultType;
}

export interface IGetAccountAssetsResult extends IBaseAPIResult {
  results?: IGetAccountAssetsType;
}

export interface IGetAccountAssetsType extends IBaseApiResponse {
  accountAssets: Array<IAccountAsset>;
}

export interface IGetAssetResult extends IBaseAPIResult {
  results?: IAsset & IBaseApiResponse;
}

type AttachmentType = IMessageAttachment | IAssetTransferAttachment;

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
  attachment: AttachmentType;
  senderPublicKey?: string;
  feeNQT: string;
  deadline: number;
  secretPhrase: string;
  ecBlockHeight: number;
  timestamp: number;
}

export interface ISendJupResult extends IBaseAPIResult {
  results?: boolean;
}

export interface IMessageAttachment {
  "version.Message": number;
  messageIsText: boolean;
  message: string;
  "version.ArbitraryMessage": 0;
}

export interface IAssetTransferAttachment {
  "version.AssetTransfer": 1;
  quantityQNT: string;
  asset: string;
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
  phased: boolean;
  ecBlockId: string;
  signatureHash: string;
  attachment: AttachmentType;
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

// this is technically in the wrong place because it's internal to the wallet and not related
// to the NXT/JUP API itself
export interface IDefaultAsset {
  name: string;
  asset: string; // assetID like "12345678901234567890"
  decimals: number;
}

export interface IAsset extends IDefaultAsset {
  initialQuantityQNT: string; // starting quantity
  quantityQNT: string; // current total supply
  accountRS: string;
  description: string;
  account: string;
}

// GetAccountAssets()
export interface IAccountAsset {
  assetDetails: IAsset; // all of the asset's intrinsic details
  quantityQNT: string; // currently held quantity
  unconfirmedQuantityQNT: string;
  asset: string;
}

// GetOrders()
export interface IGetOrdersBidResult extends IBaseAPIResult {
  results?: IBidOrders & IBaseApiResponse;
}

export interface IGetOrdersAskResult extends IBaseAPIResult {
  results?: IAskOrders & IBaseApiResponse;
}

interface IBidOrders {
  bidOrders: Array<IOpenOrder>;
}

interface IAskOrders {
  askOrders: Array<IOpenOrder>;
}

export interface IGetOrdersResult {
  results?: IBaseApiResponse & IBidOrders & IAskOrders;
}

export interface IOrderPlacement {
  orderType: "bid" | "ask";
  publicKey: string;
  senderRS: string;
  asset: string;
  quantityQNT: BigNumber;
  priceNQT: BigNumber;
  feeNQT: string;
  deadline: number;
  secretPhrase: string;
}

export interface ISetAccountInfo {
  name: string;
  description: string;
  secretPhrase: string;
}

export interface ISetAccountInfoResult extends IBaseAPIResult {
  results?: { status: boolean } & IBaseApiResponse;
}

// getPeer
export interface IGetPeerResult extends IBaseAPIResult {
  results?: IPeerInfo & IBaseApiResponse;
}

// getPeers
export interface IGetPeersResult extends IBaseAPIResult {
  results?: {
    peers: Array<string>;
  } & IBaseApiResponse;
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

export interface ITrade {
  seller: string;
  quantityQNT: string;
  bidOrder: string;
  sellerRS: string;
  buyer: string;
  priceNQT: string;
  askOrder: string;
  buyerRS: string;
  block: string;
  asset: string;
  askOrderHeight: number;
  bidOrderHeight: number;
  tradeType: string;
  timestamp: number;
  height: number;
}

export interface IGetTradesResult extends IBaseAPIResult {
  results?: {
    trades: Array<ITrade>;
  } & IBaseApiResponse;
}

// getAccountCurrentAskOrders & getAccountCurrentBidOrders
export interface IGetAccountCurrentBidOrdersResult extends IBaseAPIResult {
  results?: IBidOrders & IBaseApiResponse;
}

export interface IGetAccountCurrentAskOrdersResult extends IBaseAPIResult {
  results?: IAskOrders & IBaseApiResponse;
}

export interface IGetAccountCurrentOrdersResult extends IBaseAPIResult {
  results?: IBaseApiResponse & IBidOrders & IAskOrders;
}

export interface IOrdercancellation {
  orderId: string;
  orderType: "bid" | "ask";
  secretPhrase: string;
}

export interface IGenerator {
  effectiveBalanceNXT: number;
  accountRS: string;
  deadline: number;
  account: string;
  hitTime: number;
}

export interface IGetNextBlockGeneratorsResult extends IBaseAPIResult {
  activeCount: number;
  lastBlock: string;
  generators: Array<IGenerator>;
  requestProcessingTime: number;
  timestamp: number;
  height: number;
}

//
// Not used yet, move to the section above as these are used
//

export interface IGetBlockchainTransactionResult extends IBaseAPIResult {
  results?: IGetBlockchainTransactionType;
}

export interface IGetBlockchainTransactionType extends IBaseApiResponse {
  transactions: Array<ITransaction>;
}

export interface IOpenOrder extends IBaseAPIResult {
  quantityQNT: string;
  priceNQT: BigNumber;
  transactionHeight: number;
  accountRS: string;
  transactionIndex: number;
  asset: string;
  type: "ask" | "bid";
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
export interface ISearchAssetsResult extends IBaseAPIResult {
  results?: {
    assets: Array<IAsset>;
  } & IBaseApiResponse;
}

// GetAliasesLike()
export interface IGetAliasesLikeResult {
  aliases: Array<IAlias>;
}
