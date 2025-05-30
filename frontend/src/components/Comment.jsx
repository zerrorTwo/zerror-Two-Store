import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

function Comment({ avatar, userName, date, rating, comment, variations }) {
  // Format ngày giờ
  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Box display={"flex"} gap={2}>
      <Box>
        <Avatar alt={userName} src={avatar || "/static/images/avatar/1.jpg"} />
      </Box>
      <Box mb={2}>
        <Typography variant="body2" fontWeight="bold">
          {userName}
        </Typography>
        <Typography variant="body2">{formattedDate}</Typography>
        <Rating size="small" name="read-only" value={rating || 0} readOnly />
        {variations && (
          <Typography variant="body2" color="textSecondary">
            Variation: {variations}
          </Typography>
        )}
        <pre
          style={{
            fontFamily: "'Roboto', 'Arial', sans-serif",
            fontSize: "20px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            margin: "0px",
          }}
        >
          {comment || "No comment provided."}
        </pre>
      </Box>
    </Box>
  );
}

Comment.propTypes = {
  avatar: PropTypes.string,
  userName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  variations: PropTypes.string,
};

export default Comment;
