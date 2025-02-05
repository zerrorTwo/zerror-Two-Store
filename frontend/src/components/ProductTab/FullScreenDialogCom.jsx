import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Button, useTheme, Tabs, Tab, TextField } from "@mui/material";
import InputBase from "../InputBase";
import ButtonPrimary from "../ButtonPrimary";
import InputSets from "../InputSets"; // Import the new component
import DynamicTable from "./DynamicTable"; // Import DynamicTable component
import InformationTab from "./InformationTab";
import TabPanel from "./TabPanel";
import {
  useUploadProductImageMutation,
  useCreateNewProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productSlice";
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
    variations: "{}",
  });

  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [initialPricing, setInitialPricing] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState([""]);
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateNewProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (row) {
      const variationsStr =
        typeof row.variations === "object"
          ? JSON.stringify(row.variations)
          : row.variations;
      setFormData({
        name: row.name || "",
        description: row.description || "",
        price: row.price?.toString() || "",
        quantity: row.quantity?.toString() || "",
        type: row.type || "",
        thumb: row.thumb || null,
        mainImg: row.mainImg || null,
        img: row.img || [],
        variations: variationsStr || "{}",
      });

      setStatus(row.status);

      const variations = JSON.parse(variationsStr || "{}");

      const variationsEntries = Object.entries(variations);
      const filteredVariations = Object.fromEntries(
        variationsEntries.slice(0, -1)
      );

      const dynamicCategories = Object.keys(filteredVariations).map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        items: filteredVariations[key] || [],
      }));

      console.log(variationsEntries);

      setCategories(dynamicCategories);
      setInitialPricing(variations.pricing || []);
      generateTableData(dynamicCategories, variations.pricing);
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
        variations: "{}",
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

    const data = combinations?.map((combination) => {
      const matchingPricing = Array.isArray(initialPricing)
        ? initialPricing.find((pricing) =>
            Object.keys(combination).every(
              (key) => combination[key] === pricing[key]
            )
          )
        : null;

      return {
        ...combination,
        price: matchingPricing ? matchingPricing.price : "",
        stock: matchingPricing ? matchingPricing.quantity : "",
      };
    });

    setTableData(data);
  };

  const handleTableChange = (index, field, value) => {
    if (field === "price") {
      // Remove commas from the value and parse to float
      const formattedValue = value.replace(/,/g, "");
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[index][field] = formattedValue;
        return newData;
      });
    } else {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[index][field] = value;
        return newData;
      });
    }
    // setTableData((prevData) => {
    //   const newData = [...prevData];
    //   newData[index][field] = value;
    //   return newData;
    // });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "price") {
      // Remove commas from the value and parse to float
      const formattedValue = value.replace(/,/g, "");
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
    // Kiểm tra nếu ít nhất một item trống trong category hiện tại
    if (categories[setIndex].items.some((item) => item.trim() === "")) {
      toast.error("All items must have a value before adding a new field");
      return; // Không cho phép thêm field mới nếu có field trống
    }

    setCategories((prevCategories) => {
      const newCategories = [...prevCategories]; // Create a copy of the categories array
      const updatedItems = [...newCategories[setIndex].items]; // Create a copy of the items array
      updatedItems.push(""); // Thêm một field trống vào danh sách items
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
      newCategoryName.trim() === "" || // Kiểm tra xem tên category có trống không
      newCategoryItems.every((item) => item.trim() === "") // Kiểm tra xem tất cả các items có trống không
    ) {
      toast.error("Category name and items cannot be empty");
      return; // Không cho phép thêm category nếu có trường trống
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
    if (newCategoryItems.some((item) => item.trim() === "")) {
      toast.error("All fields must be filled before adding a new item.");
      return; // Nếu có item trống, không cho phép thêm item mới
    }

    setNewCategoryItems((prevItems) => [...prevItems, ""]);
  };

  const handleCategoryInputChange = (setIndex, itemIndex, value) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[setIndex].items[itemIndex] = value;

      const hasNonEmptyItem = newCategories[setIndex].items.some(
        (item) => item.trim() !== ""
      );

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

      const updatedVariations = categories?.reduce((acc, category) => {
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
        variations: {
          ...updatedVariations,
          pricing: pricing,
        },
        mainImg: mainImgUrl,
        img: imgUrls,
      };

      updatedFormData.status = status;

      console.log(updatedFormData);
      if (create) {
        try {
          await createProduct({ data: updatedFormData }).unwrap();
          toast.success("Product created successfully");

          // Clear formData after successful creation
          handleResetFormData(); // Call reset function
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

  // Function to clear formData and other states
  const handleResetFormData = () => {
    // Reset formData and other states as needed
    setFormData({
      mainImg: "",
      img: [],
      // ... other fields if needed
    });
    setTableData([]);
    setCategories([]);
    setStatus(""); // Reset status if needed
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
            label="Variations"
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <InformationTab
            status={status}
            setStatus={setStatus}
            listCate={listCate}
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box>
            <Box sx={{ mt: 3 }}>
              <Box display={"flex"} gap={4} mb={2}>
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <InputBase
                    id="price"
                    // type="number"
                    margin="normal"
                    label="Price default"
                    name="price"
                    value={new Intl.NumberFormat().format(formData.price)}
                    onChange={handleInputChange}
                  />
                  <Typography display={"inline-block"} variant="h5">
                    đ
                  </Typography>
                </Box>
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
              <Typography variant="h6">Variations</Typography>
              <InputSets
                categories={categories}
                handleAddField={handleAddField}
                handleCategoryInputChange={handleCategoryInputChange} // Pass the new handle function
                handleDeleteField={handleDeleteField} // Pass the delete function
                handleDeleteCategory={handleDeleteCategory} // Pass the delete category function
              />
              <Box display={"flex"} gap={2} mb={2}>
                <TextField
                  variant="standard"
                  sx={{
                    maxWidth: 200,
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
                  margin="normal"
                />
                {newCategoryItems.map((item, index) => (
                  <TextField
                    sx={{
                      maxWidth: 200,
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
                    margin="normal"
                  />
                ))}
              </Box>
              <Box display={"flex"} gap={2} my={2}>
                <Button
                  variant="outlined"
                  onClick={addNewItemField}
                  sx={{ color: "InfoText", borderColor: "text.primary" }}
                >
                  Add New Item
                </Button>
                <ButtonPrimary text="More variations" onClick={handleAddSet} />
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
        <Button
          sx={{
            color: "black",
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        {value === 0 && (
          <Button
            sx={{
              color: "black",
            }}
            onClick={handleNext}
          >
            Next
          </Button>
        )}
        {value === 1 && (
          <Button
            sx={{
              color: "black",
            }}
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        {create ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid()}
            sx={{
              color: "black",
            }}
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
