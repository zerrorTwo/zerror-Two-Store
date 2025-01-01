// import { useState, useEffect } from "react";
// import {
//   Box,
//   Divider,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Typography,
//   useTheme,
//   Popover,
//   Button,
//   TextField,
//   Checkbox,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
// import TreeSelect from "./TreeList";
// import CustomSelect from "../../components/CustomSelect";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { selectOptions } from "../../constants/type.js";
// import ClearIcon from "@mui/icons-material/Clear";
// import ButtonPrimary from "../../components/ButtonPrimary";
// import {
//   useCreateNewMutation,
//   useDeleteCategoryMutation,
//   useUpdateCategoryMutation,
// } from "../../redux/api/categorySlice";
// import { toast } from "react-toastify";
// import ConfirmDialog from "../../components/ConfirmDialog"; // Import ConfirmDialog

// function CateDashboard() {
//   const theme = useTheme();
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [radioValue, setRadioValue] = useState("new");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [name, setName] = useState("");
//   const [confirmOpen, setConfirmOpen] = useState(false); // State for ConfirmDialog

//   const [formFields, setFormFields] = useState([
//     {
//       attribute: "",
//       type: "",
//       required: true,
//     },
//   ]);

//   useEffect(() => {
//     if (selectedCategory) {
//       setName(selectedCategory.name || "");
//       setFormFields(
//         selectedCategory.attributes.map((attr) => ({
//           attribute: attr.name,
//           type: attr.type,
//           required: attr.required,
//           requiredFromCategory: attr.required, // Set this flag based on category data
//         }))
//       );
//     }
//   }, [selectedCategory]);

//   // Fetch API
//   const [createNew, { isLoading: isLoadingCreate }] = useCreateNewMutation();
//   const [update, { isLoading: isLoadingUpdate }] = useUpdateCategoryMutation();
//   const [deleteCategory, { isLoading: isLoadingDelete }] =
//     useDeleteCategoryMutation();

//   const handleRadioChange = (event) => {
//     const value = event.target.value;
//     setRadioValue(value);

//     if (value === "new") {
//       // Reset các thuộc tính và tên khi chọn New
//       setName("");
//       setFormFields([
//         {
//           attribute: "",
//           type: "",
//           required: true,
//         },
//       ]);
//       setSelectedCategory(null); // Bỏ chọn danh mục đã chọn
//     }
//   };

//   const handleButtonClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelectChange = (index, event) => {
//     const newFormFields = [...formFields];
//     newFormFields[index].type = event.target.value;
//     setFormFields(newFormFields);
//   };

//   const handleAddField = () => {
//     setFormFields([
//       ...formFields,
//       {
//         attribute: "",
//         type: "",
//         required: true,
//       },
//     ]);
//   };

//   const handleInputChange = (index, event) => {
//     const newFormFields = [...formFields];
//     newFormFields[index].attribute = event.target.value;
//     setFormFields(newFormFields);
//   };

//   const handleCheckboxChange = (index, event) => {
//     const newFormFields = [...formFields];
//     newFormFields[index].required = event.target.checked;
//     setFormFields(newFormFields);
//   };

//   const handleSave = async () => {
//     try {
//       if (!name) {
//         toast.error("Name is required");
//         return; // Nếu tên trống, dừng lại không thực hiện tiếp
//       }
//       const isValid = formFields.every((field) => field.type.trim() !== "");
//       if (!isValid) {
//         toast.error("All attributes must have a type.");
//         return; // Nếu có trường 'type' trống, dừng lại không thực hiện tiếp
//       }
//       let data = {
//         name,
//         attributes: formFields.map((field) => ({
//           name: field.attribute,
//           type: field.type,
//           required: field.required,
//         })),
//       };
//       // Thêm parentName vào object data chỉ khi có giá trị
//       if (selectedCategory) {
//         data.parentName = selectedCategory.name;
//       }

//       const newCate = await createNew(data).unwrap();
//       // console.log(newCate);

//       if (newCate) {
//         setName("");
//         setFormFields([{ attribute: "", type: "", required: true }]);
//         setAnchorEl(null);
//         toast.success("Category created successfully");
//       }
//     } catch (error) {
//       toast.error(error.data?.message || "Fail to create new!!");
//     }
//   };

