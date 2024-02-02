import { Typography,Box } from "@mui/material";

function Footer() {
  return (
    <Box padding="38px 0" textAlign="center" sx={{ background: "#F5F5F5",
    // position:"sticky",
    // bottom:"0",
    // zIndex:"99",
    }}>
      <Typography sx={{
        fontWeight: 500,
        fontSize: "16px",
        lineHeight: "20px",
        color: "#171B1E",
      }}>
        Fuse, Inc. | © 2023 All Rights Reserved
      </Typography>
    </Box>
  )
}
export default Footer;