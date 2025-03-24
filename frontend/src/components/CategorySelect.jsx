import { Box } from "@mui/material/Box";
import { FormControl } from "@mui/material/FormControl";
import { InputLabel } from "@mui/material/InputLabel";
import { MenuItem } from "@mui/material/MenuItem";
import { Select } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";

import PropTypes from "prop-types";

function CategorySelect({ listCate, formData, handleInputChange }) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center">
      <FormControl sx={{ width: 300, mt: 0 }}>
        <InputLabel
          sx={{ color: theme.palette.text.blackColor }}
          id="type-select-label"
        >
          Category
        </InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          label="Type"
          sx={{
            "& .MuiInputBase-input": {
              color: theme.palette.text.blackColor,
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.blackColor,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "&.Mui-focused": {
              color: "black",
            },
          }}
        >
          <MenuItem value="">
            <em>Choose your category</em>
          </MenuItem>
          {listCate?.map((category) => (
            <MenuItem key={category._id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

CategorySelect.propTypes = {
  formData: PropTypes.object.isRequired,
  listCate: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default CategorySelect;
