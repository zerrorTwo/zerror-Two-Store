import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";

function Description({ description }) {
  return (
    <Box px={2} py={2} boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}>
      <Box>
        <Typography variant="h6" fontWeight={400}>
          Product descriptions
        </Typography>
        <>
          <div
            style={{
              fontFamily: "'Roboto', 'Arial', sans-serif",
              fontSize: "14px",
              whiteSpace: "normal",
              wordWrap: "break-word",
              margin: "0px",
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </>
      </Box>
    </Box>
  );
}

Description.propTypes = {
  description: PropTypes.string,
};

export default Description;
