import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
function PageHeading(props: any) {
  return (
    <Box
      display="flex"
      gap={props?.backArrow && "15px"}
      sx={{ cursor: "pointer" }}
      
    >
      {props?.backArrow && (
        <ArrowBackIcon sx={{ width: "24px", height: "35px" }} {...props} />
      )} 
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "30px",
            lineHeight: "37px",
            color: "#171B1E",
          }}
        >
          {props.heading}
        </Typography> 
    </Box>
  );
}
export default PageHeading;
