import React, { memo, useEffect, useMemo } from "react";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useMyTxs from "hooks/useMyTxs";

const TransactionsWidget: React.FC = () => {
  const { transactions } = useMyTxs();

  const Transactions = useMemo(() => {
    if (transactions === undefined) {
      return <></>;
    }

    return transactions.map((row: any) => (
      <TableRow key={row.fullHash} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row" align="right">
          {row.timestamp}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {row.amountNQT}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {row.senderRS + " > " + row.recipientRS}
        </TableCell>
      </TableRow>
    ));
  }, [transactions]);

  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>Transactions</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="center">{"From > To"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{Transactions}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default memo(TransactionsWidget);
