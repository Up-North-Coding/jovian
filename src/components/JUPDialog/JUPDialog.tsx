import React, { useCallback, useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";

interface IJUPDialogProps {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeFn?: () => void;
}

// need a way from outside the dialog to set the dialog to open
const JUPDialog: React.FC<IJUPDialogProps> = ({ title, children, isOpen, closeFn }) => {
  // const [open, setOpen] = useState<boolean>(true);
  const isFullscreen = useBreakpoint("<", "md");

  const handleClose = useCallback(() => {
    if (closeFn) {
      closeFn();
    }
  }, [closeFn]);

  return (
    <>
      <Dialog fullScreen={isFullscreen} open={isOpen} onClose={handleClose}>
        <StyledCloseButton onClick={handleClose} variant="outlined">
          X
        </StyledCloseButton>
        <DialogTitle sx={{ alignSelf: "center" }}>{title}</DialogTitle>
        {children}
        <DialogActions>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const StyledCloseButton = styled(Button)(({ theme }) => ({
  width: "5%",
  margin: theme.spacing(2),
  position: "absolute",
}));

export default React.memo(JUPDialog);
