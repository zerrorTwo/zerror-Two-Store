import  FormControl  from "@mui/material/FormControl";
import  TextField  from "@mui/material/TextField";
import  {useTheme}  from "@mui/material/styles";
import PropTypes from "prop-types";

function InputBase({
  id,
  value,
  onChange,
  label,
  helperText,
  type = "text",
  disabled = false,
  name,
  required = false,
  multiline = false,
  maxWidth = false,
  height = "60px",
  maxHeight,
}) {
  const theme = useTheme();

  return (
    <FormControl sx={{ width: maxWidth ? "100%" : "350px" }}>
      <TextField
        id={id}
        sx={{
          width: maxWidth ? "100%" : "350px",
          borderRadius: 1,
          "& .MuiInputLabel-root": {
            color: theme.palette.text.primary,
            "&.Mui-focused": {
              color: theme.palette.text.primary,
            },
          },
          "& .MuiInputBase-input": {
            color: theme.palette.text.blackColor,
            height: height, // Set custom height
            maxHeight: maxHeight,
            padding: "8px 12px", // Ensure padding doesn't collapse
            boxSizing: "border-box",
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
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  maxWidth: PropTypes.bool,
  height: PropTypes.string,
  maxHeight: PropTypes.string,
};

export default InputBase;
