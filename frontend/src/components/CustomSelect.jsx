import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

function CustomSelect({ label, options, value, onChange }) {
  const theme = useTheme();

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 120,
      }}
      size="small"
    >
      <InputLabel
        id={`${label}-label`}
        sx={{
          color: theme.palette.text.secondary, // Default label text color
          "&.Mui-focused": {
            color: theme.palette.text.secondary, // Label text color when focused
          },
          "&:hover": {
            color: theme.palette.text.secondary, // Label text color on hover
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.secondary, // Default border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.secondary, // Border color on hover
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.secondary, // Border color when focused
          },
          "& .MuiSelect-icon": {
            color: theme.palette.text.secondary, // Dropdown icon color
          },
          "& .MuiSelect-select": {
            color: theme.palette.text.secondary, // Text color inside the Select
          },
        }}
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: theme.palette.background.default, // Background color of the dropdown
              "& .MuiMenuItem-root": {
                color: theme.palette.text.primary, // Text color of MenuItem
              },
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

CustomSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CustomSelect;
