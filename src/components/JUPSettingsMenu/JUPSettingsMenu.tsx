import { Settings, Logout, Settings as SettingsIcon, Help as HelpIcon } from "@mui/icons-material";
import {
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  styled,
  CardMedia,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import JUPDialog from "components/JUPDialog";
import SLink from "components/SLink";
import useAccount from "hooks/useAccount";
import React, { memo, useCallback, useState } from "react";

const menuProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

const JUPSettingsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpenSettings = Boolean(anchorEl);
  const [isOpenAboutMenu, setIsOpenAboutMenu] = useState<boolean>(false);
  const { userLogout } = useAccount();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseAboutDialog = useCallback(() => {
    setIsOpenAboutMenu(false);
  }, []);

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} color="primary">
          <SettingsIcon></SettingsIcon>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={isOpenSettings}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={menuProps}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => setIsOpenAboutMenu(true)}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          About
        </MenuItem>
        <SLink href={"/"}>
          <MenuItem onClick={userLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <StyledLogout primary="Logout" />
          </MenuItem>
        </SLink>
      </Menu>

      <JUPDialog title="About" isOpen={isOpenAboutMenu} closeFn={handleCloseAboutDialog} isCard>
        <Stack direction="row">
          <CardMedia sx={{ objectFit: "scale-down" }} component={"img"} height="80" image="../assets/logo512.png"></CardMedia>
          <CardMedia sx={{ objectFit: "scale-down" }} component={"img"} height="80" image="../assets/unc_large.png"></CardMedia>
        </Stack>
        <StyledTypography>
          The Jupiter Project aims to make blockchain accessible and safe for everyone. Jupiter’s military-grade encryption helps ensure that user
          data is private and secure. Through our elite encryption capabilities, Jupiter can power secure dApps on public and private networks based
          on our client’s wishes.
        </StyledTypography>
        <StyledDivider />
        <StyledTypography>
          The Jupiter Wallet was designed and developed by Up North Coding, winners of the 2022 Jupiter Hackathon. Core developers for the wallet
          include:
        </StyledTypography>
        <StyledTypography>Nathan Bowers</StyledTypography>
        <StyledTypography>Vance Walsh</StyledTypography>
        <StyledDivider />
        <StyledTypography>
          For general development inquiries contact: <Link href="mailto:inqiury@upnorthcoding.com">inquiry@upnorthcoding.com</Link>
        </StyledTypography>
        <StyledTypography>
          For Jupiter related inquiries contact: <Link href="mailto:infop@sigwo.com">info@sigwo.com</Link>
        </StyledTypography>
      </JUPDialog>
    </>
  );
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledLogout = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    color: theme.palette.error.main,
  },
}));

export default memo(JUPSettingsMenu);
