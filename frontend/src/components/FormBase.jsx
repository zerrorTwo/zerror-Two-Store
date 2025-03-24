import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import InputBase from "./InputBase";
import { forwardRef, useImperativeHandle, useState } from "react";

const FormBase = forwardRef(({ item }, ref) => {
  const [formData, setFormData] = useState({
    name: item.name || "",
  });

  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    resetForm: () => setFormData({ name: "" }),
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 2 }}>
      <InputBase
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        helperText={
          formData.name.length > 32
            ? "Name must be less than 32 characters"
            : ""
        }
        required
      />
    </Box>
  );
});

FormBase.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

FormBase.displayName = "FormBase";

export default FormBase;
