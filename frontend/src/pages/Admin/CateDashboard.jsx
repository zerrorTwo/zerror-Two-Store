import {
  Box,
  Breadcrumbs,
  Card,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState, memo } from "react"; // Import React.memo
import { toast } from "react-toastify";
import GenericTable from "../../components/GenericTable";
import {
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
  useCreateNewCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../redux/api/categorySlice";
import FormBase from "../../components/FormBase";
import PopoverPaper from "../../components/PopoverPaper";
import { PRIMITIVE_URL } from "../../redux/constants";
import { useNavigate, useSearchParams } from "react-router";
import { isEqual } from "lodash";

// Wrap GenericTable and PopoverPaper with memo
const MemoizedGenericTable = memo(GenericTable);
const MemoizedPopoverPaper = memo(PopoverPaper);

function CateDashBoard() {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const parent = searchParams.get("parent") || null;

  const navigate = useNavigate();

  const headCells = [
    { id: "name", numeric: false, disablePadding: false, label: "Name" },
    {
      id: "img",
      numeric: false,
      disablePadding: false,
      label: "Image",
      img: true,
    },
  ];
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: { categories: listCate = [], totalPages } = {},
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoriesQuery({ parent, page, limit: rowsPerPage });

  const [createNew, { isLoading: isLoadingCreateNew }] =
    useCreateNewCategoryMutation();
  const [update, { isLoading: isLoadingUpdate }] = useUpdateCategoryMutation();
  const [deleteAll, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();

  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [parentId, setParentId] = useState(null);
  const [rows, setRows] = useState([]);
  const [lvl, setLvl] = useState(1);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const formRef = useRef(null);

  const prevListCate = useRef(listCate);

  // Gộp các useEffect liên quan đến listCate và rows
  useEffect(() => {
    setSelected([]);
    const savedBreadcrumbItems = localStorage.getItem("breadcrumbItems");

    if (savedBreadcrumbItems && !breadcrumbItems.length) {
      setBreadcrumbItems(JSON.parse(savedBreadcrumbItems));
    }

    if (!isEqual(listCate, prevListCate.current)) {
      if (categoryLoading) {
        setRows([]);
      } else if (listCate) {
        const newRows = listCate?.map((category) => ({
          _id: category._id,
          name: category.name,
          img: category.img,
          level: category?.level,
        }));
        setRows(newRows);
        setLvl(listCate[0]?.level || 1);
        prevListCate.current = listCate;
      }
    }
  }, [listCate, categoryLoading, breadcrumbItems.length]);

  // Chỉ lưu breadcrumbItems khi có thay đổi và có dữ liệu
  useEffect(() => {
    if (breadcrumbItems.length > 0) {
      localStorage.setItem("breadcrumbItems", JSON.stringify(breadcrumbItems));
    }
  }, [breadcrumbItems]);

  // Xóa useEffect trùng lặp này
  // useEffect(() => {
  //   if (categoryLoading) {
  //     setRows([]);
  //   }
  //   if (listCate) {
  //     setRows(
  //       listCate?.map((category) => ({
  //         _id: category._id,
  //         name: category.name,
  //         img: category.img,
  //         level: category?.level,
  //       }))
  //     );
  //   }
  // }, [listCate, categoryLoading]);
  useEffect(() => {
    if (breadcrumbItems.length > 0) {
      localStorage.setItem("breadcrumbItems", JSON.stringify(breadcrumbItems));
    }
  }, [breadcrumbItems]);

  const handleMoreClick = (row) => {
    setRows([]);
    setSelected([]);
    setPage(1);
    setParentId(row._id);
    setBreadcrumbItems((prev) => {
      if (!prev.some((item) => item.id === row._id)) {
        return [...prev, { name: row.name, id: row._id }];
      }
      return prev;
    });
    navigate(`/admin/cate?parent=${row._id}`);
  };

  useEffect(() => {
    if (categoryLoading) {
      setRows([]);
    }
    if (listCate) {
      setRows(
        listCate?.map((category) => ({
          _id: category._id,
          name: category.name,
          img: category.img,
          level: category?.level,
        }))
      );
    }
  }, [listCate, categoryLoading]);

  const handleBreadcrumbClick = (id, index) => {
    setBreadcrumbItems((prev) => prev.slice(0, index + 1));
    setParentId(id);
    navigate(`/admin/cate?parent=${id}`);
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
      if (selectedImage) {
        const formDataWithImage = new FormData();
        formDataWithImage.append("image", selectedImage);
        const uploadResult = await uploadCategoryImage(
          formDataWithImage
        ).unwrap();
        formData.img = uploadResult.image;
      }

      if (!formData.name || !formData.img) {
        toast.error("Category name is required");
        return;
      }

      formData.parent = parentId;
      formData.level = lvl;

      const newCate = await createNew(formData);
      if (newCate?.error) {
        toast.error(newCate?.error?.data?.message);
        return;
      }

      toast.success("Category created successfully");
      formData.img = null;
      setImagePreview(null);
      handleCloseDialog();
    } catch (error) {
      toast.error("Error creating category: " + error.message);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = formRef.current.getFormData();
      if (selectedImage) {
        const formDataWithImage = new FormData();
        formDataWithImage.append("image", selectedImage);
        const uploadResult = await uploadCategoryImage(formDataWithImage);
        formData.img = uploadResult.image;
      }

      formData.img = formData.img || selectedRow?.img;

      if (!formData.name || !formData.img) {
        toast.error("Category name is required");
        return;
      }

      const updatedCate = await update({ id: selectedRow._id, body: formData });
      if (updatedCate?.error) {
        toast.error(updatedCate?.error?.data?.message);
        return;
      }
      toast.success("Category updated successfully");
      handleCloseDialog();
    } catch (error) {
      toast.error("Error updating category: " + error.message);
    }
  };

  const handleBreadcrumbReset = () => {
    setBreadcrumbItems([]);
    setParentId(null);
    localStorage.removeItem("breadcrumbItems"); // Xóa breadcrumbs khỏi localStorage
    navigate("/admin/cate");
  };

  if (categoryLoading) return <div>Loading...</div>;
  if (categoryError) return <div>Error loading categories</div>;

  return (
    <>
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

      <Box my={1}>
        <Breadcrumbs>
          <Typography
            onClick={handleBreadcrumbReset}
            sx={{
              cursor: "pointer",
              fontStyle: "italic",
              textDecoration: "underline",
              color: theme.palette.text.primary,
            }}
          >
            All Category
          </Typography>
          {breadcrumbItems.map((item, index) => (
            <Typography
              key={item.id}
              onClick={() => handleBreadcrumbClick(item.id, index)}
              sx={{
                cursor: "pointer",
                fontStyle: "italic",
                textDecoration: "underline",
                color: theme.palette.text.primary,
              }}
            >
              {item.name}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>

      <Box>
        <Box>
          {categoryLoading ? (
            <CircularProgress />
          ) : (
            <MemoizedGenericTable
              name="List Category"
              create={true}
              rows={rows}
              headCells={headCells}
              handleUpdateClick={handleUpdateClick}
              handleCreateClick={handleCreateClick}
              handleMoreClick={lvl <= 2 ? handleMoreClick : undefined}
              selected={selected}
              setSelected={setSelected}
              onDeleteConfirm={handleDeleteConfirm}
              isDeleteLoading={isDeleteLoading}
              page={page - 1}
              rowsPerPage={rowsPerPage}
              totalPages={totalPages}
              onPageChange={(_, newPage) => setPage(newPage + 1)} // Chuyển đổi từ 0-based sang 1-based
              onRowsPerPageChange={(event) => {
                setPage(1);
                setRowsPerPage(parseInt(event.target.value, 10));
              }}
            />
          )}
        </Box>

        <MemoizedPopoverPaper
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
                  loading="lazy"
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
        </MemoizedPopoverPaper>
      </Box>
    </>
  );
}

export default CateDashBoard;
