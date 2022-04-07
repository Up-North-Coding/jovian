import React from "react";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

interface SLinkProps {
  children?: React.ReactNode;
  external?: boolean;
  href: string;
}

const SLink: React.FC<SLinkProps> = ({ children, external, href }) => {
  if (external) {
    return (
      <Link target="_blank" rel="noreferrer" href={href}>
        {children}
      </Link>
    );
  }

  if (href.indexOf("http") === 0 || href.indexOf("https") === 0) {
    console.error('SLink expects full URLs to use the `external="true"` or `external` shorthand property. Did you want this to be an external link?');
  }

  return (
    <Link component={RouterLink} to={href}>
      {children}
    </Link>
  );
};

export default React.memo(SLink);
