import { useState, useEffect } from "react";
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
  Popover,
  Button,
  TextField,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import TreeSelect from "./TreeList";
import CustomSelect from "../../components/CustomSelect";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { selectOptions } from "../../constants/type.js";
import ButtonPrimary from "../../components/ButtonPrimary";

function CateDashboard() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [radioValue, setRadioValue] = useState("new");
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState("");
  const [parentName, setParentName] = useState("");
  const [formFields, setFormFields] = useState([
    {
      attribute: "",
      type: "",
      required: true,
    },
  ]);

  useEffect(() => {
    if (selectedCategory) {
      setName(selectedCategory.name || "");
      setParentName(selectedCategory.parentName || "");
      setFormFields(
        selectedCategory.attributes.map((attr) => ({
          attribute: attr.name,
          type: attr.type,
          required: attr.required,
        }))
      );
    }
  }, [selectedCategory]);

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSelectChange = (index, event) => {
    const newFormFields = [...formFields];
    newFormFields[index].type = event.target.value;
    setFormFields(newFormFields);
  };

  const handleAddField = () => {
    setFormFields([
      ...formFields,
      {
        attribute: "",
        type: "",
        required: true,
      },
    ]);
  };

  const handleInputChange = (index, event) => {
    const newFormFields = [...formFields];
    newFormFields[index].attribute = event.target.value;
    setFormFields(newFormFields);
  };

  const handleCheckboxChange = (index, event) => {
    const newFormFields = [...formFields];
    newFormFields[index].required = event.target.checked;
    setFormFields(newFormFields);
  };

  const handleSave = () => {
    const data = {
      name,
      parentName,
      attributes: formFields.map((field) => ({
        name: field.attribute,
        type: field.type,
        required: field.required,
      })),
    };
    console.log(data);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box sx={{ flexGrow: 1, my: 3, mx: 1 }}>
      <Box>
        <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
          Category Dashboard
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          py: 3,
          height: "100%",
          display: "grid",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            alignItems: "center",
            display: "flex",
            gap: 1,
            margin: "0 auto",
          }}
        >
          <SentimentSatisfiedAltIcon />
          Create new or select one to create category
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={radioValue}
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="new"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                />
              }
              label="New"
            />
            <FormControlLabel
              value="available"
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                />
              }
              label="Available"
            />
          </RadioGroup>
        </Box>
        {radioValue === "available" && (
          <>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                sx={{ width: "200px" }}
                aria-describedby={id}
                variant="contained"
                onClick={handleButtonClick}
              >
                Select Category
              </Button>
              {selectedCategory && (
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.button.error }}
                >
                  Selected Category: {selectedCategory.name}
                </Typography>
              )}
            </Box>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  width: "80vw",
                  bgcolor: theme.palette.background.default,
                }}
              >
                <TreeSelect
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </Box>
            </Popover>
          </>
        )}
        <Divider
          sx={{ bgcolor: theme.palette.text.primary, width: "80vw", mt: 2 }}
        />
        <Box sx={{ mt: 2 }}>
          <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              Name
            </Typography>
            <TextField
              variant="standard"
              required
              autoFocus
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiInput-underline:after": {
                  borderBottomColor: theme.palette.text.secondary,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: theme.palette.text.secondary,
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: theme.palette.text.secondary,
                },
              }}
            />
          </Box>

          <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.primary }}
            >
              Parent
            </Typography>
            <TextField
              variant="standard"
              required
              autoFocus
              value={parentName || ""}
              onChange={(e) => setParentName(e.target.value)}
              sx={{
                "& .MuiInput-underline:after": {
                  borderBottomColor: theme.palette.text.secondary,
                },
                "& .MuiInput-underline:before": {
                  borderBottomColor: theme.palette.text.secondary,
                },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: theme.palette.text.secondary,
                },
              }}
            />
          </Box>

          {formFields.map((field, index) => (
            <Box key={index} display={"flex"} gap={10} alignItems={"center"}>
              <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.text.primary }}
                >
                  Attribute
                </Typography>
                <TextField
                  value={field.attribute || ""}
                  onChange={(event) => handleInputChange(index, event)}
                  variant="standard"
                  required
                  autoFocus
                  sx={{
                    "& .MuiInput-underline:after": {
                      borderBottomColor: theme.palette.text.secondary,
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: theme.palette.text.secondary,
                    },
                    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                      borderBottomColor: theme.palette.text.secondary,
                    },
                  }}
                />
              </Box>
              <CustomSelect
                label="Type"
                options={selectOptions}
                value={field.type || ""}
                onChange={(event) => handleSelectChange(index, event)}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.required}
                    onChange={(event) => handleCheckboxChange(index, event)}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="Required"
                sx={{
                  color: "white",
                }}
              />
            </Box>
          ))}

          <IconButton onClick={handleAddField}>
            <Tooltip title="More attribute">
              <AddCircleIcon sx={{ color: theme.palette.text.secondary }} />
            </Tooltip>
          </IconButton>
        </Box>
        <ButtonPrimary text="Save" onClick={handleSave} />
      </Box>
    </Box>
  );
}

export default CateDashboard;
