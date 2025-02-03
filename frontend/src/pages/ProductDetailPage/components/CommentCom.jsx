import { Box, Divider, Pagination, Typography } from "@mui/material";
import Comment from "../../../components/Comment";

function CommentCom() {
  return (
    <Box
      my={2}
      px={2}
      py={2}
      boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
    >
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="h6" fontWeight={400}>
          Product comments
        </Typography>
        <>
          <Comment />
          <Divider />
          <Comment />
          <Divider />
          <Comment />
          <Divider />
          <Comment />
          <Divider />
          <Comment />
          <Pagination
            color="secondary"
            sx={{ margin: "0 auto", marginTop: 5 }}
            count={10}
            variant="outlined"
            shape="rounded"
          />
        </>
      </Box>
    </Box>
  );
}

export default CommentCom;
