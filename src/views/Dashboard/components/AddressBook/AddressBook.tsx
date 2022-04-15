import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  Input,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";

// [x] "Add / +" button
// Expands into input + "Add" button
// [ ] Tests
// [x] Close button
// [x] Put address rows into a table of some sort
// [x] Done button
// [ ] Get local storage working

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

    console.log("adding new address...", newAddress);
    const inputType = checkInputType(newAddress);
    if (inputType === "account" && newAddress !== undefined) {
      console.log("adding based on account type...");
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
        <Button sx={{ width: "5%", position: "absolute", top: "40px", right: "25px" }} onClick={toggleAddressMode} variant="outlined">
          +
        </Button>
      )}
    </>
  );
};

const AddressBook: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [addressBookEntries, setAddressBookEntries] = useState<Array<string>>();
  const isFullscreen = useBreakpoint("<", "md");

  // useEffect(() => {
  //   setAddressBookEntries(["JUP-ABCD-ABCD-ABCD-EFGHJ", "JUP-XXXX-XXXX-XXXX-XXXXX", "JUP-AAAA-BBBB-CCCC-DDDDD"]);
  // }, []);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleAddressAdd = useCallback((newEntry: string) => {
    console.log("adding new address", newEntry);
    setAddressBookEntries((prev) => {
      // first address book entry
      if (prev === undefined) {
        return [newEntry];
      }

      if (prev.includes(newEntry)) {
        // TODO: improve error handling
        console.error("address already saved:", newEntry);
        return prev;
      }
      return [...prev, newEntry];
    });
  }, []);

  const handleAddressDelete = useCallback((event, accountToDelete: string) => {
    // console.log("delete address:", event, "account to delete:", accountToDelete);
    setAddressBookEntries((prev) => prev?.filter((value) => value !== accountToDelete));
  }, []);

  const handleSendToAddress = useCallback((event, accountToSendTo: string) => {
    console.log("sent to address:", event, "account to send to:", accountToSendTo);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const Addresses = useMemo(() => {
    if (addressBookEntries === undefined) {
      return <></>;
    }

    return addressBookEntries.map((row) => (
      <TableRow key={row} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" align="right">
          {row}
        </TableCell>
        <TableCell align="right">{"TODO"}</TableCell>
        <TableCell align="right">{"TODO"}</TableCell>
        <TableCell align="right">
          <Stack key={row} direction={"row"}>
            <Button onClick={(e) => handleAddressDelete(e, row)}>Del</Button>
            <Button onClick={(e) => handleSendToAddress(e, row)}>Send</Button>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  }, [addressBookEntries, handleAddressDelete, handleSendToAddress]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Address Book
      </Button>
      <Dialog fullScreen={isFullscreen} open={open} onClose={handleClose}>
        <StyledCloseButton onClick={handleClose} variant="outlined">
          X
        </StyledCloseButton>
        <DialogTitle sx={{ alignSelf: "center" }}>Address Book</DialogTitle>
        <AddNewAddressInput setNewAddressFn={handleAddressAdd} />
        <DialogContent>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: "255px" }} align="right">
                    Account
                  </TableCell>
                  <TableCell align="right">Nickname</TableCell>
                  <TableCell align="right">Total Sent</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{Addresses}</TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const StyledCloseButton = styled(Button)(({ theme }) => ({
  width: "5%",
  margin: theme.spacing(2),
  position: "absolute",
}));

//
// Helper functions
//

function checkInputType(text?: string) {
  if (text === undefined) {
    return;
  }
  console.log("checking input string:", text, "setting type based on regex matches");
  const JUPRegex = /JUP-/i;
  const ALIASRegex = /\w/i;

  // Entry is likely an account/address
  if (JUPRegex.test(text)) {
    console.log("entry is likely an account, returning 'account'");
    return "account";

    // Entry is likely an alias
    // TODO: improve detection
  } else if (ALIASRegex.test(text)) {
    console.log("entry is likely an alias, returning 'alias'");
    return "alias";
  }
}

export default React.memo(AddressBook);
