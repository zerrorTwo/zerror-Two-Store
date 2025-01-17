import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import GenericTable from "../../components/GenericTable";
import {
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useGetChildrenCategoryQuery,
  useGetAllCategoriesParentQuery,
  useCreateNewCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categorySlice";
import FormBase from "../../components/FormBase";
import PopoverPaper from "../../components/PopoverPaper";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { PRIMITIVE_URL } from "../../redux/constants";
import { Link, useSearchParams } from "react-router";

function CateDashBoard() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const parent = searchParams.get("parent"); // Lấy giá trị từ query string

  const headCells = [
    // { id: "_id", numeric: true, disablePadding: false, label: "ID" },
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "img",
      numeric: false,
      disablePadding: false,
      label: "Image",
      img: true,
    },
  ];

  // Fetch top-level categories
  const {
    data: listCate = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoriesParentQuery();

  const [createNew, { isLoading: isLoadingCreateNew }] =
    useCreateNewCategoryMutation();
  const [update, { isLoading: isLoadingUpdate }] = useUpdateCategoryMutation();
  const [deleteAll, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();

  // State
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // Trạng thái "Create"
  const [selected, setSelected] = useState([]); // Selected categories
  const [anchorEl, setAnchorEl] = useState(null); // Popover anchor
  const [imagePreview, setImagePreview] = useState(null); // Image preview
  const [selectedImage, setSelectedImage] = useState(null); // Selected image
  const [parentId, setParentId] = useState(null); // Parent category ID
  const [rows, setRows] = useState([]); // Rows for table
  const [isLoadingBack, setIsLoadingBack] = useState(false);

  const formRef = useRef(null);

  const [categoryHistory, setCategoryHistory] = useState([]);

  const { refetch: fetchChildren } = useGetChildrenCategoryQuery(parentId, {
    skip: !parentId,
  });

  useEffect(() => {
    if (parentId) {
      fetchChildren()
        .then((result) => {
          setRows(result.data); // Cập nhật danh sách con
        })
        .catch((error) => {
          toast.error("Failed to load children categories", error);
        });
    } else if (listCate.length > 0) {
      setRows(listCate); // Hiển thị danh sách cha khi không có parent
    }
  }, [parentId, fetchChildren, listCate]);

  useEffect(() => {
    setRows(
      listCate?.map((category) => ({
        _id: category._id,
        name: category.name,
        img: category.img,
      }))
    );
  }, [listCate]);

  const handleMoreClick = (row) => {
    setCategoryHistory((prevHistory) => [...prevHistory, parentId]); // Lưu lại danh mục cha hiện tại
    setParentId(row._id); // Thay đổi parent, useEffect sẽ xử lý việc gọi API
  };

  const handleCloseDialog = () => {
    setAnchorEl(null);
    setSelectedRow(null);
    setIsCreating(false);
  };

  const handleUpdateClick = (event, row) => {
    event.stopPropagation();
    setIsCreating(false);
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
  };

  const handleCreateClick = (event) => {
    event.stopPropagation();
    const firstRow = {
      _id: "",
      name: "",
      img: "",
    };
    setSelectedRow(firstRow);
    setIsCreating(true);
    setAnchorEl(event.currentTarget);
  };

  const handleBackClick = async () => {
    setIsLoadingBack(true);
    const lastParent = categoryHistory.pop();
    setParentId(lastParent);
    setCategoryHistory([...categoryHistory]);

    try {
      await fetchChildren();
    } catch (error) {
      toast.info("Here are the first list!!!!", error);
    } finally {
      setIsLoadingBack(false);
    }
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

  const handleFormChange = (field, value) => {
    setSelectedRow((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      if (!formData.name || !formData.img) {
        toast.error("Category name is required");
        return;
      }
      formData.parent = parent;
      formData.level = categoryHistory?.length + 1;

      const newCate = await createNew(formData);

      if (newCate?.error) {
        toast.error(newCate?.error?.data?.message);
        return;
      }

      if (newCate) {
        toast.success("Category created successfully");
        setImagePreview(null);
        handleCloseDialog();
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = formRef.current.getFormData();
      let imageUrl = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadResult = await uploadCategoryImage(formData);
        imageUrl = uploadResult.image;
      }
      formData.img = imageUrl || selectedRow?.img;

      if (!formData.name || !formData.img) {
        toast.error("Category name is required");
        return;
      }

      const updatedCate = await update({ id: selectedRow._id, body: formData });
      if (updatedCate?.error) {
        toast.error(updatedCate?.error?.data?.message);
        return;
      }
      if (updatedCate) {
        toast.success("Category updated successfully");
        handleCloseDialog();
      } else {
        toast.error("Failed to update category");
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

      <Button>
        <Link to={`/layout/cate/?parent=${parentId}`}>asdfghjk</Link>
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 1,
        }}
      >
        <Button
          sx={{
            maxWidth: 150,
            minWidth: 150,
            opacity: categoryHistory.length > 0 ? 1 : 0,
            pointerEvents: categoryHistory.length > 0 ? "auto" : "none",
            color: theme.palette.text.secondary,
          }}
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          onClick={handleBackClick} // Quay lại danh mục cha trước đó
        >
          {isLoadingBack ? "Loading..." : "BACK"}
        </Button>
      </Box>

      <Box>
        <Box>
          {categoryLoading ? (
            <CircularProgress />
          ) : (
            <GenericTable
              name="List Category"
              create={true}
              rows={rows}
              headCells={headCells}
              handleUpdateClick={handleUpdateClick}
              handleCreateClick={handleCreateClick}
              handleMoreClick={
                categoryHistory.length >= 2 ? undefined : handleMoreClick
              }
              selected={selected}
              setSelected={setSelected}
              onDeleteConfirm={handleDeleteConfirm}
              isDeleteLoading={isDeleteLoading}
            />
          )}
        </Box>
        <PopoverPaper
          item={selectedRow}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          handleClose={handleCloseDialog}
          handleCreate={isCreating ? handleSubmitCreate : undefined}
          handleUpdate={!isCreating ? handleUpdateSubmit : undefined}
          isLoadingDelete={isDeleteLoading}
          isLoading={isLoadingCreateNew}
          isLoadingUpdate={isLoadingUpdate}
          updateBtn={!isCreating}
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
              {imagePreview || selectedRow?.img ? (
                <img
                  src={
                    imagePreview
                      ? imagePreview
                      : `${PRIMITIVE_URL}${selectedRow?.img}`
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
  );
}

export default CateDashBoard;