//   const handleUpdate = async () => {
//     if (!name) {
//       toast.error("Name is required");
//       return; // Nếu tên trống, dừng lại không thực hiện tiếp
//     }
//     try {
//       const isValid = formFields.every((field) => field.type.trim() !== "");
//       if (!isValid) {
//         toast.error("All attributes must have a type.");
//         return;
//       }

//       let data = {
//         name,
//         attributes: formFields.map((field) => ({
//           name: field.attribute,
//           type: field.type,
//           required: field.required,
//         })),
//       };

//       if (selectedCategory) {
//         data.parentName = selectedCategory.name;
//       }

//       const updateCate = await update({
//         id: selectedCategory._id,
//         data,
//       }).unwrap();

//       if (updateCate) {
//         toast.success("Category updated successfully");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.data?.message || "Fail to update!!");
//     }
//   };

//   const handleDelete = async () => {
//     if (!name) {
//       toast.error("Name is required");
//       return; // Nếu tên trống, dừng lại không thực hiện tiếp
//     }
//     try {
//       const deleletd = await deleteCategory(selectedCategory._id);

//       if (deleletd) {
//         setName("");
//         setFormFields([{ attribute: "", type: "", required: true }]);
//         setAnchorEl(null);
//         setSelectedCategory(null);
//         toast.success("Category delete successfully");
//         setConfirmOpen(false);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.data?.message || "Fail to delete!!");
//     }
//   };

//   const handleRemoveField = (index) => {
//     const newFormFields = formFields.filter((_, i) => i !== index);
//     setFormFields(newFormFields);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   return (
//     <Box sx={{ flexGrow: 1, my: 3, mx: 1 }}>
//       <Box>
//         <Typography variant="h4" sx={{ color: theme.palette.text.secondary }}>
//           Category Dashboard
//         </Typography>
//       </Box>
//       <Box
//         sx={{
//           width: "100%",
//           py: 3,
//           height: "100%",
//           display: "grid",
//           justifyContent: "center",
//         }}
//       >
//         <Typography
//           variant="h6"
//           sx={{
//             alignItems: "center",
//             display: "flex",
//             gap: 1,
//             margin: "0 auto",
//           }}
//         >
//           <SentimentSatisfiedAltIcon />
//           Create new or select one to create category
//         </Typography>
//         <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//           <RadioGroup
//             row
//             aria-labelledby="demo-row-radio-buttons-group-label"
//             name="row-radio-buttons-group"
//             value={radioValue}
//             onChange={handleRadioChange}
//           >
//             <FormControlLabel
//               value="new"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       color: "white",
//                     },
//                   }}
//                 />
//               }
//               label="New"
//             />
//             <FormControlLabel
//               value="available"
//               control={
//                 <Radio
//                   sx={{
//                     "& .MuiSvgIcon-root": {
//                       color: "white",
//                     },
//                   }}
//                 />
//               }
//               label="Available"
//             />
//           </RadioGroup>
//         </Box>
//         {radioValue === "available" && (
//           <>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <Button
//                 sx={{ width: "200px" }}
//                 aria-describedby={id}
//                 variant="contained"
//                 onClick={handleButtonClick}
//               >
//                 Select Category
//               </Button>
//               {selectedCategory && (
//                 <Typography
//                   variant="h6"
//                   sx={{ color: theme.palette.button.error }}
//                 >
//                   Selected Category: {selectedCategory.name}
//                 </Typography>
//               )}
//             </Box>

//             <Popover
//               id={id}
//               open={open}
//               anchorEl={anchorEl}
//               onClose={handlePopoverClose}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "left",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "left",
//               }}
//             >
//               <Box
//                 sx={{
//                   p: 2,
//                   width: "80vw",
//                   bgcolor: theme.palette.background.default,
//                   maxHeight: "300px", // Set maximum height
//                   overflowY: "auto", // Enable vertical scroll if content overflows
//                 }}
//               >
//                 <TreeSelect
//                   selectedCategory={selectedCategory}
//                   setSelectedCategory={setSelectedCategory}
//                 />
//               </Box>
//             </Popover>
//           </>
//         )}
//         <Divider
//           sx={{ bgcolor: theme.palette.text.primary, width: "80vw", mt: 2 }}
//         />
//         <Box sx={{ mt: 2 }}>
//           <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
//             <Typography
//               variant="body1"
//               sx={{ color: theme.palette.text.primary }}
//             >
//               Name
//             </Typography>
//             <TextField
//               variant="standard"
//               required
//               autoFocus={true}
//               value={name || ""}
//               onChange={(e) => setName(e.target.value)}
//               sx={{
//                 "& .MuiInputBase-input": {
//                   WebkitTextFillColor: theme.palette.text.secondary,
//                 },
//                 "& .MuiInput-underline:after": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//                 "& .MuiInput-underline:before": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//                 "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//               }}
//             />
//           </Box>

