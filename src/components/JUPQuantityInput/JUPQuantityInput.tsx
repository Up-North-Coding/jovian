import React, { memo, useCallback, useState } from "react";
import { Input } from "@mui/material";
import { isValidQuantity } from "utils/validation";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

interface JUPQuantityInputProps {
  placeholder: string;
  fetchQuantityFn: (quantity: string | undefined) => void;
}

const JUPQuantityInput: React.FC<JUPQuantityInputProps> = ({ placeholder, fetchQuantityFn }) => {
  const [isValidQuantityState, setIsValidQuantityState] = useState<boolean>();
  const { enqueueSnackbar } = useSnackbar();

  const handleQuantityEntry = useCallback(
    (inputValue: string) => {
      if (isValidQuantity(inputValue)) {
        fetchQuantityFn(inputValue);
        setIsValidQuantityState(true);
        return;
      }
      setIsValidQuantityState(false);
      fetchQuantityFn(undefined);
    },
    [fetchQuantityFn]
  );

  // Waits to fire a notification about invalid quantity until the focus of the input is lost
  // this prevents constant notification firing during quantity entry
  const handleBlur = useCallback(() => {
    if (!isValidQuantityState) {
      enqueueSnackbar(messageText.validation.quantityInvalid, { variant: "error" });
    }
  }, [enqueueSnackbar, isValidQuantityState]);

  return (
    <>
      <Input
        placeholder={placeholder}
        error={!isValidQuantityState}
        onBlur={handleBlur}
        onChange={(e) => handleQuantityEntry(e.target.value.toString())}
      ></Input>
    </>
  );
};

export default memo(JUPQuantityInput);
