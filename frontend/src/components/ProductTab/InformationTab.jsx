import PropTypes from "prop-types";
import {
  Box,
  Card,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import InputBase from "../InputBase";
import { PRIMITIVE_URL } from "../../redux/constants";

const InformationTab = ({
  formData,
  handleInputChange,
  handleFileChange,
  listCate,
}) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" gap={4} alignItems="center">
        <InputBase
          required={true}
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Box display="flex" alignItems="center">
          <TextField
            sx={{
              width: 300,
              mt: 0,
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
              },
            }}
            select
            fullWidth={false}
            margin="normal"
            name="type"
            label="Type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <MenuItem value="">
              <em>Chose your category</em>
            </MenuItem>
            {listCate.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
      <InputBase
        id="description" // Unique id for the description field
        multiline
        margin="normal"
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <Box display="flex" gap={2} sx={{ mt: 2 }}>
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
            border: "2px dashed gray",
          }}
          onClick={() => document.getElementById("mainImgInput").click()}
        >
          {formData.mainImg ? (
            <img
              src={
                typeof formData.mainImg === "string"
                  ? `${PRIMITIVE_URL}${formData.mainImg}`
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
            border: "2px dashed gray",
          }}
          onClick={() => document.getElementById("imgInput1").click()}
        >
          {formData.img[0] ? (
            <img
              src={
                typeof formData.img[0] === "string"
                  ? `${PRIMITIVE_URL}${formData.img[0]}`
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
            border: "2px dashed gray",
          }}
          onClick={() => document.getElementById("imgInput2").click()}
        >
          {formData.img[1] ? (
            <img
              src={
                typeof formData.img[1] === "string"
                  ? `${PRIMITIVE_URL}${formData.img[1]}`
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
            border: "2px dashed gray",
          }}
          onClick={() => document.getElementById("imgInput3").click()}
        >
          {formData.img[2] ? (
            <img
              src={
                typeof formData.img[2] === "string"
                  ? `${PRIMITIVE_URL}${formData.img[2]}`
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
  listCate: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default InformationTab;
