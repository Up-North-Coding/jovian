import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import JUPAppBar from "components/JUPAppBar";
import JUPTable, { ITableRow } from "components/JUPTable";
import JUPDialog from "components/JUPDialog";
import { detailedPeerColumns, IPeerDetail } from "./constants/detailedPeerColumns";
import { peerOverviewHeaders } from "./constants/peerOverviewHeaders";
import { FormatBytes } from "utils/common/FormatBytes";
import { PeerPollingFrequency } from "utils/common/constants";
import { isPollingFrequencyMet } from "utils/common/isPollingFrequencyMet";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";
import useBreakpoint from "hooks/useBreakpoint";
import { IPeerInfo } from "types/NXTAPI";
import { Link } from "@mui/material";

const Peers: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const [isOpenPeerDetail, setIsOpenPeerDetail] = useState<boolean>(false);
  const [peerDetail, setPeerDetail] = useState<IPeerDetail | undefined>();
  const [lastGetPeersBlock, setLastGetPeersBlock] = useState<number>(0);

  const isMobileMedium = useBreakpoint("<", "md");
  const { peerDetails, getPeers } = useAPI();
  const { blockHeight } = useBlocks();

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  const handleOpenPeerDetail = useCallback(
    (ipAddress: string) => {
      const peer = peerDetails?.filter((peer) => peer.address === ipAddress)[0];

      if (!peer) {
        console.error("No detailed peer to open...");
        return;
      }
      setIsOpenPeerDetail(true);
      setPeerDetail(detailedPeerColumns(peer));
    },
    [peerDetails]
  );

  const peerRows: Array<ITableRow> | undefined = useMemo(() => {
    if (peerDetails === undefined || !Array.isArray(peerDetails)) {
      return undefined;
    }

    return peerDetails.map((peer: IPeerInfo) => {
      return {
        nodeAddress: peer.address,
        nodeAddress_ui: <Link onClick={() => handleOpenPeerDetail(peer.address)}>{peer.address}</Link>,
        downloaded: FormatBytes(peer.downloadedVolume),
        uploaded: FormatBytes(peer.uploadedVolume),
        version: peer.version,
        state: peer.blockchainState,
        blacklisted: `${peer.blacklisted}`, // must be wrapped because it's a boolean
      };
    });
  }, [handleOpenPeerDetail, peerDetails]);

  const handleCloseDialog = useCallback(() => {
    setIsOpenPeerDetail(false);
  }, []);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

  // Updates peers based on PeerPollingFrequency
  useEffect(() => {
    if (getPeers === undefined || blockHeight === undefined) {
      return;
    }

    // Only fetch based on the PeerPollingFrequency to reduce RPC calls since this isn't critical on a per-block basis
    if (!isPollingFrequencyMet(PeerPollingFrequency, lastGetPeersBlock, blockHeight)) {
      return;
    }

    getPeers();
    setLastGetPeersBlock(blockHeight);
  }, [getPeers, blockHeight, lastGetPeersBlock]);

  return (
    <Page>
      {/* Dialog for peer details */}
      <JUPDialog title={`Details for peer: ${peerDetail?.nodeAddress}`} isOpen={isOpenPeerDetail} closeFn={handleCloseDialog}>
        <JUPTable keyProp={"col1"} headCells={peerDetail?.headers} rows={peerDetail?.rows} defaultSortOrder={"asc"} isPaginated={false}></JUPTable>
      </JUPDialog>

      <JUPTable
        title={"Peers"}
        path={"/peers"}
        headCells={peerOverviewHeaders}
        rows={peerRows}
        defaultSortOrder="asc"
        keyProp={"nodeAddress_ui"}
        rowsPerPageStyle="long"
        isPaginated
      />
    </Page>
  );
};

export default memo(Peers);
