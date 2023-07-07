const { default: styled } = require("@emotion/styled");
const { TableRow } = require("@mui/material");

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
