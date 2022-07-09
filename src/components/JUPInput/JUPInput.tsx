import React, { memo, useCallback, useRef, useState } from "react";
import { Input } from "@mui/material";
import { isValidAddress, isValidQuantity } from "utils/validation";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

interface JUPInputProps {
  placeholder: string;
  fetchFn: (value: string | undefined) => void;
  inputType: "quantity" | "address" | "price";
}

const JUPInput: React.FC<JUPInputProps> = ({ placeholder, fetchFn, inputType }) => {
  const [isValidated, setIsValidated] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();

  // sets the validator function based on the type of the input the user wants to use
  const validationFn = useRef(inputType === "quantity" || inputType === "price" ? isValidQuantity : isValidAddress);

  const handleEntry = useCallback(
    (inputValue: string) => {
      if (validationFn.current.call(null, inputValue)) {
        fetchFn(inputValue);
        setIsValidated(true);
        return;
      }
      setIsValidated(false);
      fetchFn(undefined);
    },
    [fetchFn]
  );

  // Waits to fire a notification about validation failure until the focus of the input is lost
  // this prevents constant notification firing during entry
  const handleBlur = useCallback(() => {
    if (!isValidated) {
      switch (inputType) {
        case "quantity":
          enqueueSnackbar(messageText.validation.quantityInvalid, { variant: "error" });
          break;
        case "address":
          enqueueSnackbar(messageText.validation.addressInvalid, { variant: "error" });
          break;
        case "price":
          enqueueSnackbar(messageText.validation.priceInvalid, { variant: "error" });
          break;
      }
    }
  }, [enqueueSnackbar, inputType, isValidated]);

  return (
    <>
      <Input placeholder={placeholder} error={!isValidated} onBlur={handleBlur} onChange={(e) => handleEntry(e.target.value.toString())}></Input>
    </>
  );
};

export default memo(JUPInput);
