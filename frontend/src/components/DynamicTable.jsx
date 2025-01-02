import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

const DynamicTable = ({ categories, tableData, handleTableChange }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {categories.map((category) => (
              <TableCell key={category.label}>{category.label}</TableCell>
            ))}
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow sx={{ height: "20px" }} key={index}>
              {categories.map((category) => (
                <TableCell key={category.label}>
                  {row[category.label.toLowerCase()]}
                </TableCell>
              ))}
              <TableCell>
                <TextField
                  sx={{
                    height: "30px",
                    "& .MuiInputBase-input": {
                      p: 0.5,
                    },
                  }}
                  type="number"
                  value={row.price}
                  onChange={(e) =>
                    handleTableChange(index, "price", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <TextField
                  sx={{
                    height: "30px",
                    "& .MuiInputBase-input": {
                      p: 0.5,
                    },
                  }}
                  type="number"
                  value={row.stock}
                  onChange={(e) =>
                    handleTableChange(index, "stock", e.target.value)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DynamicTable.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })
  ).isRequired,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.string,
      stock: PropTypes.string,
    })
  ).isRequired,
  handleTableChange: PropTypes.func.isRequired,
};

export default DynamicTable;
