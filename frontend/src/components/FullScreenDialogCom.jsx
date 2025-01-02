import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Button, useTheme, Tabs, Tab, TextField } from "@mui/material";
import InputBase from "./InputBase";
import ButtonPrimary from "./ButtonPrimary";
import InputSets from "./InputSets"; // Import the new component
import DynamicTable from "./DynamicTable"; // Import DynamicTable component
import InformationTab from "./ProductTab/InformationTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function FullScreenDialogCom({ open, handleClose, row = null }) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    type: "",
    thumb: null,
    mainImg: null,
    img: [],
    attributes: "{}",
  });

  const [categories, setCategories] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState([""]);

  useEffect(() => {
    if (row) {
      const attributesStr =
        typeof row.attributes === "object"
          ? JSON.stringify(row.attributes)
          : row.attributes;
      setFormData({
        name: row.name || "",
        description: row.description || "",
        price: row.price?.toString() || "",
        quantity: row.quantity?.toString() || "",
        type: row.type || "",
        thumb: row.thumb || null,
        mainImg: row.mainImg || null,
        img: row.img || [],
        attributes: attributesStr || "{}",
      });

      // Parse the attributes and set categories dynamically
      const attributes = JSON.parse(attributesStr || "{}");
      const attributeEntries = Object.entries(attributes);
      const filteredAttributes = Object.fromEntries(
        attributeEntries.slice(0, -1)
      );
      const dynamicCategories = Object.keys(filteredAttributes).map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        items: filteredAttributes[key] || [],
      }));
      setCategories(dynamicCategories);

      // Generate initial table data
      generateTableData(dynamicCategories);
    }
  }, [row]);

  useEffect(() => {
    // Regenerate table data whenever categories change
    generateTableData(categories);
  }, [categories]);

  const generateTableData = (categories) => {
    if (categories.length === 0) return;

    // Create combinations of categories and generate data
    const combinations = [];
    const combine = (index, current) => {
      if (index === categories.length) {
        combinations.push(current);
        return;
      }
      categories[index].items.forEach((item) => {
        combine(index + 1, {
          ...current,
          [categories[index].label.toLowerCase()]: item,
        });
      });
    };
    combine(0, {});

    // Initialize table data with price and stock fields
    const data = combinations.map((combination) => ({
      ...combination,
      price: "",
      stock: "",
    }));
    setTableData(data);
  };

  const handleTableChange = (index, field, value) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleAddField = (setIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories]; // Create a copy of the categories array
      const updatedItems = [...newCategories[setIndex].items]; // Create a copy of the items array
      updatedItems.push("");
      newCategories[setIndex].items = updatedItems;
      return newCategories;
    });
  };

  const handleDeleteField = (setIndex, itemIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[setIndex].items.splice(itemIndex, 1);
      return newCategories;
    });
  };

  const handleAddSet = () => {
    // Ensure the new category name is not empty and at least one item has a value
    if (
      newCategoryName.trim() === "" ||
      newCategoryItems.every((item) => item.trim() === "")
    ) {
      return;
    }

    const filteredItems = newCategoryItems.filter((item) => item.trim() !== "");

    setCategories((prevCategories) => [
      ...prevCategories,
      {
        label: newCategoryName,
        items: filteredItems,
      },
    ]);
    setNewCategoryName("");
    setNewCategoryItems([""]);

    // Regenerate table data after adding a new set
    generateTableData([
      ...categories,
      {
        label: newCategoryName,
        items: filteredItems,
      },
    ]);
  };

  const handleNewItemChange = (itemIndex, value) => {
    setNewCategoryItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[itemIndex] = value;
      return newItems;
    });
  };

  const addNewItemField = () => {
    setNewCategoryItems((prevItems) => [...prevItems, ""]);
  };

  const handleCategoryInputChange = (setIndex, itemIndex, value) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[setIndex].items[itemIndex] = value;

      // Check if the updated category has at least one non-empty item
      const hasNonEmptyItem = newCategories[setIndex].items.some(
        (item) => item.trim() !== ""
      );

      // Regenerate the table data only if the category has at least one non-empty item
      if (hasNonEmptyItem) {
        generateTableData(newCategories);
      }
      return newCategories;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedAttributes = categories.reduce((acc, category) => {
        acc[category.label.toLowerCase()] = category.items;
        return acc;
      }, {});

      const updatedFormData = {
        ...formData,
        attributes: JSON.stringify(updatedAttributes),
        tableData,
      };

      console.log("Updating product with data:", updatedFormData);
      handleClose();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const handleNext = () => {
    setValue((prev) => Math.min(prev + 1, 1)); // Chuyển sang tab tiếp theo
  };

  const handleBack = () => {
    setValue((prev) => Math.max(prev - 1, 0)); // Quay lại tab trước đó
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      aria-labelledby="full-screen-dialog-title"
    >
      <DialogContent
        sx={{
          overflowY: "auto",
          flex: "1 1 auto",
          maxHeight: "100%",
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab
            sx={{
              "&.MuiTab-root": {
                color: theme.palette.text.blackColor, // Màu khi tab không được chọn
              },
              "&:hover": {
                color: theme.palette.text.primary, // Màu khi hover
              },
            }}
            label="Information"
          />
          <Tab
            sx={{
              "&.MuiTab-root": {
                color: theme.palette.text.blackColor, // Màu khi tab không được chọn
              },
              "&:hover": {
                color: theme.palette.text.primary, // Màu khi hover
              },
            }}
            label="Attributes"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <InformationTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box>
            <Box sx={{ mt: 3 }}>
              <Box display={"flex"} gap={2} mb={2}>
                <InputBase
                  type="number"
                  margin="normal"
                  label="Price default"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <InputBase
                  type="number"
                  margin="normal"
                  label="Quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </Box>
              <Typography variant="h6">Attributes</Typography>
              <InputSets
                categories={categories}
                handleAddField={handleAddField}
                handleCategoryInputChange={handleCategoryInputChange} // Pass the new handle function
                handleDeleteField={handleDeleteField} // Pass the delete function
              />
              <TextField
                label="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                fullWidth
                margin="normal"
              />
              {newCategoryItems.map((item, index) => (
                <TextField
                  key={index}
                  value={item}
                  onChange={(e) => handleNewItemChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Button onClick={addNewItemField}>Add New Item</Button>
              <ButtonPrimary
                text="Thêm phân loại hàng"
                onClick={handleAddSet}
              />
            </Box>

            <Typography>Table</Typography>
            <DynamicTable
              categories={categories}
              tableData={tableData}
              handleTableChange={handleTableChange}
            />
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions
        sx={{
          position: "sticky",
          bottom: 2,
          zIndex: 1,
          background: theme.palette.background.paper,
          boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Button onClick={handleClose}>Cancel</Button>
        {value === 0 && <Button onClick={handleNext}>Next</Button>}
        {value === 1 && <Button onClick={handleBack}>Back</Button>}
        <Button onClick={handleSubmit} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FullScreenDialogCom.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.object,
};

export default FullScreenDialogCom;
