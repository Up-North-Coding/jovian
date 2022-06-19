import React, { useCallback, useRef, useState } from "react";
import { DialogContent, Box, Typography, Stack, styled, Input, Button } from "@mui/material";
import JUPDialog from "components/JUPDialog";
import Context from "./Context";
import { IUnsignedTransaction } from "types/NXTAPI";
import { JUPGenesisTimestamp, standardDeadline, standardFee } from "utils/common/constants";
import sendJUP from "utils/api/sendJUP";
import { isValidAddress } from "utils/validation";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import { useSnackbar, VariantType } from "notistack";
import { messageText } from "utils/common/messages";

const APIRouterProvider: React.FC = ({ children }) => {
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { handleFetchAccountIDFromRS } = useAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // This ref gets called after the user submits their secretPhrase
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
        // TODO: error reporting this properly
        return;
      }

      // make sure address is valid
      if (!isValidAddress(toAddress)) {
        return;
      }

      const recipientAccountId = await handleFetchAccountIDFromRS(toAddress);
      const tx: IUnsignedTransaction = {
        senderPublicKey: publicKey, // publicKey from useAccount() hook
        senderRS: accountRs, // accountRs from useAccount() hook
        // sender: "123", // required in some situations?
        feeNQT: standardFee,
        version: 1,
        phased: false,
        type: 0,
        subtype: 0,
        attachment: { "version.OrdinaryPayment": 0 },
        amountNQT: amount, // TODO: use converter function, but for now it's nice for cheaper testing
        recipientRS: toAddress,
        recipient: recipientAccountId,
        ecBlockHeight: 0, // must be included
        deadline: standardDeadline,
        timestamp: Math.round(Date.now() / 1000) - JUPGenesisTimestamp, // Seconds since Genesis. sets the origination time of the tx (since broadcast can happen later).
        secretPhrase: "",
      };

      afterSecretCB.current = _handleSendJUP.bind(null, tx);
      setRequestUserSecret(true);

      return true;
    },
    [_handleSendJUP, accountRs, handleFetchAccountIDFromRS, publicKey]
  );

  const handleSecretEntry = useCallback((secretInput) => {
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
      if (afterSecretCB.current !== undefined) {
        result = await afterSecretCB.current(userSecretInput);
      }
    } catch (e) {
      console.error("failed to execute api call after confirm & send", e);
    }

    console.log("result:", result);

    // flush the callback to avoid future calling of it unintentionally
    // flush the user's seedPhrase for security
    afterSecretCB.current = undefined;
    setUserSecretInput("");

    // close seed collection dialog without firing the closeFn
    setRequestUserSecret(false);
  }, [userSecretInput]);

  return (
    <Context.Provider
      value={{
        sendJUP: handleSendJUP,
      }}
    >
      {children}
      {/* dialog handles obtaining secret phrase if needed by the current action */}
      <JUPDialog isOpen={requestUserSecret} closeFn={() => handleCloseSeedCollection(false)}>
        <DialogContent>
          <Box sx={{ minWidth: "600px", height: "300px" }}>
            <Typography align="center">Please enter your seed phrase.</Typography>
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
