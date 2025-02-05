import { Box, TextField, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import InputSets from "../../../components/InputSets";
import DynamicTable from "../../../components/ProductTab/DynamicTable";
import ButtonPrimary from "../../../components/ButtonPrimary";

function VariationTab({ row = null }) {
  const theme = useTheme();
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
  const [tableData, setTableData] = useState([]);
  const [initialPricing, setInitialPricing] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState([""]);

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

      const variations = JSON.parse(variationsStr || "{}");

      const variationsEntries = Object.entries(variations);
      const filteredVariations = Object.fromEntries(
        variationsEntries.slice(0, -1)
      );

      const dynamicCategories = Object.keys(filteredVariations).map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        items: filteredVariations[key] || [],
      }));

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

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <InputSets
        categories={categories}
        handleAddField={handleAddField}
        handleCategoryInputChange={handleCategoryInputChange} // Pass the new handle function
        handleDeleteField={handleDeleteField} // Pass the delete function
        handleDeleteCategory={handleDeleteCategory} // Pass the delete category function
      />

      {/* New Category and Fields Inputs */}
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

        {/* New Fields */}
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

      {/* Action Buttons */}
      <Box display={"flex"} gap={2} my={2}>
        <Button
          sx={{
            color: "text.primary",
            borderColor: theme.palette.text.primary,
          }}
          variant="outlined"
          onClick={addNewItemField}
        >
          Add New Item
        </Button>
        <ButtonPrimary text="More variations" onClick={handleAddSet} />
      </Box>

      {/* Table */}
      <Typography>Table</Typography>
      {tableData.length > 0 && (
        <DynamicTable
          categories={categories}
          tableData={tableData}
          handleTableChange={handleTableChange}
        />
      )}
    </Box>
  );
}

VariationTab.propTypes = {
  row: PropTypes.object,
};

export default VariationTab;
