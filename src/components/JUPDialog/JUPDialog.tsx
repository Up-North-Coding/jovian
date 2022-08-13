import React, { useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";

interface IJUPDialogProps {
  title?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeFn?: () => void;
  isCard?: boolean;
}

const JUPDialog: React.FC<IJUPDialogProps> = ({ title, children, isOpen, closeFn, isCard }) => {
  const isFullscreen = useBreakpoint("<", "md");

  const handleClose = useCallback(() => {
    if (closeFn) {
      closeFn();
    }
  }, [closeFn]);

  const OptionalCardMemo = useMemo(() => {
    return isCard ? (
      <DialogContent>
        <StyledCard variant="outlined">{children}</StyledCard>
      </DialogContent>
    ) : (
      <DialogContent>{children}</DialogContent>
    );
  }, [children, isCard]);

  return (
    <>
      <Dialog fullScreen={isFullscreen} open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
        <StyledCloseButton onClick={handleClose} variant="outlined">
          X
        </StyledCloseButton>
        <DialogTitle sx={{ alignSelf: "center" }}>{title}</DialogTitle>
        {OptionalCardMemo}
        <DialogActions>
          <Button variant="green" onClick={handleClose} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledCloseButton = styled(Button)(({ theme }) => ({
  width: "5%",
  margin: theme.spacing(2),
  position: "absolute",
}));

export default React.memo(JUPDialog);
