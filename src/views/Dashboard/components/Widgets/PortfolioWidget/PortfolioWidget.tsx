import React, { memo, useCallback, useMemo } from "react";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { Button, Stack } from "@mui/material";
import useAssets from "hooks/useAssets";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";
import useAPIRouter from "hooks/useAPIRouter";

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
  // const { getAccount, getAccountId } = useAPI();
  const { heldAssets } = useAssets();
  const { enqueueSnackbar } = useSnackbar();
  const { sendAsset } = useAPIRouter();

  const handleCopyAssetId = useCallback(
    (toCopy: string) => {
      navigator.clipboard.writeText(toCopy);
      enqueueSnackbar(messageText.copy.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  // May want to re-use this here, still investigating...
  //
  // const fetchRecipAccountId = useCallback(async () => {
  //   if (getAccount !== undefined && getAccountId !== undefined) {
  //     try {
  //       const result = await getAccount(HARDCODEDSENDASSETADDRESS);
  //       if (result) {
  //         const accountResult = await getAccountId(result.publicKey);
  //         if (accountResult) {
  //           return accountResult.account;
  //         }
  //       }
  //     } catch (e) {
  //       console.error("error while fetching public key:", e);
  //       return;
  //     }
  //   }
  // }, [getAccount, getAccountId]);

  const handleSendAsset = useCallback(
    async (assetId: string) => {
      if (sendAsset === undefined || assetId === undefined) {
        console.error("inadequate details provided to handleSendAsset, please try again");
        return;
      }

      const result = await sendAsset(HARDCODEDSENDASSETADDRESS, HARDCODEDASSETQTY, assetId); // forcing "1" for testing for now

      console.log("sendWidget sendJUP result:", result);
    },
    [sendAsset]
  );

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
    </>
  );
};

export default memo(PortfolioWidget);
