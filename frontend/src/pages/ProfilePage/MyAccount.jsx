import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  setUser,
} from "../../redux/features/auth/authSlice";
import { useUpdateUserMutation } from "../../redux/api/userSlice";
import { useUploadImageMutation } from "../../redux/api/uploadSlice";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";

function MyAccount() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [uploadImage] = useUploadImageMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.avatar || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    number: user?.number || "",
    avatar: user?.avatar || "", // Thêm avatar vào formData
  });

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý upload ảnh
  const handleUploadImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await uploadImage({
        file: selectedImage,
        type: "avatar",
      }).unwrap();
      const imageUrl = uploadResult.viewLink; // Giả sử backend trả về viewLink
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      toast.success("Avatar uploaded successfully");
      setSelectedImage(null);
    } catch (error) {
      toast.error(
        "Error uploading avatar: " + (error.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser({
        id: user._id,
        ...formData,
      }).unwrap();

      // Cập nhật Redux store với thông tin user mới
      dispatch(setUser(updatedUser));

      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setImagePreview(updatedUser.avatar || null); // Cập nhật preview với avatar từ server
    } catch (error) {
      toast.error(
        error.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!"
      );
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setFormData({
      userName: user?.userName || "",
      email: user?.email || "",
      number: user?.number || "",
      avatar: user?.avatar || "",
    });
    setImagePreview(user?.avatar || null);
    setSelectedImage(null);
    setIsEditing(false);
  };

  return (
    <>
      <Card sx={{ bgcolor: "white" }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Box
              sx={{
                cursor: isEditing ? "pointer" : "default",
              }}
              onClick={() =>
                isEditing && document.getElementById("avatarInput").click()
              }
            >
              {imagePreview ? (
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "secondary.main",
                    fontSize: "2rem",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: "secondary.main",
                    fontSize: "2rem",
                  }}
                >
                  {user?.userName?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                disabled={!isEditing || isUploading}
              />
            </Box>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h5" component="h2">
                Thông tin tài khoản
              </Typography>
              <Typography color="text.secondary">
                Quản lý thông tin cá nhân của bạn
              </Typography>
            </Box>
          </Box>

          {isEditing && selectedImage && (
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handleUploadImage}
                disabled={isUploading}
                startIcon={isUploading ? <CircularProgress size={20} /> : null}
              >
                {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên người dùng"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  required
                  helperText="Tên người dùng phải từ 3-50 ký tự"
                  error={
                    formData.userName.length > 0 &&
                    (formData.userName.length < 3 ||
                      formData.userName.length > 50)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  required
                  helperText="Vui lòng nhập email hợp lệ"
                  error={
                    formData.email.length > 0 &&
                    !/^\S+@\S+\.\S+$/.test(formData.email)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  disabled={!isEditing || isLoading}
                  helperText="Vui lòng nhập số điện thoại 10 chữ số"
                  error={
                    formData.number.length > 0 &&
                    !/^\d{10}$/.test(formData.number)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  {!isEditing ? (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      sx={{ bgcolor: "secondary.main" }}
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={isLoading || isUploading}
                      >
                        Hủy
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        startIcon={<SaveIcon />}
                        sx={{ bgcolor: "secondary.main" }}
                        disabled={isLoading || isUploading}
                      >
                        {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export default MyAccount;
