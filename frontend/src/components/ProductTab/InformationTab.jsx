import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import InputBase from "../InputBase";

const InformationTab = ({ formData, handleInputChange, handleFileChange }) => {
  return (
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
            <Typography variant="body2">Click to upload main image</Typography>
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
            <Typography variant="body2">Click to upload image 1</Typography>
          )}
          <input
            id="imgInput1"
            type="file"
            hidden
            name="img1"
            onChange={handleFileChange}
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
            <Typography variant="body2">Click to upload image 2</Typography>
          )}
          <input
            id="imgInput2"
            type="file"
            hidden
            name="img2"
            onChange={handleFileChange}
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
            <Typography variant="body2">Click to upload image 3</Typography>
          )}
          <input
            id="imgInput3"
            type="file"
            hidden
            name="img3"
            onChange={handleFileChange}
          />
        </Card>
      </Box>
    </Box>
  );
};

InformationTab.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default InformationTab;
