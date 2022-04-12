import React, { useEffect, useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from "@mui/material";
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

const AddressBook: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const fullScreen = useBreakpoint("<", "md");
  const [addressList, setAddressList] = useState<Array<string>>();

  useEffect(() => {
    setAddressList(["JUP-ABCD-ABCD-ABCD-EFGHJ", "JUP-XXXX-XXXX-XXXX-XXXXX", "JUP-AAAA-BBBB-CCCC-DDDDD"]);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const Addresses = useMemo(() => {
    return addressList?.map((accountRs) => {
      return (
        <Stack direction={"row"}>
          <Typography>{accountRs}</Typography>
          <Button>Del</Button>
          <Button>Send</Button>
        </Stack>
      );
    });
  }, [addressList]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Address Book
      </Button>
      <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
        <DialogTitle>{"Address Book"}</DialogTitle>
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
