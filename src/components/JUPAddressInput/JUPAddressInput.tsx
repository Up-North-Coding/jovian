import React, { memo, useCallback, useState } from "react";
import { Input } from "@mui/material";
import { isValidAddress } from "utils/validation";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

interface JUPAddressInputProps {
  placeholder: string;
  fetchAddressFn: (address: string | undefined) => void;
}

const JUPAddressInput: React.FC<JUPAddressInputProps> = ({ placeholder, fetchAddressFn }) => {
  const [isValidAddressState, setIsValidAddressState] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();

  const handleAddressEntry = useCallback(
    (inputValue) => {
      if (isValidAddress(inputValue)) {
        fetchAddressFn(inputValue);
        setIsValidAddressState(true);
        return;
      }
      setIsValidAddressState(false);
      fetchAddressFn(undefined);
    },
    [fetchAddressFn]
  );

  // Waits to fire a notification about invalid addresses until the focus of the input is lost
  // this prevents constant notification firing during address entry
  const handleBlur = useCallback(() => {
    if (!isValidAddressState) {
      enqueueSnackbar(messageText.validation.addressInvalid, { variant: "error" });
    }
  }, [enqueueSnackbar, isValidAddressState]);

  return (
    <>
      <Input
        placeholder={placeholder}
        error={!isValidAddressState}
        onBlur={handleBlur}
        onChange={(e) => handleAddressEntry(e.target.value.toString())}
      ></Input>
    </>
  );
};

export default memo(JUPAddressInput);
