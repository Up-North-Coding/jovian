import React, { memo, useCallback, useMemo, useState } from "react";
import { Button, DialogContent, IconButton, Stack, styled } from "@mui/material";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import JUPDialog from "components/JUPDialog";
import JUPInput from "components/JUPInput";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";
import useBreakpoint from "hooks/useBreakpoint";
import useAPIRouter from "hooks/useAPIRouter";
import { NXTtoNQT } from "utils/common/NXTtoNQT";
import { BigNumber } from "bignumber.js";
import AddIcon from "@mui/icons-material/Add";
import EmptyTable from "./components/EmptyTable";

interface IAddNewAddressInputProps {
  setNewAddressFn?: (address: string) => void;
}

const AddNewAddressInput: React.FC<IAddNewAddressInputProps> = ({ setNewAddressFn }) => {
  const [isEnterAddressMode, setIsEnterAddressMode] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>();

  const toggleAddressMode = useCallback(() => {
    setIsEnterAddressMode((prev) => !prev);
  }, []);

  const handleFetchAddress = useCallback((address: string | undefined) => {
    if (address === undefined) {
      return;
    }
    setNewAddress(address);
  }, []);

  const handleAddNewAddress = useCallback(() => {
    if (setNewAddressFn === undefined) {
      return;
    }

    if (newAddress !== undefined) {
      setNewAddressFn(newAddress);
    }
  }, [newAddress, setNewAddressFn]);

  return (
    <>
      {isEnterAddressMode ? (
        <Stack sx={{ justifyContent: "center" }} direction="row" spacing={2}>
          <JUPInput inputType="address" placeholder={"Enter Address"} fetchInputValue={(address) => handleFetchAddress(address)} />
          <Button onClick={handleAddNewAddress} variant="green">
            Add
          </Button>
        </Stack>
      ) : (
        <StyledPlusButton onClick={toggleAddressMode} color="primary" variant="outlined" endIcon={<AddIcon />}>
          Add
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
  const [collectTxDetails, setCollectTxDetails] = useState<boolean>();
  const [sendQuantity, setSendQuantity] = useState<string>();
  const [toAccount, setToAccount] = useState<string>();
  const [isOpenAddressBook, setIsOpenAddressBook] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const isMobileSmall = useBreakpoint("<", "sm");
  const { sendJUP } = useAPIRouter();

  const handleClose = useCallback(() => {
    setIsOpenAddressBook(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpenAddressBook(true);
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

  const handleSendToAddress = useCallback(
    async (event, accountToSendTo: string) => {
      if (accountToSendTo === undefined) {
        enqueueSnackbar("must provide an account to send to", { variant: "warning" });
        return;
      }

      setCollectTxDetails(true);
      setToAccount(accountToSendTo);
    },
    [enqueueSnackbar]
  );

  const handleNext = useCallback(async () => {
    if (sendJUP === undefined || sendQuantity === undefined) {
      return;
    }

    const isMessageIncluded = false; // not allowing messages using this send method for now

    setCollectTxDetails(false);
    // convert the user's input value to NQT value like the send API requires
    // no return here, sendJUP handles its own errors
    await sendJUP(toAccount as string, NXTtoNQT(new BigNumber(sendQuantity)).toString(), isMessageIncluded);
  }, [sendJUP, sendQuantity, toAccount]);

  const handleQuantityUpdate = useCallback(
    (quantity: string | undefined) => {
      if (quantity === undefined) {
        enqueueSnackbar("must set a send quantity", { variant: "warning" });
      }

      setSendQuantity(quantity);
    },
    [enqueueSnackbar]
  );

  const addressBookRows: Array<ITableRow> | undefined = useMemo(() => {
    if (addressBookEntries === undefined || !Array.isArray(addressBookEntries)) {
      return [];
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
              Send JUP
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
      <JUPDialog title="Address Book" isOpen={isOpenAddressBook} closeFn={handleClose}>
        <AddNewAddressInput setNewAddressFn={handleAddressAdd} />
        <DialogContent>
          <JUPTable headCells={headCells} rows={addressBookRows} keyProp={"account"} isPaginated EmptyRowPlaceholder={EmptyTable}></JUPTable>
        </DialogContent>
      </JUPDialog>
      {collectTxDetails ? (
        <JUPDialog isOpen={collectTxDetails} closeFn={handleClose}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <JUPInput placeholder="Enter Quantity" inputType="quantity" fetchInputValue={(quantity) => handleQuantityUpdate(quantity)}></JUPInput>
            <Button onClick={handleNext} variant="green">
              Next
            </Button>
          </Stack>
        </JUPDialog>
      ) : (
        <></>
      )}
    </div>
  );
};

const StyledPlusButton = styled(Button)(() => ({
  position: "absolute",
  top: "40px",
  right: "25px",
}));

const StyledButton = styled(Button)(() => ({
  whiteSpace: "nowrap",
}));

export default memo(AddressBook);
