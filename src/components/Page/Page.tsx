import React from "react";
import { styled } from "@mui/material/styles";

const Page: React.FC = ({ children }) => (
  <>
    <StyledMain>{children}</StyledMain>
  </>
);

const StyledMain = styled("div")(({ theme }) => ({
  alignItems: "center",
  boxSizing: "border-box",
  background: theme.palette.primary.dark,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  color: "#fff",
  paddingBottom: "150px",
}));

export default Page;
