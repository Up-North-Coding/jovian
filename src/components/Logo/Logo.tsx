import React, { memo } from "react";
import logo from "assets/logo512.png";

interface ILogoProps {
  width?: string;
  padding?: string;
}

const Logo: React.FC<ILogoProps> = ({ width, padding }) => (
  <img style={{ width: width, height: "100%", padding: padding }} src={logo} alt="JUP Logo" />
);

export default memo(Logo);
