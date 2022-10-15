import React, { useCallback, useRef, useState } from "react";
import { DialogContent, Stack, styled, Input, Button } from "@mui/material";
import Context from "./Context";
import { BigNumber } from "bignumber.js";
import { IMessageAttachment, IOrdercancellation, IOrderPlacement, ISetAccountInfo, IUnsignedTransaction } from "types/NXTAPI";
import JUPDialog from "components/JUPDialog";
import sendJUP from "utils/api/sendJUP";
import { isValidAddress } from "utils/validation";
import { messageText } from "utils/common/messages";
import { buildTx } from "utils/common/txBuilder";
import { placeOrder } from "utils/api/placeOrder";
import setAccountInfo from "utils/api/setAccountInfo";
import { AssetTransferSubType, AssetTransferType, standardDeadline, standardFee } from "utils/common/constants";
import { cancelOpenOrder } from "utils/api/cancelOpenOrders";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import { useSnackbar, VariantType } from "notistack";

const APIRouterProvider: React.FC = ({ children }) => {
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const [includeMessage, setIncludeMessage] = useState<boolean>();
  const [messageInput, setMessageInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { handleFetchAccountIDFromRS } = useAPI();
  const { enqueueSnackbar } = useSnackbar();

  // This ref gets called after the user submits their secretPhrase. Code flow is as follows:
  // -- afterSecretCB is initialized as an async function which accepts a secretPhrase argument and optional message argument (for sendJUP only currently)
  // -- a transaction is started using the appropriate provider export (sendJUP, sendAsset, etc...)
  // -- standard transaction details are built into an object using buildTx
  // -- the afterSecretCB useRef is "binded" (bound) with the transaction details, to the appropriate send handler (_handleSendJUP, _handleSendAsset, etc)
  // -- the afterSecretCB is called based on the Confirm & Send button in the seed collection dialog
  const afterSecretCB = useRef<(secretPhrase: string, messageToSend?: string) => Promise<void> | undefined>();

  const _handleSendJUP = useCallback(
    async (tx: IUnsignedTransaction, secretPhrase: string, messageToSend?: string) => {
      tx.secretPhrase = secretPhrase;

      if (messageToSend) {
        (tx.attachment as IMessageAttachment).message = messageToSend; // must cast to message Attachment type to keep TS happy @ compile time
      }

      const result = await sendJUP(tx);

      console.log("send result:", result);

      if (!result) {
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        return;
      }

      enqueueSnackbar(messageText.transaction.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const handleSendJUP = useCallback(
    async (toAddress: string, amount: string, includeMessage: boolean): Promise<true | undefined> => {
      let attachment;

      if (accountRs === undefined || handleFetchAccountIDFromRS === undefined) {
        enqueueSnackbar(messageText.critical.missingAccountRsOrPublicKey, { variant: "error" });
        return;
      }

      includeMessage ? setIncludeMessage(true) : setIncludeMessage(false);

      // make sure address is valid
      if (!isValidAddress(toAddress)) {
        return;
      }

      const recipientAccountId = await handleFetchAccountIDFromRS(toAddress);

      if (includeMessage) {
        attachment = { "version.Message": 1, messageIsText: true, message: "", "version.ArbitraryMessage": 0 };
      } else {
        attachment = { "version.OrdinaryPayment": 0 };
      }

      const tx: IUnsignedTransaction = buildTx({
        senderPublicKey: publicKey, // publicKey from useAccount() hook
        senderRS: accountRs, // accountRs from useAccount() hook
        type: 0,
        subtype: 0,
        attachment: attachment,
        amountNQT: amount, // TODO: use converter function, but for now it's nice for cheaper testing
        recipientRS: toAddress,
        recipient: recipientAccountId,
        secretPhrase: "",
      });

      afterSecretCB.current = _handleSendJUP.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handleSendJUP, accountRs, enqueueSnackbar, handleFetchAccountIDFromRS, publicKey]
  );

  const _handleSendAsset = useCallback(
    async (tx: IUnsignedTransaction, secretPhrase: string) => {
      tx.secretPhrase = secretPhrase;

      const result = await sendJUP(tx);

      console.log("send asset result:", result);

      if (!result) {
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        return;
      }

      enqueueSnackbar(messageText.transaction.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const handleSendAsset = useCallback(
    async (toAddress: string, amount: string, assetId: string): Promise<true | undefined> => {
      if (accountRs === undefined || handleFetchAccountIDFromRS === undefined) {
        // TODO: error reporting this properly
        enqueueSnackbar(messageText.critical.missingAccountRsOrPublicKey, { variant: "error" });
        return;
      }

      // make sure address is valid
      if (!isValidAddress(toAddress)) {
        enqueueSnackbar(messageText.validation.addressInvalid, { variant: "error" });
        return;
      }

      const recipientAccountId = await handleFetchAccountIDFromRS(toAddress);
      const tx: IUnsignedTransaction = buildTx({
        senderPublicKey: publicKey, // publicKey from useAccount() hook
        senderRS: accountRs, // accountRs from useAccount() hook
        type: AssetTransferType,
        subtype: AssetTransferSubType,
        attachment: { "version.AssetTransfer": 1, quantityQNT: amount, asset: assetId },
        amountNQT: 0, // Amount is always zero for asset transfers because attachment handles qty
        recipientRS: toAddress,
        recipient: recipientAccountId,
        secretPhrase: "",
      });

      afterSecretCB.current = _handleSendAsset.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handleSendAsset, accountRs, enqueueSnackbar, handleFetchAccountIDFromRS, publicKey]
  );

  const _handlePlaceOrder = useCallback(
    async (tx: IOrderPlacement, secretPhrase: string) => {
      tx.secretPhrase = secretPhrase;
      let result;
      if (tx.orderType === "bid") {
        result = await placeOrder(tx);
      } else if (tx.orderType === "ask") {
        result = await placeOrder(tx);
      }
      console.log("place order result:", result);

      if (!result) {
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        return;
      }

      enqueueSnackbar(messageText.transaction.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const handlePlaceOrder = useCallback(
    async (orderType: "bid" | "ask", assetID: string, quantityQNT: BigNumber, priceNQT: BigNumber): Promise<true | undefined> => {
      // TODO: validate quantity and price at the input layer, or here or somewhere smort

      if (publicKey === undefined || accountRs === undefined) {
        console.error("no public key or accountRs defined, returning...");
        return;
      }
      const tx: IOrderPlacement = {
        orderType: orderType,
        asset: assetID,
        senderRS: accountRs, // accountRs from useAccount() hook
        publicKey: publicKey, // publicKey from useAccount() hook
        quantityQNT: quantityQNT,
        priceNQT: priceNQT,
        deadline: standardDeadline,
        feeNQT: standardFee,
        secretPhrase: "",
      };

      afterSecretCB.current = _handlePlaceOrder.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handlePlaceOrder, accountRs, publicKey]
  );

  const _handleCancelOrder = useCallback(
    async (tx: IOrdercancellation, secretPhrase: string) => {
      tx.secretPhrase = secretPhrase;
      let result;

      try {
        result = await cancelOpenOrder(tx);
      } catch (e) {
        console.error("error while cancelling order in APIRouter:", e);
        return;
      }

      if (!result) {
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        return;
      }

      enqueueSnackbar(messageText.transaction.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const handleCancelOrder = useCallback(
    async (orderType: "bid" | "ask", orderId: string): Promise<true | undefined> => {
      const tx: IOrdercancellation = {
        orderType: orderType,
        orderId: orderId,
        secretPhrase: "",
      };

      afterSecretCB.current = _handleCancelOrder.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handleCancelOrder]
  );

  const _handleSetAccountInfo = useCallback(
    async (tx: ISetAccountInfo, secretPhrase: string) => {
      tx.secretPhrase = secretPhrase;
      let result;

      try {
        result = await setAccountInfo(tx);
      } catch (e) {
        console.error("error while setting account info:", e);
        return;
      }

      if (!result) {
        enqueueSnackbar(messageText.userInfo.failure, { variant: "error" });
        return;
      }

      enqueueSnackbar(messageText.userInfo.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const handleSetAccountInfo = useCallback(
    async (accountName: string, accountDescription: string): Promise<true | undefined> => {
      const tx: ISetAccountInfo = {
        name: accountName,
        description: accountDescription,
        secretPhrase: "",
      };

      afterSecretCB.current = _handleSetAccountInfo.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handleSetAccountInfo]
  );

  const handleSecretEntry = useCallback((secretInput: string) => {
    setUserSecretInput(secretInput);
  }, []);

  const handleMessageEntry = useCallback((messageInput: string) => {
    setMessageInput(messageInput);
  }, []);

  const handleCloseSeedCollection = useCallback(
    (isSuccess: boolean) => {
      let messageVariant: VariantType = "warning";
      setRequestUserSecret(false);

      if (isSuccess) {
        messageVariant = "success";
      }

      enqueueSnackbar(messageText.transaction.cancel, { variant: messageVariant });
    },
    [enqueueSnackbar]
  );

  const handleSubmitSecret = useCallback(async () => {
    try {
      if (afterSecretCB.current === undefined) {
        throw new Error(`handleSubmitSecret afterSecretCB.current is undefined: ${afterSecretCB.current}`);
      }

      // TODO: should consider doing something with the return of this function call
      await afterSecretCB.current(userSecretInput, messageInput);
    } catch (e) {
      console.error("failed to execute api call after seed collection", e);
    }

    afterSecretCB.current = undefined; // flush the callback to avoid future calling of it unintentionally
    setUserSecretInput(""); // flush the user's seedPhrase for security

    // close seed collection dialog without firing the closeFn (prevents a duplicate notification)
    setRequestUserSecret(false);
  }, [messageInput, userSecretInput]);

  return (
    <Context.Provider
      value={{
        sendJUP: handleSendJUP,
        sendAsset: handleSendAsset,
        placeOrder: handlePlaceOrder,
        cancelOpenOrder: handleCancelOrder,
        setAccountInfo: handleSetAccountInfo,
      }}
    >
      {children}
      {/* dialog handles obtaining secret phrase if needed by the current action */}
      <JUPDialog title="Please Enter Your Seed Phrase" isOpen={requestUserSecret} closeFn={() => handleCloseSeedCollection(false)} isCard>
        <DialogContent>
          <Stack sx={{ alignItems: "center" }}>
            <SeedphraseEntryBox onChange={(e) => handleSecretEntry(e.currentTarget.value)} type="password" placeholder="Enter Seed Phrase" />
            {includeMessage && <Input onChange={(e) => handleMessageEntry(e.currentTarget.value)} placeholder="Enter Message" />}
            <ConfirmButton variant="green" onClick={() => handleSubmitSecret()}>
              Confirm & Send
            </ConfirmButton>
          </Stack>
        </DialogContent>
      </JUPDialog>
    </Context.Provider>
  );
};

const SeedphraseEntryBox = styled(Input)(() => ({
  minWidth: "400px",
  margin: "40px 0px",
}));

const ConfirmButton = styled(Button)(() => ({
  margin: "20px 0px",
}));

export default APIRouterProvider;
