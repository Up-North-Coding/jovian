import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import JUPAppBar from "components/JUPAppBar";
import JUPTable, { ITableRow } from "components/JUPTable";
import JUPDialog from "components/JUPDialog";
import useBreakpoint from "hooks/useBreakpoint";
import { detailedPeerColumns, IPeerDetail } from "./constants/detailedPeerColumns";
import { peerOverviewHeaders } from "./constants/peerOverviewHeaders";
import useAPI from "hooks/useAPI";
import { IPeerInfo } from "types/NXTAPI";
import { Link } from "@mui/material";

const Peers: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const [isOpenPeerDetail, setIsOpenPeerDetail] = useState<boolean>(false);
  const [peerDetail, setPeerDetail] = useState<IPeerDetail | undefined>();
  const isMobileMedium = useBreakpoint("<", "md");
  const { peerDetails } = useAPI();

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

  return (
    <Page>
      <Drawer isSidebarExpanded={drawerIsOpen} />
      <JUPAppBar toggleFn={handleDrawerToggle} isSidebarExpanded={drawerIsOpen} />
      <WidgetContainer isSidebarExpanded={drawerIsOpen}>
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
      </WidgetContainer>
    </Page>
  );
};

export default memo(Peers);
