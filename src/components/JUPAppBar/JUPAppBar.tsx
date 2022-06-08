import React, { memo } from "react";
import { styled, alpha } from "@mui/material/styles";
import { AppBar, Box, Toolbar, IconButton, InputBase } from "@mui/material/";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import JUPSettingsMenu from "components/JUPSettingsMenu";
import BlockheightChip from "components/SearchBar/components/BlockheightChip";
import AddressBook from "components/SearchBar/components/AddressBook";
import { JUPSidebarWidth } from "utils/common/constants";
import useBreakpoint from "hooks/useBreakpoint";

interface ISearchAppBarProps {
  isSidebarExpanded: boolean;
  toggleFn: () => void;
}

const SearchAppBar: React.FC<ISearchAppBarProps> = ({ isSidebarExpanded, toggleFn }) => {
  const isMobileSmall = useBreakpoint("<", "sm");

  return (
    // TODO: Not keen on this magic number, probably need to box these components out more intelligently so flex can handle this
    <Box sx={{ marginBottom: "65px" }}>
      <AppBar sx={{ width: "100%" }}>
        <Toolbar>
          <IconButton
            sx={{ marginLeft: isSidebarExpanded && !isMobileSmall ? `${JUPSidebarWidth}px` : "0px" }}
            size="large"
            edge="start"
            color="primary"
            aria-label="open drawer"
            onClick={toggleFn}
          >
            <MenuIcon />
          </IconButton>
          <StyledSearch>
            <StyledSearchIconWrapper>
              <SearchIcon color="primary" />
            </StyledSearchIconWrapper>
            <StyledInputBase fullWidth={true} placeholder="Search…" inputProps={{ "aria-label": "search" }} />
          </StyledSearch>
          <BlockheightChip />
          <AddressBook />
          <JUPSettingsMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

const StyledSearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default memo(SearchAppBar);
