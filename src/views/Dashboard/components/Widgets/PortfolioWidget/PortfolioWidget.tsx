import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { Box, Button, DialogContent, Input, Stack, styled, Typography } from "@mui/material";
import useAssets from "hooks/useAssets";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";
import { IUnsignedTransaction } from "types/NXTAPI";
import { buildTx } from "utils/common/txBuilder";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import { AssetTransferSubType, AssetTransferType } from "utils/common/constants";
import JUPDialog from "components/JUPDialog";
import useAPIRouter from "hooks/useAPIRouter";

const HARDCODEDVALUE = "0";
const HARDCODEDASSETQTY = "1";

const headCells: Array<IHeadCellProps> = [
  {
    id: "assetName",
    label: "Name",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "assetDescription",
    label: "Description",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "assetBalance",
    label: "Qty",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "actions",
    label: "Actions",
    headAlignment: "center",
    rowAlignment: "center",
  },
];

const PortfolioWidget: React.FC = () => {
  const [assetToSend, setAssetToSend] = useState<string>();
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { getAccount, getAccountId } = useAPI();
  const { heldAssets } = useAssets();
  const { enqueueSnackbar } = useSnackbar();
  const { sendJUP } = useAPIRouter();

  const handleCopyAssetId = useCallback(
    (toCopy: string) => {
      navigator.clipboard.writeText(toCopy);
      enqueueSnackbar(messageText.copy.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const fetchRecipAccountId = useCallback(async () => {
    if (getAccount !== undefined && getAccountId !== undefined) {
      try {
        const result = await getAccount(HARDCODEDSENDASSETADDRESS);
        if (result) {
          const accountResult = await getAccountId(result.publicKey);
          if (accountResult) {
            return accountResult.account;
          }
        }
      } catch (e) {
        console.error("error while fetching public key:", e);
        return;
      }
    }
  }, [getAccount, getAccountId]);

  const handleSendAsset = useCallback((assetId: string) => {
    setAssetToSend(assetId);
    setRequestUserSecret(true);
  }, []);

  const prepareUnsignedTx = useCallback(
    async (secret: string) => {
      const recipientAccountId = await fetchRecipAccountId();
      // const tx: IUnsignedTransaction = buildTx({
      //   senderPublicKey: publicKey, // publicKey from useAccount() hook
      //   senderRS: accountRs, // accountRs from useAccount() hook
      //   type: AssetTransferType,
      //   subtype: AssetTransferSubType,
      //   attachment: { "version.AssetTransfer": 1, quantityQNT: HARDCODEDASSETQTY, asset: assetToSend },
      //   amountNQT: HARDCODEDVALUE, // TODO: use converter function, but for now it's nice for cheaper testing
      //   recipientRS: HARDCODEDSENDASSETADDRESS,
      //   recipient: recipientAccountId,
      //   secretPhrase: secret,
      // });

      // const unsignedTx = await prepareUnsignedTx(secret);
      if (sendJUP !== undefined) {
        const result = await sendJUP(HARDCODEDSENDASSETADDRESS, "0"); // provide zero as amount since attachment handles it for assets
        if (result) {
          enqueueSnackbar(messageText.transaction.success, { variant: "success" });
          return;
        }
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        console.log("send asset result:", result);
      }
    },
    [enqueueSnackbar, fetchRecipAccountId, sendJUP]
  );

  const handleSubmitSecret = useCallback(
    async (secret: string) => {
      const unsignedTx = await prepareUnsignedTx(secret);
      if (sendJUP !== undefined && unsignedTx !== undefined) {
        // const result = await sendJUP(unsignedTx);
        // if (result) {
        //   enqueueSnackbar(messageText.transaction.success, { variant: "success" });
        //   return;
        // }
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        // console.log("send result:", result);
      }
    },
    [enqueueSnackbar, prepareUnsignedTx, sendJUP]
  );

  const handleSecretEntry = useCallback((secretInput) => {
    setUserSecretInput(secretInput);
  }, []);

  const handleCloseSeedCollection = useCallback(() => {
    setRequestUserSecret(false);
    enqueueSnackbar(messageText.transaction.cancel, { variant: "warning" });
  }, [enqueueSnackbar]);

  const portfolioRows: Array<ITableRow> | undefined = useMemo(() => {
    if (heldAssets === undefined || !Array.isArray(heldAssets)) {
      return undefined;
    }

    return heldAssets.map((asset) => {
      return {
        assetId: asset.asset,
        assetName: asset.name,
        assetBalance: asset.quantityQNT,
        assetDescription: asset.description,
        actions: (
          <Stack direction={"row"} spacing={2} justifyContent="center">
            <Button variant="green" onClick={() => handleSendAsset(asset.asset)}>
              Send
            </Button>
            <Button variant="green" onClick={() => handleCopyAssetId(asset.asset)}>
              Copy Asset ID
            </Button>
          </Stack>
        ),
      };
    });
  }, [handleCopyAssetId, handleSendAsset, heldAssets]);

  const ConditionalSendAssetMemo = useMemo(() => {
    return (
      requestUserSecret && (
        <>
          <JUPDialog isOpen={requestUserSecret} closeFn={handleCloseSeedCollection}>
            <DialogContent>
              <Box sx={{ minWidth: "600px", height: "300px" }}>
                <Typography align="center">Please enter your seed phrase.</Typography>
                <Stack sx={{ alignItems: "center" }}>
                  <SeedphraseEntryBox onChange={(e) => handleSecretEntry(e.target.value)} type="password" placeholder="Enter Seed Phrase" />
                  <ConfirmButton variant="contained" onClick={() => handleSubmitSecret(userSecretInput)}>
                    Confirm & Send
                  </ConfirmButton>
                </Stack>
              </Box>
            </DialogContent>
          </JUPDialog>
        </>
      )
    );
  }, [handleCloseSeedCollection, handleSecretEntry, handleSubmitSecret, requestUserSecret, userSecretInput]);

  return (
    <>
      <JUPTable
        title={"My Portfolio"}
        path={"/portfolio"}
        headCells={headCells}
        rows={portfolioRows}
        defaultSortOrder="asc"
        keyProp={"assetId"}
      ></JUPTable>
      {ConditionalSendAssetMemo}
    </>
  );
};

const SeedphraseEntryBox = styled(Input)(({ theme }) => ({
  minWidth: "400px",
  margin: "40px 0px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  margin: "20px 0px",
}));

export default memo(PortfolioWidget);
