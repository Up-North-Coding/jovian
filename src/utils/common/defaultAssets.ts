//
// Contains the assets, their IDs, and decimals which are known to the Jupiter wallet system
// all other assets users look up will need to have their details fetched but
// the ones in this file are baked in
//

import { IDefaultAsset } from "types/NXTAPI";

export const defaultAssetList: Array<IDefaultAsset> = [
  {
    name: "ASTRO",
    asset: "2088497906655868238",
    decimals: 0,
  },
  {
    name: "FORGE",
    asset: "15210174725739850610",
    decimals: 0,
  },
];
