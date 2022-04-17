import React, { memo } from "react";
import logo from "assets/logo512.png";

interface ILogoProps {
  width?: string;
}

const Logo: React.FC<ILogoProps> = ({ width }) => <img style={{ width, padding: "10px" }} src={logo} alt="JUP Logo" />;

export default memo(Logo);
