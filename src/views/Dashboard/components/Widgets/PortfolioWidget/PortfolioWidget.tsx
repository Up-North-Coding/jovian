import React, { memo, useCallback, useEffect, useMemo } from "react";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { Button, Stack } from "@mui/material";
import useAssets from "hooks/useAssets";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

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

  const handleCopyAssetId = useCallback(
    (toCopy: string) => {
      navigator.clipboard.writeText(toCopy);
      enqueueSnackbar(messageText.copy.success, { variant: "success" });
    },
    [enqueueSnackbar]
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
            <Button variant="green" onClick={() => console.log("implement send")}>
              Send
            </Button>
            <Button variant="green" onClick={() => handleCopyAssetId(asset.asset)}>
              Copy Asset ID
            </Button>
          </Stack>
        ),
      };
    });
  }, [handleCopyAssetId, heldAssets]);

  return (
    <JUPTable
      title={"My Portfolio"}
      path={"/portfolio"}
      headCells={headCells}
      rows={portfolioRows}
      defaultSortOrder="asc"
      keyProp={"assetId"}
    ></JUPTable>
  );
};

export default memo(PortfolioWidget);
