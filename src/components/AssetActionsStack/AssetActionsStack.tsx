import React, { memo } from "react";
import { Stack, Button } from "@mui/material";

interface IAssetActionStackProps {
  handleSendAsset: (id: string, name: string) => Promise<void>;
  handleCopyAssetId: (id: string) => void;
  assetId: string;
  assetName: string;
}

const AssetActionStack: React.FC<IAssetActionStackProps> = ({ handleSendAsset, handleCopyAssetId, assetId, assetName }) => {
  return (
    <Stack direction={"row"} spacing={2} justifyContent="center">
      <Button variant="outlined" size="small" onClick={() => handleSendAsset(assetId, assetName)}>
        Send
      </Button>
      <Button variant="outlined" size="small" onClick={() => handleCopyAssetId(assetId)}>
        Copy Asset ID
      </Button>
    </Stack>
  );
};

export default memo(AssetActionStack);
