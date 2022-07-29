import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Input, styled } from "@mui/material";
import { messageText } from "utils/common/messages";
import { isValidAddress, isValidQuantity } from "utils/validation";
import { useSnackbar } from "notistack";

interface JUPInputProps {
  placeholder: string;
  fetchFn: (value: string | undefined) => void;
  inputType: "quantity" | "address" | "price";
}

const JUPInput: React.FC<JUPInputProps> = ({ placeholder, fetchFn, inputType }) => {
  const [isValidated, setIsValidated] = useState<boolean | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();

  // sets the validator function based on the type of the input the user wants to use
  const validationFn = useRef(inputType === "quantity" || inputType === "price" ? isValidQuantity : isValidAddress);

  const handleEntry = useCallback(
    (inputValue: string) => {
      // calls the validation function from reference
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
  const handleBlur = useCallback(
    (inputValue: string) => {
      if (!isValidated && inputValue.length != 0) {
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
    },
    [enqueueSnackbar, inputType, isValidated]
  );

  // initial error state should be undefined to prevent error/success underlining of input
  const isValidatedMemo = useMemo(() => {
    return isValidated === undefined ? undefined : !isValidated;
  }, [isValidated]);

  return (
    <>
      <Input
        sx={{ minWidth: "270px" }}
        placeholder={placeholder}
        error={isValidatedMemo}
        onBlur={(e) => handleBlur(e.target.value.toString())}
        onChange={(e) => handleEntry(e.target.value.toString())}
      />
    </>
  );
};

export default memo(JUPInput);
