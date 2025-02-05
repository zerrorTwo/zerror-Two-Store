import { Card, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { PRIMITIVE_URL } from "../../../redux/constants";
import { useState } from "react";
function ImageTab() {
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

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    setFormData((prevData) => {
      if (name === "mainImg") {
        return {
          ...prevData,
          mainImg: files[0],
        };
      } else {
        const imgIndex = parseInt(name.replace("img", "")) - 1;
        const newImgArray = [...prevData.img];
        newImgArray[imgIndex] = files[0];
        return {
          ...prevData,
          img: newImgArray,
        };
      }
    });
  };
  return (
    <Box display="flex" gap={2} sx={{ mt: 2, flexWrap: "wrap" }}>
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
  );
}

export default ImageTab;
