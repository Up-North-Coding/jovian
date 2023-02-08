import React, { memo, useCallback, useMemo, useState } from "react";
import { Button, Stack } from "@mui/material";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import JUPDialog from "components/JUPDialog";
import JUPInput from "components/JUPInput";
import { LedaNFTName, LongUnitPrecision } from "utils/common/constants";
import { messageText } from "utils/common/messages";
import useAssets from "hooks/useAssets";
import useAPIRouter from "hooks/useAPIRouter";
import { useSnackbar } from "notistack";
import AssetActionsStack from "components/AssetActionsStack";
import { QNTtoNXT } from "utils/common/QNTtoNXT";
import { BigNumber } from "bignumber.js";

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
  const [collectTxDetails, setCollectTxDetails] = useState<boolean>();
  const [assetSendQty, setAssetSendQty] = useState<string>();
  const [assetSendId, setAssetSendId] = useState<string>();
  const [assetToAddress, setAssetToAddress] = useState<string>();
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

  const fetchToAddress = useCallback((address: string | undefined) => {
    if (address === undefined) {
      setAssetToAddress(undefined);
      return;
    }
    setAssetToAddress(address);
  }, []);

  const fetchAssetQuantity = useCallback((quantity: string | undefined) => {
    if (quantity === undefined) {
      setAssetSendQty(undefined);
      return;
    }
    setAssetSendQty(quantity);
  }, []);

  // Couple different types of sends to account for:
  //
  // 1. NFT's (always quantity of 1, currently (confirmed with LEDA maintainer))
  // 2. Colored coin assets (possible to send in different quantities, depending on asset decimal support)
  //
  // Need to pass in quantity of 1 if it's an NFT, otherwise need to request a quantity.
  // Using asset name for now but might be flawed if a user creates an asset with a name of "nftleda", or
  // if Leda changes the way they tag their NFTs
  const handleSendAsset = useCallback(async (assetId: string, assetName: string) => {
    if (assetId === undefined || assetName === undefined) {
      console.error("inadequate details provided to handleSendAsset, please try again");
      return;
    }

    setAssetSendId(assetId);

    if (assetName === LedaNFTName) {
      console.log(`Asset is ${assetName} with ID: ${assetId}, forcing a send qty of 1`);
      setAssetSendQty("1");
    }

    setCollectTxDetails(true);
  }, []);

  const handleNext = useCallback(async () => {
    if (sendAsset === undefined || assetToAddress === undefined || assetSendQty === undefined || assetSendId === undefined) {
      // enqueue a snackbar here
      return;
    }

    setCollectTxDetails(false);
    const result = await sendAsset(assetToAddress, assetSendQty, assetSendId);

    console.log("sendWidget sendJUP result:", result);
  }, [assetSendId, assetSendQty, assetToAddress, sendAsset]);

  const handleClose = useCallback(() => {
    setCollectTxDetails(false);
  }, []);

  const portfolioRows: Array<ITableRow> | undefined = useMemo(() => {
    if (heldAssets === undefined) {
      return undefined;
    }

    return heldAssets?.map((asset) => {
      return {
        assetId: asset.asset,
        assetName: asset.assetDetails.name,
        assetBalance: QNTtoNXT(new BigNumber(asset.quantityQNT), asset.assetDetails.decimals, LongUnitPrecision),
        assetDescription: asset.assetDetails.description,
        actions: (
          <AssetActionsStack
            handleSendAsset={handleSendAsset}
            handleCopyAssetId={handleCopyAssetId}
            assetId={asset.asset}
            assetName={asset.assetDetails.name}
          />
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
        isPaginated
      ></JUPTable>
      {collectTxDetails ? (
        <JUPDialog isOpen={collectTxDetails} closeFn={handleClose}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <JUPInput inputType="address" placeholder='Enter "To" Address' fetchInputValue={(address) => fetchToAddress(address)}></JUPInput>
            <JUPInput placeholder="Enter Quantity" inputType="quantity" fetchInputValue={(quantity) => fetchAssetQuantity(quantity)}></JUPInput>
            <Button onClick={handleNext} variant="green">
              Next
            </Button>
          </Stack>
        </JUPDialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default memo(PortfolioWidget);
