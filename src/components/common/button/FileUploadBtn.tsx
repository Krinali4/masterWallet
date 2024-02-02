import { Box, Button } from "@mui/material";
import { fileUpload } from "../../icon";
export const FileUploadBtn = (props: any) => {
  const flag = props.loading;

  return (
    <Box width={props.width}>
      <Button
       component="label"
        variant="contained"
        {...props}
        sx={{
          background: '#EEEEEE',
          border: '1px dashed #717579',
          borderRadius: '30px',
          height: '200px',
         width:"100%",
          "&:hover": {
            backgroundColor: "#fff",
            // color: "#fff",
          },
        }}
      >
      <img src={fileUpload} alt="File upload Img"/>
      <input hidden accept="image/*" multiple type="file" />
      </Button>
    </Box>
  );
};
