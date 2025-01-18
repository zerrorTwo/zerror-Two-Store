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
import DynamicTable from "./ProductTab/DynamicTable"; // Import DynamicTable component
import InformationTab from "./ProductTab/InformationTab";
import TabPanel from "./ProductTab/TabPanel";
import {
  useUploadProductImageMutation,
  useCreateNewProductMutation,
  useUpdateProductMutation,
} from "../redux/api/productSlice";
import { toast } from "react-toastify";

function FullScreenDialogCom({
  open,
  handleClose,
  row = null,
  listCate,
  create,
}) {
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
  const [initialPricing, setInitialPricing] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState([""]);
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateNewProductMutation();
  const [updateProduct] = useUpdateProductMutation();

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
      setInitialPricing(attributes.pricing || []);
      generateTableData(dynamicCategories, attributes.pricing);
    } else {
      setFormData({
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
      setCategories([]);
      setTableData([]);
      setNewCategoryName("");
      setNewCategoryItems([""]);
      setInitialPricing([]);
    }
  }, [row]);

  useEffect(() => {
    generateTableData(categories, initialPricing);
  }, [categories, initialPricing]);

  const generateTableData = (categories, initialPricing = []) => {
    if (categories.length === 0) {
      setTableData([]);
      return;
    }

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

    const data = combinations.map((combination) => {
      const matchingPricing = initialPricing.find((pricing) =>
        Object.keys(combination).every(
          (key) => combination[key] === pricing[key]
        )
      );
      return {
        ...combination,
        price: matchingPricing ? matchingPricing.price : "",
        stock: matchingPricing ? matchingPricing.quantity : "",
      };
    });

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
    setFormData((prevData) => {
      if (name === "mainImg") {
        return {
          ...prevData,
          mainImg: files[0],
        };
      } else {
        const imgIndex = parseInt(name.replace("img", "")) - 1;
        const newImgArray = [...prevData.img];
        newImgArray[imgIndex] = files[0];
        return {
          ...prevData,
          img: newImgArray,
        };
      }
    });
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

  const handleDeleteCategory = (setIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories.splice(setIndex, 1);
      return newCategories;
    });
  };

  const handleAddSet = () => {
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

    generateTableData(
      [
        ...categories,
        {
          label: newCategoryName,
          items: filteredItems,
        },
      ],
      initialPricing
    );
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
        generateTableData(newCategories, initialPricing);
      } else {
        setTableData([]);
      }
      return newCategories;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let mainImgUrl = formData.mainImg;
      if (formData?.mainImg && formData?.mainImg !== row?.mainImg) {
        mainImgUrl = await uploadImage(formData.mainImg);
      } else {
        mainImgUrl = row.mainImg;
      }

      const imgUrls = await Promise.all(
        formData?.img.map(async (file, index) => {
          if (file && file !== row?.img[index]) {
            return await uploadImage(file);
          } else {
            return row?.img[index];
          }
        })
      );

      // Construct updatedAttributes dynamically
      const updatedAttributes = categories?.reduce((acc, category) => {
        acc[category.label.toLowerCase()] = category.items;
        return acc;
      }, {});

      const pricing = tableData?.map((item) => {
        const { price, stock, ...rest } = item;
        return {
          ...rest,
          price: parseFloat(price) || 0,
          quantity: parseInt(stock, 10) || 0,
        };
      });

      const updatedFormData = {
        ...formData,
        attributes: {
          ...updatedAttributes,
          pricing: pricing,
        },
        mainImg: mainImgUrl,
        img: imgUrls,
      };

      console.log(updatedFormData);
      if (create) {
        try {
          await createProduct({ data: updatedFormData }).unwrap();
          toast.success("Product created successfully");
        } catch (error) {
          toast.error(error?.message || error?.data?.message);
        }
      } else {
        try {
          const updated = await updateProduct({
            id: row._id,
            updatedFormData,
          }).unwrap();
          if (updated) {
            toast.success("Product updated successfully");
          }
        } catch (error) {
          toast.error(error?.message || error?.data?.message);
        }
      }

      handleClose();
    } catch (error) {
      console.error("Failed to submit product", error);
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { image } = await uploadProductImage(formData).unwrap();
    return image;
  };

  const handleNext = () => {
    setValue((prev) => Math.min(prev + 1, 1)); // Chuyển sang tab tiếp theo
  };

  const handleBack = () => {
    setValue((prev) => Math.max(prev - 1, 0)); // Quay lại tab trước đó
  };

  // Validation function
  const isFormValid = () => {
    const { name, type, mainImg, price, quantity, img } = formData;
    const areTableFieldsFilled =
      tableData.length === 0 ||
      tableData.every((item) => item.price !== "" && item.stock !== "");

    return (
      name !== "" &&
      type !== "" &&
      mainImg !== null &&
      img[0] !== undefined &&
      price !== "" &&
      quantity !== "" &&
      areTableFieldsFilled
    );
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
            listCate={listCate}
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
                  id="price"
                  type="number"
                  margin="normal"
                  label="Price default"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <InputBase
                  id="quantity"
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
                handleDeleteCategory={handleDeleteCategory} // Pass the delete category function
              />
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
                label="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                fullWidth
                margin="normal"
              />
              {newCategoryItems.map((item, index) => (
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
                  key={index}
                  label="New field"
                  value={item}
                  onChange={(e) => handleNewItemChange(index, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              ))}
              <Box display={"flex"} gap={2} my={2}>
                <Button variant="outlined" onClick={addNewItemField}>
                  Add New Item
                </Button>
                <ButtonPrimary text="More attributes" onClick={handleAddSet} />
              </Box>
            </Box>

            <Typography>Table</Typography>
            {tableData.length > 0 && (
              <DynamicTable
                categories={categories}
                tableData={tableData}
                handleTableChange={handleTableChange}
              />
            )}
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
        {create ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid()}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid()}
          >
            Update
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

FullScreenDialogCom.propTypes = {
  open: PropTypes.bool.isRequired,
  create: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  listCate: PropTypes.array.isRequired,
  row: PropTypes.object,
};

export default FullScreenDialogCom;
