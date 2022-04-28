import { useContext } from "react";
import { BlockContext } from "../contexts/BlockContext";

const useBlocks = () => ({
  ...useContext(BlockContext),
});

export default useBlocks;
