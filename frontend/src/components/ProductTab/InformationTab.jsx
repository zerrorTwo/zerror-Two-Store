import PropTypes from "prop-types";
import { Box } from "@mui/material/Box";
import { Card } from "@mui/material/Card";
import { FormControl } from "@mui/material/FormControl";
import { FormControlLabel } from "@mui/material/FormControlLabel";
import { FormLabel } from "@mui/material/FormLabel";
import { Radio } from "@mui/material/Radio";
import { RadioGroup } from "@mui/material/RadioGroup";
import { Typography } from "@mui/material/Typography";
import InputBase from "../InputBase";
import { PRIMITIVE_URL } from "../../redux/constants";
import CategorySelect from "../CategorySelect";

const InformationTab = ({
  status,
  setStatus,
  listCate,
  formData,
  handleInputChange,
  handleFileChange,
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    setStatus(value === "true");
  };

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
        {/* <Box display="flex" alignItems="center">
          <FormControl sx={{ width: 300, mt: 0 }}>
            <InputLabel
              sx={{ color: theme.palette.text.blackColor }}
              id="type-select-label"
            >
              Type
            </InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              label="Type"
              sx={{
                "& .MuiInputBase-input": {
                  color: theme.palette.text.blackColor,
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.blackColor,
                },
              }}
            >
              <MenuItem value="">
                <em>Chose your category</em>
              </MenuItem>
              {listCate.map((category) => (
                <MenuItem key={category._id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box> */}
        <CategorySelect
          listCate={listCate}
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <FormControl>
          <FormLabel sx={{ color: "black !important" }}>Publish</FormLabel>
          <RadioGroup row value={status} onChange={handleChange}>
            <FormControlLabel
              value="true"
              control={
                <Radio
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                />
              }
              label="Active"
              sx={{ color: "black" }}
            />
            <FormControlLabel
              value="false"
              control={
                <Radio
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                />
              }
              label="Disable"
              sx={{ color: "black" }}
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box display="flex" gap={2} sx={{ mt: 2 }}>
        {/* Upload Main Image */}
        <Card
          sx={{
            maxHeight: "160px",
            textAlign: "center",
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
            textAlign: "center",
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
            textAlign: "center",
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
            textAlign: "center",
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
      <InputBase
        id="description" // Unique id for the description field
        multiline
        margin="normal"
        maxWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />
    </Box>
  );
};

InformationTab.propTypes = {
  formData: PropTypes.object.isRequired,
  status: PropTypes.bool.isRequired,
  setStatus: PropTypes.func.isRequired,
  listCate: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default InformationTab;
