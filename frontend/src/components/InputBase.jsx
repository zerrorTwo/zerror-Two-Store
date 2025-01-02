import { FormControl, TextField, useTheme } from "@mui/material";
import PropTypes from "prop-types";

function InputBase({
  value,
  onChange,
  label,
  helperText,
  type = "text",
  disabled = false,
  name,
  required = false,
  multiline = false,
}) {
  const theme = useTheme();

  return (
    <FormControl sx={{ maxWidth: "350px" }}>
      <TextField
        sx={{
          borderRadius: 1,
          "& .MuiInputLabel-root": {
            color: theme.palette.text.primary,
            "&.Mui-focused": {
              color: theme.palette.text.primary,
            },
          },
          "& .MuiInputBase-input": {
            color: theme.palette.text.blackColor,
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: theme.palette.text.primary,
            },
            "&:hover fieldset": {
              borderColor: theme.palette.text.primary,
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.text.primary,
            },
          },
        }}
        multiline={multiline}
        maxRows={20}
        value={value}
        onChange={onChange}
        helperText={helperText}
        FormHelperTextProps={{
          sx: { color: "#FE0032", fontStyle: "italic" },
        }}
        label={label}
        type={type}
        disabled={disabled}
        name={name}
        required={required}
      />
    </FormControl>
  );
}

InputBase.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  helperText: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
};

export default InputBase;
