import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputBase from "./InputBase";

const PricingTable = ({ pricing, onPricingChange, onStockChange, headers }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {pricing.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{`${item.size} x ${item.color}`}</TableCell>
              <TableCell>{`${item.size} ${item.color}`}</TableCell>
              <TableCell>
                <InputBase
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    onPricingChange(index, "price", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <InputBase
                  type="number"
                  value={item.stock || ""}
                  onChange={(e) => onStockChange(index, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

PricingTable.propTypes = {
  pricing: PropTypes.array.isRequired,
  onPricingChange: PropTypes.func.isRequired,
  onStockChange: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
};

export default PricingTable;
