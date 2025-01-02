import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Button, useTheme, Card, Tabs, Tab } from "@mui/material";
import InputBase from "./InputBase";
import ButtonPrimary from "./ButtonPrimary";
import InputSets from "./InputSets"; // Import the new component
import DynamicTable from "./DynamicTable"; // Import DynamicTable component

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
      const newCategories = [...prevCategories];
      newCategories[setIndex].items.push("");
      return newCategories;
    });
  };

  const handleAddSet = () => {
    setCategories((prevCategories) => [
      ...prevCategories,
      {
        label: "New Category",
        items: [""],
      },
    ]);
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
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Box display={"flex"} gap={4}>
              <InputBase
                fullWidth={true}
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <InputBase
                fullWidth={false}
                margin="normal"
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              />
            </Box>
            <InputBase
              multiline={true}
              margin="normal"
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
            <Box sx={{ mt: 2, display: "flex" }}>
              {/* Upload Main Image */}
              <Card
                sx={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  height: "160px",
                  width: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed gray", // Màu viền cho khu vực upload
                }}
                onClick={() => document.getElementById("mainImgInput").click()} // Mở file input khi click vào Card
              >
                {formData.mainImg ? (
                  <img
                    src={
                      typeof formData.mainImg === "string"
                        ? formData.mainImg
                        : URL.createObjectURL(formData.mainImg)
                    }
                    alt="Main Image"
                    style={{
                      maxHeight: "160px",
                      maxWidth: "160px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    Click to upload main image
                  </Typography>
                )}
                <input
                  id="mainImgInput"
                  type="file"
                  hidden
                  name="mainImg"
                  onChange={handleFileChange}
                />
              </Card>

              {/* Upload Image 1 */}
              <Card
                sx={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  height: "160px",
                  width: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed gray", // Màu viền cho khu vực upload
                }}
                onClick={() => document.getElementById("imgInput1").click()} // Mở file input khi click vào Card
              >
                {formData.img[0] ? (
                  <img
                    src={
                      typeof formData.img[0] === "string"
                        ? formData.img[0]
                        : URL.createObjectURL(formData.img[0])
                    }
                    alt="Image 1"
                    style={{
                      maxHeight: "160px",
                      maxWidth: "160px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    Click to upload image 1
                  </Typography>
                )}
                <input
                  id="imgInput1"
                  type="file"
                  hidden
                  name="img1"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFormData((prevData) => ({
                      ...prevData,
                      img: [file, ...prevData.img.slice(1)], // Chỉ cập nhật ảnh 1
                    }));
                  }}
                />
              </Card>

              {/* Upload Image 2 */}
              <Card
                sx={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  height: "160px",
                  width: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed gray", // Màu viền cho khu vực upload
                }}
                onClick={() => document.getElementById("imgInput2").click()} // Mở file input khi click vào Card
              >
                {formData.img[1] ? (
                  <img
                    src={
                      typeof formData.img[1] === "string"
                        ? formData.img[1]
                        : URL.createObjectURL(formData.img[1])
                    }
                    alt="Image 2"
                    style={{
                      maxHeight: "160px",
                      maxWidth: "160px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    Click to upload image 2
                  </Typography>
                )}
                <input
                  id="imgInput2"
                  type="file"
                  hidden
                  name="img2"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFormData((prevData) => ({
                      ...prevData,
                      img: [prevData.img[0], file, ...prevData.img.slice(2)], // Chỉ cập nhật ảnh 2
                    }));
                  }}
                />
              </Card>

              {/* Upload Image 3 */}
              <Card
                sx={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  height: "160px",
                  width: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed gray", // Màu viền cho khu vực upload
                }}
                onClick={() => document.getElementById("imgInput3").click()} // Mở file input khi click vào Card
              >
                {formData.img[2] ? (
                  <img
                    src={
                      typeof formData.img[2] === "string"
                        ? formData.img[2]
                        : URL.createObjectURL(formData.img[2])
                    }
                    alt="Image 3"
                    style={{
                      maxHeight: "160px",
                      maxWidth: "160px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography variant="body2">
                    Click to upload image 3
                  </Typography>
                )}
                <input
                  id="imgInput3"
                  type="file"
                  hidden
                  name="img3"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setFormData((prevData) => ({
                      ...prevData,
                      img: [prevData.img[0], prevData.img[1], file], // Chỉ cập nhật ảnh 3
                    }));
                  }}
                />
              </Card>
            </Box>
          </Box>
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
              />
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
