import React from "react";
import logo from "assets/logo512.png";
import { styled } from "@mui/material";

const Logo: React.FC = () => {
  return <StyledLogo src={logo} alt="JUP Logo" style={{ height: "200px", alignSelf: "center" }} />;
};

const StyledLogo = styled("img")(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default Logo;
