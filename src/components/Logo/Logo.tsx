import React from "react";
import logo from "assets/logo512.png";
import { styled } from "@mui/material";

interface ILogoProps {
  width?: string;
}

const Logo: React.FC<ILogoProps> = ({ width }) => {
  return <img style={{ width: width, padding: "10px" }} src={logo} alt="JUP Logo" />;
};

// const StyledLogo = styled("img")(({ theme }) => ({
//   padding: theme.spacing(2),
// }));

export default React.memo(Logo);