//           <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
//             <Typography
//               variant="body1"
//               sx={{ color: theme.palette.text.primary }}
//             >
//               Parent
//             </Typography>
//             <TextField
//               disabled
//               variant="standard"
//               required
//               value={selectedCategory?.name || ""}
//               sx={{
//                 "& .MuiInputBase-input": {
//                   WebkitTextFillColor: theme.palette.text.primary,
//                 },
//                 "& .MuiInput-underline:after": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//                 "& .MuiInput-underline:before": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//                 "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
//                   borderBottomColor: theme.palette.text.secondary,
//                 },
//               }}
//             />
//           </Box>

//           {formFields.map((field, index) => (
//             <Box key={index} display={"flex"} gap={10} alignItems={"center"}>
//               <Box display={"flex"} alignItems={"center"} gap={2} py={2}>
//                 <Typography
//                   variant="body1"
//                   sx={{ color: theme.palette.text.primary }}
//                 >
//                   Attribute
//                 </Typography>
//                 <TextField
//                   value={field.attribute || ""}
//                   onChange={(event) => handleInputChange(index, event)}
//                   variant="standard"
//                   required
//                   sx={{
//                     "& .MuiInputBase-input": {
//                       WebkitTextFillColor: theme.palette.text.secondary,
//                     },
//                     "& .MuiInput-underline:after": {
//                       borderBottomColor: theme.palette.text.secondary,
//                     },
//                     "& .MuiInput-underline:before": {
//                       borderBottomColor: theme.palette.text.secondary,
//                     },
//                     "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
//                       borderBottomColor: theme.palette.text.secondary,
//                     },
//                   }}
//                 />
//               </Box>
//               <CustomSelect
//                 label="Type"
//                 options={selectOptions}
//                 value={field.type || ""}
//                 onChange={(event) => handleSelectChange(index, event)}
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={field.required}
//                     onChange={(event) => handleCheckboxChange(index, event)}
//                     disabled={field.requiredFromCategory}
//                     sx={{
//                       color: "green",
//                       "&.Mui-checked": {
//                         color: "green",
//                       },
//                     }}
//                   />
//                 }
//                 label="Required"
//                 sx={{
//                   "& .MuiTypography-root": {
//                     color: `${theme.palette.text.primary} !important`,
//                   },
//                 }}
//               />
//               <IconButton onClick={() => handleRemoveField(index)}>
//                 <Tooltip title="Remove attribute">
//                   <ClearIcon sx={{ color: theme.palette.error.main }} />
//                 </Tooltip>
//               </IconButton>
//             </Box>
//           ))}

//           <IconButton sx={{ mb: 2 }} onClick={handleAddField}>
//             <Tooltip title="More attribute">
//               <AddCircleIcon sx={{ color: theme.palette.text.secondary }} />
//             </Tooltip>
//           </IconButton>
//         </Box>
//         <Box display={"flex"} gap={2} justifyContent={"center"} mb={5}>
//           <ButtonPrimary
//             text="New"
//             onClick={handleSave}
//             isLoading={isLoadingCreate}
//           />
//           <ButtonPrimary
//             text="Update"
//             onClick={handleUpdate}
//             isLoading={isLoadingUpdate}
//           />
//           <ButtonPrimary
//             text="Delete"
//             onClick={() => setConfirmOpen(true)} // Open ConfirmDialog on delete
//             isLoading={isLoadingDelete}
//           />
//         </Box>
//       </Box>
//       <ConfirmDialog
//         open={confirmOpen}
//         onClose={() => setConfirmOpen(false)}
//         onConfirm={handleDelete}
//         itemCount={selectedCategory ? 1 : 0}
//       />
//     </Box>
//   );
// }

// export default CateDashboard;
