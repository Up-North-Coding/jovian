import React, { useCallback, useRef, useState } from "react";
import { DialogContent, Box, Typography, Stack, styled, Input, Button } from "@mui/material";
import Context from "./Context";
import { BigNumber } from "bignumber.js";
import { IOrderPlacement, IUnsignedTransaction } from "types/NXTAPI";
import JUPDialog from "components/JUPDialog";
import sendJUP from "utils/api/sendJUP";
import { isValidAddress } from "utils/validation";
import { messageText } from "utils/common/messages";
import { buildTx } from "utils/common/txBuilder";
import { placeOrder } from "utils/api/placeOrder";
import { AssetTransferSubType, AssetTransferType, standardDeadline, standardFee } from "utils/common/constants";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import { useSnackbar, VariantType } from "notistack";

const APIRouterProvider: React.FC = ({ children }) => {
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { handleFetchAccountIDFromRS } = useAPI();
  const { enqueueSnackbar } = useSnackbar();

  // This ref gets called after the user submits their secretPhrase. Code flow is as follows:
  // -- afterSecretCB is initialized as an async function which accepts a secretPhrase argument
  // -- a transaction is started using the appropriate provider export (sendJUP, sendAsset, etc...)
  // -- standard transaction details are built into an object using buildTx
  // -- the afterSecretCB useRef is "binded" (bound) with the transaction details, to the appropriate send handler (_handleSendJUP, _handleSendAsset, etc)
  // -- the afterSecretCB is called based on the Confirm & Send button in the seed collection dialog
  const afterSecretCB = useRef<(secretPhrase: string) => Promise<void> | undefined>();

  const _handleSendJUP = useCallback(
    async (tx: IUnsignedTransaction, secretPhrase: string) => {
      tx.secretPhrase = secretPhrase;

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
    async (toAddress: string, amount: string): Promise<true | undefined> => {
      // TODO: validate amount at the input layer, or here or somewhere smort

      if (accountRs === undefined || handleFetchAccountIDFromRS === undefined) {
        enqueueSnackbar(messageText.critical.missingAccountRsOrPublicKey, { variant: "error" });
        return;
      }

      // make sure address is valid
      if (!isValidAddress(toAddress)) {
        return;
      }

      const recipientAccountId = await handleFetchAccountIDFromRS(toAddress);
      const tx: IUnsignedTransaction = buildTx({
        senderPublicKey: publicKey, // publicKey from useAccount() hook
        senderRS: accountRs, // accountRs from useAccount() hook
        type: 0,
        subtype: 0,
        attachment: { "version.OrdinaryPayment": 0 },
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
      // TODO: validate amount at the input layer, or here or somewhere smort

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
    async (orderType: "bid" | "ask", assetID: number, quantityQNT: BigNumber, priceNQT: BigNumber): Promise<true | undefined> => {
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

  const handleSecretEntry = useCallback((secretInput: string) => {
    setUserSecretInput(secretInput);
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
    let result;
    try {
      if (afterSecretCB.current === undefined) {
        throw new Error(`handleSubmitSecret afterSecretCB.current is undefined: ${afterSecretCB.current}`);
      }

      result = await afterSecretCB.current(userSecretInput);
    } catch (e) {
      console.error("failed to execute api call after seed collection", e);
    }

    afterSecretCB.current = undefined; // flush the callback to avoid future calling of it unintentionally
    setUserSecretInput(""); // flush the user's seedPhrase for security

    // close seed collection dialog without firing the closeFn (prevents a duplicate notification)
    setRequestUserSecret(false);
  }, [userSecretInput]);

  return (
    <Context.Provider
      value={{
        sendJUP: handleSendJUP,
        sendAsset: handleSendAsset,
        placeOrder: handlePlaceOrder,
      }}
    >
      {children}
      {/* dialog handles obtaining secret phrase if needed by the current action */}
      <JUPDialog isOpen={requestUserSecret} closeFn={() => handleCloseSeedCollection(false)}>
        <DialogContent>
          <Box>
            <Typography align="center">Please Enter Your Seed Phrase</Typography>
            <Stack sx={{ alignItems: "center" }}>
              <SeedphraseEntryBox onChange={(e) => handleSecretEntry(e.target.value)} type="password" placeholder="Enter Seed Phrase" />
              <ConfirmButton variant="contained" onClick={() => handleSubmitSecret()}>
                Confirm & Send
              </ConfirmButton>
            </Stack>
          </Box>
        </DialogContent>
      </JUPDialog>
    </Context.Provider>
  );
};

const SeedphraseEntryBox = styled(Input)(({ theme }) => ({
  minWidth: "400px",
  margin: "40px 0px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  margin: "20px 0px",
}));

export default APIRouterProvider;
