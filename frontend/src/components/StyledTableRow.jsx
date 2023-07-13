import styled from "@emotion/styled";
import TableRow from "@mui/material/TableRow";

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #20232c;
  }
  &:nth-of-type(even) {
    background-color: #1e1e28;
  }
  & > td {
    color: white;
  }
`;

export default StyledTableRow;
