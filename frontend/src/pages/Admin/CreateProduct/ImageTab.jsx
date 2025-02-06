import { Button, Card, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { PRIMITIVE_URL } from "../../../redux/constants";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

function ImageTab({ formData, setFormData, onNext, onPre }) {
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

  const isFormValid = () => {
    return formData.mainImg && formData.img[0];
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    } else {
      toast.warning("Please fill in all the required fields in the table.");
    }
  };

  return (
    <>
      <Box display="flex" flexDirection={"column"} gap={2}>
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
            {formData?.mainImg ? (
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
              <Typography variant="body2">
                Click to upload main image
              </Typography>
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
            {formData?.img[0] ? (
              <img
                src={
                  typeof formData?.img[0] === "string"
                    ? `${PRIMITIVE_URL}${formData?.img[0]}`
                    : URL.createObjectURL(formData?.img[0])
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
                    ? `${PRIMITIVE_URL}${formData?.img[1]}`
                    : URL.createObjectURL(formData?.img[1])
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
                  typeof formData?.img[2] === "string"
                    ? `${PRIMITIVE_URL}${formData?.img[2]}`
                    : URL.createObjectURL(formData?.img[2])
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
      <Box
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
          disabled={!isFormValid()} // Disable if form is not valid
        >
          Next
        </Button>
      </Box>
    </>
  );
}

ImageTab.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPre: PropTypes.func.isRequired,
};

export default ImageTab;
