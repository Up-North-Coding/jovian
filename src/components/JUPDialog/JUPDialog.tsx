import React, { useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";

interface IJUPDialogProps {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeFn?: () => void;
}

const JUPDialog: React.FC<IJUPDialogProps> = ({ title, children, isOpen, closeFn }) => {
  const isFullscreen = useBreakpoint("<", "md");

  const handleClose = useCallback(() => {
    if (closeFn) {
      closeFn();
    }
  }, [closeFn]);

  return (
    <>
      <Dialog fullScreen={isFullscreen} open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
        <StyledCloseButton onClick={handleClose} variant="outlined">
          X
        </StyledCloseButton>
        <DialogTitle sx={{ alignSelf: "center" }}>{title}</DialogTitle>
        <DialogContent sx={{ alignSelf: "center" }}>{children}</DialogContent>
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
