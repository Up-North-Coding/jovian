import React, { memo } from "react";
import { Stack, CardMedia, Divider, styled, Typography, Link } from "@mui/material";
import JUPDialog from "components/JUPDialog";

interface IAboutUsProps {
  isOpen: boolean;
  closeFn: () => void;
}

const AboutUs: React.FC<IAboutUsProps> = ({ isOpen, closeFn }) => {
  return (
    <JUPDialog title="About" isOpen={isOpen} closeFn={closeFn} isCard>
      <Stack direction="row">
        <CardMedia sx={{ objectFit: "scale-down" }} component={"img"} height="80" image="../assets/logo512.png"></CardMedia>
        <CardMedia sx={{ objectFit: "scale-down" }} component={"img"} height="80" image="../assets/unc_large.png"></CardMedia>
      </Stack>
      <StyledTypography>
        The Jupiter Project aims to make blockchain accessible and safe for everyone. Jupiter’s military-grade encryption helps ensure that user data
        is private and secure. Through our elite encryption capabilities, Jupiter can power secure dApps on public and private networks based on our
        client’s wishes.
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
  );
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2),
}));

export default memo(AboutUs);
