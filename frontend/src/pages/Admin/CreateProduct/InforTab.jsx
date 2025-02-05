import Box from "@mui/material/Box";
import InputBase from "../../../components/InputBase";
import {
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
function InforTab() {
  const theme = useTheme();
  const { data: listCate = [] } = useGetAllCategoryQuery();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState(false);
  const [inputCategory, setInputCategory] = useState("");
  const handleCategorySelect = useCallback((category) => {
    setInputCategory(category);
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback((event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleClickAway = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setStatus(value === "true");
  };

  console.log(listCate);
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <Box display={"flex"} alignItems={"center"} gap={3}>
        <InputBase height="60px" label="Name" />
        <CategoryDropdown2
          isOpen={isDropdownOpen}
          selectedCategory={inputCategory}
          categories={listCate}
          theme={theme}
          onToggle={toggleDropdown}
          onSelect={handleCategorySelect}
          onClickAway={handleClickAway}
        />
        <FormControl>
          <FormLabel sx={{ color: "black !important" }}>Publish</FormLabel>
          <RadioGroup row value={status} onChange={handleChange}>
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
          height="60px"
          multiline={true}
          maxWidth
          label="Description"
        />
      </Box>
    </Box>
  );
}

export default InforTab;
