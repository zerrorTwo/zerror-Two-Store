import Box from "@mui/material/Box";
import InputBase from "../../../components/InputBase";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

function PriceTab({ formData, setFormData, onNext, onPre }) {
  const handleInputChange = (field) => (event) => {
    const value = event.target.value.replace(/,/g, ""); // Remove formatting for raw value
    setFormData((prev) => ({
      ...prev,
      [field]: value ? parseInt(value, 10) : "",
    }));
  };

  const isFormValid = () => {
    return formData.price && formData.stock;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    } else {
      toast.warning("Please fill in all the required fields in the table.");
    }
  };

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <InputBase
          height="60px"
          label="Price"
          value={
            formData.price ? new Intl.NumberFormat().format(formData.price) : ""
          }
          onChange={handleInputChange("price")}
        />
        <InputBase
          height="60px"
          label="Stock"
          value={
            formData.stock ? new Intl.NumberFormat().format(formData.stock) : ""
          }
          onChange={handleInputChange("stock")}
        />
      </Box>
      <Box
        marginTop="auto"
        justifyContent={"flex-end"}
        display={"flex"}
        gap={2}
        borderTop={"1px solid black"}
        pt={2}
      >
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
            "&:hover": {
              bgcolor: "secondary.dark",
            },
          }}
          onClick={onPre}
        >
          Pre
        </Button>
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
            "&:hover": {
              bgcolor: "secondary.dark",
            },
          }}
          onClick={handleNext}
          disabled={!isFormValid()} // Disable if form is not valid
        >
          Next
        </Button>
      </Box>
    </>
  );
}

PriceTab.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPre: PropTypes.func.isRequired,
};

export default PriceTab;
