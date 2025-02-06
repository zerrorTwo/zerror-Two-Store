import { Box, TextField, Button, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import InputSets from "../../../components/InputSets";
import DynamicTable from "../../../components/ProductTab/DynamicTable";
import ButtonPrimary from "../../../components/ButtonPrimary";

function VariationTab({ formData, setFormData, onNext, onPre }) {
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [initialPricing, setInitialPricing] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryItems, setNewCategoryItems] = useState([""]);

  useEffect(() => {
    if (formData && formData.variations) {
      const variationsStr =
        typeof formData.variations === "object"
          ? JSON.stringify(formData.variations)
          : formData.variations;

      setFormData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(formData)) {
          return {
            ...formData,
            variations: variationsStr || "{}",
          };
        }
        return prevData;
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
    }
  }, [formData, setFormData]);

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
        price: matchingPricing ? matchingPricing.price : 0,
        stock: matchingPricing ? matchingPricing.stock : 0,
      };
    });

    setTableData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify(data)) {
        return data;
      }
      return prevData;
    });
  };

  const handleTableChange = (index, field, value) => {
    const formattedValue =
      field === "price" || field === "stock" ? value.replace(/,/g, "") : value;
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = formattedValue;
      return newData;
    });
  };

  const handleAddField = (setIndex) => {
    if (categories[setIndex].items.some((item) => item.trim() === "")) {
      toast.error("All items must have a value before adding a new field");
      return;
    }

    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      const updatedItems = [...newCategories[setIndex].items];
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
      toast.error("Category name and items cannot be empty");
      return;
    }

    const filteredItems = newCategoryItems.filter((item) => item.trim() !== "");
    const existingCategory = categories.some(
      (category) => category.label === newCategoryName
    );
    if (existingCategory) {
      toast.error("Category already exists");
      return;
    }

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
      return;
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

  const isFormValid = () => {
    return formData.mainImg && formData.img[0];
  };

  const handleNext = () => {
    const isTableDataValid = tableData.every(
      (row) => row.price !== "" && row.stock !== ""
    );

    if (isTableDataValid) {
      const newVariations = categories.reduce((acc, category) => {
        acc[category.label.toLowerCase()] = category.items;
        return acc;
      }, {});

      const pricing = tableData.map((item) => {
        const pricingItem = {};

        categories.forEach((category) => {
          const key = category.label.toLowerCase();
          pricingItem[key] = item[key] || "";
        });

        pricingItem.price = item.price;
        pricingItem.stock = item.stock;

        return pricingItem;
      });

      setFormData((prevData) => ({
        ...prevData,
        variations: JSON.stringify({
          ...newVariations,
          pricing,
        }),
      }));

      onNext();
    } else {
      toast.warning("Please fill in all the required fields in the table.");
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ flexGrow: 1 }}>
      <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
        <InputSets
          variations={categories}
          handleAddField={handleAddField}
          handleCategoryInputChange={handleCategoryInputChange}
          handleDeleteField={handleDeleteField}
          handleDeleteCategory={handleDeleteCategory}
        />

        <Box display={"flex"} gap={2}>
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
            label="New Variant Name"
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

        <Box display={"flex"} gap={2}>
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

        <Typography>Table</Typography>
        {tableData.length > 0 && (
          <DynamicTable
            categories={categories}
            tableData={tableData}
            handleTableChange={handleTableChange}
          />
        )}
      </Box>
      <Box
        pt={2}
        marginTop="auto"
        justifyContent={"flex-end"}
        display={"flex"}
        gap={2}
      >
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
          }}
          onClick={onPre}
        >
          Pre
        </Button>
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
          }}
          onClick={handleNext}
          disabled={!isFormValid()}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

VariationTab.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPre: PropTypes.func.isRequired,
};

export default VariationTab;
