import Box from "@mui/material/Box";
import InputBase from "../../../components/InputBase";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  useTheme,
} from "@mui/material";
import { useGetAllCategoryQuery } from "../../../redux/api/categorySlice";
import { useCallback, useState } from "react";
import CategoryDropdown2 from "../../../components/CategoryDropdown2";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

function InforTab({ formData, setFormData, onNext }) {
  const theme = useTheme();
  const { data: listCate = [] } = useGetAllCategoryQuery();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCategorySelect = useCallback(
    (selectedCategory) => {
      setFormData((prev) => ({ ...prev, type: selectedCategory }));
      setIsDropdownOpen(false);
    },
    [setFormData]
  );

  const toggleDropdown = useCallback((event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleClickAway = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handlePublishChange = (event) => {
    setFormData((prev) => ({ ...prev, status: event.target.value === "true" }));
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const isFormValid = () => {
    return formData?.name.trim() !== "" && formData?.type.trim() !== "";
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
      <Box display={"flex"} flexDirection={"column"} gap={2} flexGrow={1}>
        <Box display={"flex"} alignItems={"center"} gap={3}>
          <InputBase
            height="60px"
            label="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
          <CategoryDropdown2
            isOpen={isDropdownOpen}
            selectedCategory={formData?.type}
            categories={listCate}
            theme={theme}
            onToggle={toggleDropdown}
            onSelect={handleCategorySelect}
            onClickAway={handleClickAway}
          />
          <FormControl>
            <FormLabel sx={{ color: "black !important" }}>Publish</FormLabel>
            <RadioGroup
              row
              value={String(formData.status)}
              onChange={handlePublishChange}
            >
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    sx={{
                      color: "black",
                      "&.Mui-checked": {
                        color: "black",
                      },
                    }}
                  />
                }
                label="Active"
                sx={{ color: "black" }}
              />
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    sx={{
                      color: "black",
                      "&.Mui-checked": {
                        color: "black",
                      },
                    }}
                  />
                }
                label="Disable"
                sx={{ color: "black" }}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={2}>
          <InputBase
            maxHeight="380px"
            height="60px"
            multiline={true}
            maxWidth
            label="Description"
            value={formData.description}
            onChange={handleInputChange("description")}
          />
        </Box>
      </Box>

      {/* Nút Next ở dưới cùng */}
      <Box
        display="flex"
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={2}
        marginTop="auto"
        borderTop={"1px solid black"}
        pt={2}
      >
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
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

InforTab.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default InforTab;
