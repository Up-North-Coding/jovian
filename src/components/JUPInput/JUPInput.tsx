import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Chip, Input } from "@mui/material";
import { messageText } from "utils/common/messages";
import { isValidAddress, isValidQuantity } from "utils/validation";
import { useSnackbar } from "notistack";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";

interface JUPInputProps {
  placeholder: string;
  fetchFn: (value: string | undefined) => void;
  inputType: "quantity" | "address" | "price" | "symbol" | "fixed";
  symbols?: readonly string[];
}

const JUPInput: React.FC<JUPInputProps> = ({ placeholder, fetchFn, inputType, symbols }) => {
  const [isValidated, setIsValidated] = useState<boolean | undefined>(undefined);
  const [selectedSymbol, setSelectedSymbol] = useState<string>();
  const { enqueueSnackbar } = useSnackbar();

  // sets the validator function based on the type of the input the user wants to use
  const validationFn = useRef(
    inputType === "quantity" || inputType === "price" || inputType === "symbol" || inputType === "fixed" ? isValidQuantity : isValidAddress
  );

  const handleEntry = useCallback(
    (inputValue: string) => {
      try {
        // calls the validation function from reference
        if (validationFn.current.call(null, inputValue)) {
          fetchFn(inputValue);
          setIsValidated(true);
          return;
        }
        setIsValidated(false);
        fetchFn(undefined);
      } catch (e) {
        console.error("error while running validationFn:", e);
        return;
      }
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

  const inputTypeMemo = useMemo(() => {
    // if the input type is symbol and we haven't provided an array of symbols, throw an error
    if (inputType === "symbol" && (symbols?.length === 0 || symbols === undefined)) {
      throw new Error(
        "Symbols must be provided for 'symbol' type JUPInputs. Did you make a symbol type JUPInput but fail to pass it a Symbols array?"
      );
    }

    // change the input we return based on the inputType provided where called
    switch (inputType) {
      case "symbol":
        return (
          <Input
            sx={{ minWidth: "270px" }}
            placeholder={placeholder}
            error={isValidatedMemo}
            onBlur={(e) => handleBlur(e.target.value.toString())}
            onChange={(e) => handleEntry(e.target.value.toString())}
            endAdornment={<JUPAssetSearchBox fetchFn={(asset) => fetchFn(asset)} />}
          />
        );

      case "fixed":
        return (
          <Input
            sx={{ minWidth: "270px" }}
            placeholder={placeholder}
            error={isValidatedMemo}
            onBlur={(e) => handleBlur(e.target.value.toString())}
            onChange={(e) => handleEntry(e.target.value.toString())}
            endAdornment={<Chip label="JUP" sx={{ margin: "5px" }} />}
          />
        );
      default:
        return (
          <Input
            sx={{ minWidth: "270px" }}
            placeholder={placeholder}
            error={isValidatedMemo}
            onBlur={(e) => handleBlur(e.target.value.toString())}
            onChange={(e) => handleEntry(e.target.value.toString())}
          />
        );
    }
  }, [fetchFn, handleBlur, handleEntry, inputType, isValidatedMemo, placeholder, symbols]);

  return <>{inputTypeMemo}</>;
};

export default memo(JUPInput);
