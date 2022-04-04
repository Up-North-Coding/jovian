import { useMediaQuery, useTheme } from "@mui/material";

// bundling useTheme and useMediaQuery hooks into a single hook for convenience
const useBreakpoint = (dir: ">" | "<", bp: "xs" | "sm" | "md" | "lg" | "xl"): boolean => {
  const theme = useTheme();
  let query = theme.breakpoints.down(bp);
  if (dir === ">") {
    query = theme.breakpoints.up(bp);
  }

  return useMediaQuery(query);
};

export default useBreakpoint;
