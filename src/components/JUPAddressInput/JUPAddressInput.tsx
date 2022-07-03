import React, { memo, useCallback, useState } from "react";
import { Input } from "@mui/material";
import { isValidAddress } from "utils/validation";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

const JUPAddressInput: React.FC = () => {
  const [address, setAddress] = useState<string>();
  const [isValidAddressState, setIsValidAddressState] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddressEntry = useCallback((inputValue) => {
    if (isValidAddress(inputValue)) {
      setAddress(inputValue);
      setIsValidAddressState(true);
      return;
    }
    setIsValidAddressState(false);
  }, []);

  // Waits to fire a notification about invalid addresses until the focus of the input is lost
  // this prevents constant notification firing during address entry
  const handleBlur = useCallback(() => {
    if (!isValidAddressState) {
      enqueueSnackbar(messageText.validation.addressInvalid, { variant: "error" });
    }
  }, [enqueueSnackbar, isValidAddressState]);

  return (
    <>
      <Input placeholder='Enter "To" Address' onBlur={handleBlur} onChange={(e) => handleAddressEntry(e.target.value)}></Input>
    </>
  );
};

export default memo(JUPAddressInput);
