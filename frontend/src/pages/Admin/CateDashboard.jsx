import { Box, Card, Divider, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GenericTable from "../../components/GenericTable";
import {
  useCreateNewMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useGetChildrenCategoryQuery,
  useGetAllCategoriesParentQuery, // API lấy danh mục cha
} from "../../redux/api/categorySlice";
import FormBase from "../../components/FormBase";
import PopoverPaper from "../../components/PopoverPaper";

function CateDashBoard() {
  const theme = useTheme();

  // Fetch top-level categories
  const {
    data: listCate = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoriesParentQuery();

  const [createNew, { isLoading: isLoadingCreateNew }] = useCreateNewMutation();
  const [deleteAll, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();

  // State
  const [selectedRow, setSelectedRow] = useState(null);
  const [selected, setSelected] = useState([]); // Selected categories
  const [anchorEl, setAnchorEl] = useState(null); // Popover anchor
  const [imagePreview, setImagePreview] = useState(null); // Image preview
  const [selectedImage, setSelectedImage] = useState(null); // Selected image
  const [parent, setParent] = useState(null); // Parent category ID
  const [rows, setRows] = useState([]); // Rows for table
  const formRef = useRef(null);

  // Fetch children categories
  const { refetch: fetchChildren } = useGetChildrenCategoryQuery(parent, {
    skip: !parent, // Không gọi API nếu không có parent
  });

  // Lắng nghe thay đổi của parent để gọi API lấy danh mục con
  useEffect(() => {
    if (parent) {
      fetchChildren()
        .then((result) => {
          setRows(result.data); // Cập nhật danh sách con
          toast.success("Children categories loaded successfully");
        })
        .catch((error) => {
          toast.error("Failed to load children categories", error);
        });
    }
  }, [parent, fetchChildren]);

  console.log(parent);

  // Event handlers
  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDialog = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateClick = (event) => {
    event.stopPropagation();
    const firstRow = {
      _id: "",
      name: "",
      img: "",
    };
    setSelectedRow(firstRow);
    setAnchorEl(event.currentTarget);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteAll(selected).unwrap();
      toast.success("Category deleted successfully");
      setSelected([]);
    } catch (error) {
      toast.error("Failed to delete category", error);
    }
  };

  const handleReview = (row) => {
    setParent(row._id); // Thay đổi parent, useEffect sẽ xử lý việc gọi API
  };

  // Define table columns
  const headCells = [
    { id: "_id", numeric: true, disablePadding: false, label: "ID" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "img",
      numeric: false,
      disablePadding: false,
      label: "Image",
      img: true,
    },
  ];

  // Process rows for table
  useEffect(() => {
    if (listCate.length > 0) {
      setRows(
        listCate.map((category) => ({
          _id: category._id,
          name: category.name,
          img: category.img,
        }))
      );
    }
  }, [listCate]);

  // Form change handler
  const handleFormChange = (field, value) => {
    setSelectedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitCreate = async () => {
    try {
      const formData = formRef.current.getFormData();
      let imageUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadResult = await uploadCategoryImage(formData).unwrap();

        imageUrl = uploadResult.image;
      }
      formData.img = imageUrl;
      formData.parent = parent;

      const newCate = await createNew(formData);
      if (newCate) {
        toast.success("Category created successfully");
        handleCloseDialog();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  if (categoryLoading) return <div>Loading...</div>;
  if (categoryError) return <div>Error loading categories</div>;

  return (
    <Box sx={{ border: "1px solid #555", borderRadius: 1, p: 2 }}>
      <Box display={"flex"} justifyContent={"start"}>
        <Box display={"grid"}>
          <Typography variant="h5">Manager Category</Typography>
          <Divider
            sx={{
              width: "100%",
              bgcolor: theme.palette.button.backgroundColor,
            }}
          />
        </Box>
      </Box>

      <Box mt={5}>
        <Box>
          <GenericTable
            name="List Category"
            create={true}
            rows={rows}
            headCells={headCells}
            handleUpdateClick={handleUpdateClick}
            handleCreateClick={handleCreateClick}
            handleReview={handleReview}
            selected={selected}
            setSelected={setSelected}
            onDeleteConfirm={handleDeleteConfirm}
            isDeleteLoading={false}
          />
          <PopoverPaper
            item={selectedRow}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            handleClose={handleCloseDialog}
            handleCreate={handleSubmitCreate}
            isLoadingDelete={isDeleteLoading}
            isLoading={isLoadingCreateNew}
          >
            <Box sx={{ m: "0 auto", display: "table", mt: 2 }}>
              <Card
                sx={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  height: "160px",
                  width: "160px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "2px dashed gray",
                }}
                onClick={() => document.getElementById("mainImgInput").click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
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
                  onChange={handleImageChange}
                />
              </Card>
            </Box>
            <FormBase
              ref={formRef}
              item={selectedRow || { _id: "", name: "" }}
              onChange={handleFormChange}
            />
          </PopoverPaper>
        </Box>
      </Box>
    </Box>
  );
}

export default CateDashBoard;
