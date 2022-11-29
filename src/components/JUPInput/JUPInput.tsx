import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { Chip, Input } from "@mui/material";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import { messageText } from "utils/common/messages";
import { isValidAddress, isValidQuantity } from "utils/validation";
import { useSnackbar } from "notistack";

interface JUPInputProps {
  placeholder: string;
  fetchInputValue: (value: string | undefined) => void;
  fetchAdornmentValue?: (symbol: string | undefined) => void;
  inputType: "quantity" | "address" | "price" | "symbol" | "fixed";
  symbols?: readonly string[];
  forcedValue?: string;
}

const JUPInput: React.FC<JUPInputProps> = ({ placeholder, fetchInputValue, fetchAdornmentValue, inputType, symbols, forcedValue }) => {
  const [isValidated, setIsValidated] = useState<boolean | undefined>(undefined);
  const { enqueueSnackbar } = useSnackbar();

  // sets the validator function based on the type of the input the user wants to use. It's starting to get too complicated
  // so this should probably be refactored to:
  //  1. Move validation function definitions to a separate file in utils
  //  2. When using the JUPInput, pass the appropriate function for validation: <JUPInput validationFn={} {...props} />
  const validationFn = useRef(
    inputType === "quantity" || inputType === "price" || inputType === "symbol" || inputType === "fixed" ? isValidQuantity : isValidAddress
  );

  const handleEntry = useCallback(
    (inputValue: string) => {
      try {
        // calls the validation function from reference
        if (validationFn.current.call(null, inputValue)) {
          fetchInputValue(inputValue);
          setIsValidated(true);
          return;
        }
        setIsValidated(false);
        fetchInputValue(undefined);
      } catch (e) {
        console.error("error while running validationFn:", e);
        return;
      }
    },
    [fetchInputValue]
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

    interface ICustomOptions {
      endAdornment: React.ReactNode;
    }

    let customOptions: ICustomOptions | never;
    // TODO: refactor JupInput to be a base component with 'custom' components wrapping it. send in the validation function and other details required from the custom layer.
    // change the custom options passed to the input based on the inputType provided where called
    switch (inputType) {
      case "symbol":
        if (fetchAdornmentValue === undefined) {
          throw new Error("No fetchAdornmentValue() function provided to JUPInput. Must be provided for inputType of 'symbol'");
        }

        customOptions = {
          endAdornment: <JUPAssetSearchBox fetchFn={(asset) => fetchAdornmentValue(asset)} />,
        };
        break;

      case "fixed":
        customOptions = {
          endAdornment: <Chip label="JUP" sx={{ margin: "5px" }} />,
        };
        break;

      default:
        customOptions = {} as never;
    }

    return (
      <Input
        sx={{ minWidth: "270px" }}
        placeholder={placeholder}
        error={isValidatedMemo}
        onBlur={(e) => handleBlur(e.target.value.toString())}
        onChange={(e) => handleEntry(e.target.value.toString())}
        value={forcedValue}
        {...customOptions}
      />
    );
  }, [fetchAdornmentValue, forcedValue, handleBlur, handleEntry, inputType, isValidatedMemo, placeholder, symbols]);

  return <>{inputTypeMemo}</>;
};

export default memo(JUPInput);
