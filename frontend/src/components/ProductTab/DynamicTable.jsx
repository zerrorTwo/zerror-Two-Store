import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
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
          {tableData.map((row, rowIndex) => (
            <TableRow sx={{ height: "20px" }} key={rowIndex}>
              {categories.map((category) => (
                <TableCell key={category.label}>
                  {typeof row[category.label.toLowerCase()] === "object"
                    ? JSON.stringify(row[category.label.toLowerCase()])
                    : row[category.label.toLowerCase()]}
                </TableCell>
              ))}
              <TableCell>
                <TextField
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                      "&.Mui-focused": {
                        color: "text.primary",
                      },
                    },
                    "& .MuiInputBase-input": {
                      p: 0.5,
                      color: "text.blackColor",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "text.primary",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.primary",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "text.primary",
                      },
                    },
                    height: "30px",
                  }}
                  // type="number"
                  value={new Intl.NumberFormat().format(Math.max(0, row.price))}
                  onChange={(e) =>
                    handleTableChange(rowIndex, "price", e.target.value)
                  }
                />
                <Typography
                  component={"div"}
                  sx={{ display: "inline-block", marginX: 1, marginTop: 1 }}
                  variant="body1"
                >
                  đ
                </Typography>
              </TableCell>
              <TableCell>
                <TextField
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "text.primary",
                      "&.Mui-focused": {
                        color: "text.primary",
                      },
                    },
                    "& .MuiInputBase-input": {
                      p: 0.5,
                      color: "text.blackColor",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "text.primary",
                      },
                      "&:hover fieldset": {
                        borderColor: "text.primary",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "text.primary",
                      },
                    },
                    height: "30px",
                  }}
                  // type="number"
                  value={new Intl.NumberFormat().format(Math.max(0, row.stock))}
                  onChange={(e) =>
                    handleTableChange(rowIndex, "stock", e.target.value)
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
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  handleTableChange: PropTypes.func.isRequired,
};

export default DynamicTable;
