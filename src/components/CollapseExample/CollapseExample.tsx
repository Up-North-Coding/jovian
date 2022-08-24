import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material/";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import JUPDialog from "components/JUPDialog";
import JUPInput from "components/JUPInput";
import { LedaNFTName } from "utils/common/constants";
import { messageText } from "utils/common/messages";
import useAssets from "hooks/useAssets";
import useBlocks from "hooks/useBlocks";
import useAPIRouter from "hooks/useAPIRouter";
import { useSnackbar } from "notistack";

interface IPortfolioAssets {
  name: string;
  description: string;
  qtyOwned: string;
  assetActions: any;
  assetDetails: [{ name: string; description: string; decimals: 0; quantityQNT: 0 }];
}

interface IRowProps {
  row: IPortfolioAssets;
}

const Row: React.FC<IRowProps> = ({ row }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {/* First column is the icon which allows for expansion */}
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {/* Top Level Row data */}
        <TableCell align="center" component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="center">{row.description}</TableCell>
        <TableCell align="center">{row.qtyOwned}</TableCell>
        <TableCell align="center">{row.assetActions}</TableCell>
      </TableRow>
      <TableRow>
        {/* Expandable Rows */}
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, border: "1px dotted white" }}>
              <Typography variant="h6" margin={"5px"}>
                Asset Details
              </Typography>
              <Table size="small" aria-label="asset-details">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Decimals</TableCell>
                    <TableCell>Total Supply</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.assetDetails.map((detailRow) => {
                    return (
                      <TableRow key={`tr-${detailRow.name}`}>
                        <TableCell component="th" scope="row">
                          {detailRow.name}
                        </TableCell>
                        <TableCell>{detailRow.description}</TableCell>
                        <TableCell>{detailRow.decimals}</TableCell>
                        <TableCell>{detailRow.quantityQNT}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const TopLevelHeaders = ["Asset Name", "Description", "QTY Owned", "Asset Actions"];

const CollapsibleTable: React.FC = () => {
  const [rows, setRows] = useState<any>();
  const [collectTxDetails, setCollectTxDetails] = useState<boolean>();
  const [assetToAddress, setAssetToAddress] = useState<string>();
  const [assetSendQty, setAssetSendQty] = useState<string>();
  const [assetSendId, setAssetSendId] = useState<string>();
  const { sendAsset } = useAPIRouter();
  const { heldAssets } = useAssets();
  const { blockHeight } = useBlocks();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = useCallback(() => {
    setCollectTxDetails(false);
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

  const handleCopyAssetId = useCallback(
    (toCopy: string) => {
      navigator.clipboard.writeText(toCopy);
      enqueueSnackbar(messageText.copy.success, { variant: "success" });
    },
    [enqueueSnackbar]
  );

  const RowsMemo = useMemo(() => {
    if (rows === undefined) {
      return <></>;
    }

    return rows.map((row: IPortfolioAssets) => <Row key={row.name} row={row} />);
  }, [rows]);

  // Keeps held assets up to date so table will be built properly
  useEffect(() => {
    const assetRows = heldAssets?.map((asset) => {
      return createData(
        asset.assetDetails.name,
        asset.assetDetails.description,
        asset.quantityQNT,
        <Stack direction={"row"} spacing={2} justifyContent="center">
          <Button variant="outlined" size="small" onClick={() => handleSendAsset(asset.asset, asset.assetDetails.name)}>
            Send
          </Button>
          <Button variant="outlined" size="small" onClick={() => handleCopyAssetId(asset.asset)}>
            Copy Asset ID
          </Button>
        </Stack>,
        {
          name: asset.assetDetails.name,
          description: asset.assetDetails.description,
          decimals: asset.assetDetails.decimals,
          quantityQNT: `${asset.assetDetails.quantityQNT}`,
        }
      );
    });

    setRows(assetRows);
  }, [blockHeight, handleCopyAssetId, handleSendAsset, heldAssets]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {/* Table Header row */}
            {TopLevelHeaders.map((headerText, index) => {
              return (
                <TableCell align="center" key={`tc-${headerText}-${index}`}>
                  {headerText}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Table Contents rows */}
          {RowsMemo}
        </TableBody>
      </Table>
      {collectTxDetails ? (
        <JUPDialog isOpen={collectTxDetails} closeFn={handleClose}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <JUPInput inputType="address" placeholder='Enter "To" Address' fetchFn={(address) => fetchToAddress(address)}></JUPInput>
            <JUPInput placeholder="Enter Quantity" inputType="quantity" fetchFn={(quantity) => fetchAssetQuantity(quantity)}></JUPInput>
            <Button onClick={handleNext} variant="green">
              Next
            </Button>
          </Stack>
        </JUPDialog>
      ) : (
        <></>
      )}
    </TableContainer>
  );
};

//
// Helper functions
//

interface IAssetDetails {
  name: string;
  description: string;
  decimals: number;
  quantityQNT: string;
}

// creates row data based on inputs
function createData(name: string, description: string, qtyOwned: string, assetActions: any, assetDetails: IAssetDetails) {
  return {
    name,
    description,
    qtyOwned,
    assetActions,
    assetDetails: [
      {
        name: assetDetails.name,
        description: assetDetails.description,
        decimals: assetDetails.decimals,
        quantityQNT: assetDetails.quantityQNT,
      },
    ],
  };
}

export default React.memo(CollapsibleTable);
