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

  // Couple different types of sends to account for:
  //
  // 1. NFT's (always quantity of 1? confirming...)
  // 2. Colored coin assets (possible to send in different quantities, depending on asset decimal support)
  //
  // Need to pass in quantity of 1 if it's an NFT, otherwise need to request a quantity.
  // Using asset name for now but might be flawed if a user creates an asset with a name of "nftleda"
  const handleSendAsset = useCallback(
    async (assetId: string, assetName: string) => {
      let assetSendQty = "0";

      if (sendAsset === undefined || assetId === undefined || assetName === undefined) {
        console.error("inadequate details provided to handleSendAsset, please try again");
        return;
      }

      if (assetName === "nftleda") {
        console.log(`Asset is ${assetName} with ID: ${assetId}, forcing a send qty of 1`);
        assetSendQty = "1";
      } else {
        assetSendQty = "0"; // forcing a zero for now until I get quantity in the appropriate dialog
      }

      const result = await sendAsset(HARDCODEDSENDASSETADDRESS, assetSendQty, assetId); // forcing an address to send to until address is in the appropriate dialog

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
            <Button variant="green" onClick={() => handleSendAsset(asset.asset, asset.name)}>
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
