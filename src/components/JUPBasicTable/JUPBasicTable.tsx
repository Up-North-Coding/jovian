import { styled } from "@mui/material";
import useAPI from "hooks/useAPI";
import useAssets from "hooks/useAssets";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IAsset } from "types/NXTAPI";

interface IJUPBasicTableProps {
  assetId: string;
}

const JUPBasicTable: React.FC<IJUPBasicTableProps> = ({ assetId }) => {
  const [assetDetails, setAssetDetails] = useState<IAsset>();
  const { getAsset } = useAPI();

  const handleFetchAssetDetails = useCallback(async () => {
    if (!getAsset) {
      return;
    }

    let result;
    try {
      result = await getAsset(assetId);
      if (result) {
        setAssetDetails(result);
      }
    } catch (e) {
      console.error("error while performing getAsset() from JUPAssetSearchBox");
      return;
    }
  }, [assetId, getAsset]);

  const TableDetailsMemo = useMemo(() => {
    return (
      <>
        <tr>
          <th>Asset Name:</th>
          <td>{assetDetails && assetDetails.name}</td>
        </tr>
        <tr>
          <th>Description:</th>
          <td>{assetDetails && assetDetails.description}</td>
        </tr>
        <tr>
          <th>Max Supply:</th>
          <td>{assetDetails && assetDetails.quantityQNT}</td>
        </tr>
        <tr>
          <th>Decimals:</th>
          <td>{(assetDetails && assetDetails.decimals) || "0"}</td>
        </tr>
        <tr>
          <th>Holders:</th>
          <td>placeholder</td>
        </tr>
        <tr>
          <th>Distribution:</th>
          <td>
            <a href="somewhere">Click Me</a>
          </td>
        </tr>
      </>
    );
  }, [assetDetails]);

  useEffect(() => {
    handleFetchAssetDetails();
  }, [handleFetchAssetDetails]);

  return (
    <Root>
      <table>
        <tbody>{TableDetailsMemo}</tbody>
      </table>
    </Root>
  );
};

const Root = styled("div")`
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 40%;
  }

  thead {
    text-align: center;
  }

  td,
  th {
    border: 1px solid #ddd;
    text-align: left;
    padding: 2px;
  }
`;

export default React.memo(JUPBasicTable);
