import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormGroup,
  Input,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// [ ]: "Add / +" button
// Expands into input + "Add" button
// [ ]: Tests
// [ ]: Close button
// [ ]: Put address rows into a table of some sort
// [x] Done button

const AddNewAddressInput: React.FC = () => {
  const [isEnterAddressMode, setIsEnterAddressMode] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>();

  const toggleAddressMode = useCallback(() => {
    console.log("entering add address mode...");
    setIsEnterAddressMode((prev) => !prev);
  }, []);

  const handleAddAddress = useCallback(() => {
    console.log("adding new address...", newAddress);
    const inputType = checkInputType(newAddress);
    if (inputType === "account") {
      console.log("adding based on account type...");
    } else if (inputType === "alias") {
      console.log("adding based on alias type...");
    }
  }, [newAddress]);

  const handleNewAddressEntry = useCallback((inputVal: string) => {
    setNewAddress(inputVal);
  }, []);

  useEffect(() => {
    console.log("input:", newAddress);
  }, [newAddress]);

  return (
    <>
      {isEnterAddressMode ? (
        <FormGroup row>
          <Input onChange={(e) => handleNewAddressEntry(e.target.value)} placeholder="Enter address or alias"></Input>
          <Button onClick={handleAddAddress} variant="contained">
            Add
          </Button>
        </FormGroup>
      ) : (
        <Button onClick={toggleAddressMode} variant="outlined">
          +
        </Button>
      )}
    </>
  );
};

const AddressBook: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const fullScreen = useBreakpoint("<", "md");
  const [addressList, setAddressList] = useState<Array<string>>();

  useEffect(() => {
    setAddressList(["JUP-ABCD-ABCD-ABCD-EFGHJ", "JUP-XXXX-XXXX-XXXX-XXXXX", "JUP-AAAA-BBBB-CCCC-DDDDD"]);
  }, []);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleAddressDelete = useCallback((event, accountToDelete: string) => {
    console.log("delete address:", event, "account to delete:", accountToDelete);
  }, []);

  const handleSendToAddress = useCallback((event, accountToSendTo: string) => {
    console.log("sent to address:", event, "account to send to:", accountToSendTo);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const Addresses = useMemo(() => {
    return addressList?.map((accountRs) => {
      return (
        <Stack key={accountRs} direction={"row"}>
          <Typography>{accountRs}</Typography>
          <Button onClick={(e) => handleAddressDelete(e, accountRs)}>Del</Button>
          <Button onClick={(e) => handleSendToAddress(e, accountRs)}>Send</Button>
        </Stack>
      );
    });
  }, [addressList, handleAddressDelete, handleSendToAddress]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Address Book
      </Button>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <StyledCloseButton onClick={handleClose} variant="outlined">
          X
        </StyledCloseButton>
        <DialogTitle>{"Address Book"}</DialogTitle>
        <AddNewAddressInput />
        <DialogContent>
          <DialogContentText>{Addresses}</DialogContentText>
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

// another way to do it with more table structure
//
// function createData(account: string, nickname: string, totalSent: number, actions: string) {
//   return { account, nickname, totalSent, actions };
// }

// const rows = [createData("JUP-ABCD-ABCD-ABCD-ABCDE", "Bob", 55, "test")];

// const DenseTable: React.FC = () => {
//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 850 }} size="small" aria-label="a dense table">
//         <TableHead>
//           <TableRow>
//             <TableCell>Addresses</TableCell>
//             <TableCell align="right">Account</TableCell>
//             <TableCell align="right">Nickname</TableCell>
//             <TableCell align="right">Total Sent</TableCell>
//             <TableCell align="right">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <TableRow key={row.account} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
//               <TableCell component="th" scope="row">
//                 {row.account}
//               </TableCell>
//               <TableCell align="right">{row.account}</TableCell>
//               <TableCell align="right">{row.nickname}</TableCell>
//               <TableCell align="right">{row.totalSent}</TableCell>
//               <TableCell align="right">{row.actions}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };