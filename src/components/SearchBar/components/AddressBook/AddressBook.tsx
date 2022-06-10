import React, { memo, useCallback, useMemo, useState } from "react";
import { Button, DialogContent, FormGroup, IconButton, Input, Stack, styled } from "@mui/material";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import JUPDialog from "components/JUPDialog";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";
import { isValidAddress } from "utils/validation";
import useBreakpoint from "hooks/useBreakpoint";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";

// [ ] Get local storage working
// -- current local storage hook won't support a more structured object
// [ ] Add confirm on delete
// [ ] Address input component which validates the address + performs its own error reporting to the user

interface IAddNewAddressInputProps {
  setNewAddressFn?: (address: string) => void;
}

const AddNewAddressInput: React.FC<IAddNewAddressInputProps> = ({ setNewAddressFn }) => {
  const [isEnterAddressMode, setIsEnterAddressMode] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>();

  const toggleAddressMode = useCallback(() => {
    setIsEnterAddressMode((prev) => !prev);
  }, []);

  const handleAddNewAddress = useCallback(() => {
    if (setNewAddressFn === undefined) {
      return;
    }

    const inputType = checkInputType(newAddress);
    if (inputType === "account" && newAddress !== undefined) {
      setNewAddressFn(newAddress);
    } else if (inputType === "alias") {
      // console.log("adding based on alias type...");
      console.log("not implemented yet, need to work out proxy calls to be able to getAlias");
    }
  }, [newAddress, setNewAddressFn]);

  const handleNewAddressEntry = useCallback((inputVal: string) => {
    setNewAddress(inputVal);
  }, []);

  return (
    <>
      {isEnterAddressMode ? (
        <FormGroup sx={{ justifyContent: "center" }} row>
          <Input onChange={(e) => handleNewAddressEntry(e.target.value)} placeholder="Enter address or alias"></Input>
          <Button onClick={handleAddNewAddress} variant="contained">
            Add
          </Button>
        </FormGroup>
      ) : (
        <StyledPlusButton onClick={toggleAddressMode} variant="outlined">
          +
        </StyledPlusButton>
      )}
    </>
  );
};

const headCells: Array<IHeadCellProps> = [
  {
    id: "account",
    label: "Account",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "actions",
    label: "Actions",
    headAlignment: "center",
    rowAlignment: "center",
  },
];

const AddressBook: React.FC = () => {
  const [addressBookEntries, setAddressBookEntries] = useState<Array<string>>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const isMobileSmall = useBreakpoint("<", "sm");

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleAddressAdd = useCallback(
    (newEntry: string) => {
      setAddressBookEntries((prev) => {
        // first address book entry
        if (prev === undefined) {
          enqueueSnackbar(messageText.addressBook.success, { variant: "success" });
          return [newEntry];
        }

        if (prev.includes(newEntry)) {
          enqueueSnackbar(messageText.addressBook.duplicate, { variant: "info" });
          return prev;
        }
        enqueueSnackbar(messageText.addressBook.success, { variant: "success" });
        return [...prev, newEntry];
      });
    },
    [enqueueSnackbar]
  );

  const handleAddressDelete = useCallback(
    (_event, accountToDelete: string) => {
      // console.log("delete address:", event, "account to delete:", accountToDelete);
      setAddressBookEntries((prev) => prev?.filter((value) => value !== accountToDelete));
      enqueueSnackbar(messageText.addressBook.delete, { variant: "info" });
    },
    [enqueueSnackbar]
  );

  const handleSendToAddress = useCallback((event, accountToSendTo: string) => {
    console.log("Not implemented: sent to address:", event, "account to send to:", accountToSendTo);
  }, []);

  const addressBookRows: Array<ITableRow> | undefined = useMemo(() => {
    if (addressBookEntries === undefined || !Array.isArray(addressBookEntries)) {
      return undefined;
    }

    return addressBookEntries.map((address) => {
      return {
        account: address,
        actions: (
          <Stack direction={"row"} spacing={2} justifyContent="center">
            <Button variant="red" onClick={(e) => handleAddressDelete(e, address)}>
              Del
            </Button>
            <Button variant="green" onClick={(e) => handleSendToAddress(e, address)}>
              Send
            </Button>
          </Stack>
        ),
      };
    });
  }, [addressBookEntries, handleAddressDelete, handleSendToAddress]);

  const ConditionalAddressBookButtonMemo = useMemo(() => {
    return isMobileSmall ? (
      <IconButton onClick={handleOpen}>
        <ImportContactsIcon color="primary" />
      </IconButton>
    ) : (
      <StyledButton variant="outlined" onClick={handleOpen}>
        Address Book
      </StyledButton>
    );
  }, [handleOpen, isMobileSmall]);

  return (
    <div>
      {ConditionalAddressBookButtonMemo}
      <JUPDialog title="Address Book" isOpen={isOpen} closeFn={handleClose}>
        <AddNewAddressInput setNewAddressFn={handleAddressAdd} />
        <DialogContent>
          <JUPTable title={"Address Book"} headCells={headCells} rows={addressBookRows} keyProp={"account"}></JUPTable>
        </DialogContent>
      </JUPDialog>
    </div>
  );
};

const StyledPlusButton = styled(Button)(() => ({
  width: "5%",
  position: "absolute",
  top: "40px",
  right: "25px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  whiteSpace: "nowrap",
}));

//
// Helper functions
//

function checkInputType(text?: string) {
  if (text === undefined) {
    return;
  }
  const ALIASRegex = /\w/i;

  // Entry is likely an account/address
  if (isValidAddress(text)) {
    return "account";

    // Entry is likely an alias
    // TODO: improve detection
  } else if (ALIASRegex.test(text)) {
    return "alias";
  }
}

export default memo(AddressBook);
