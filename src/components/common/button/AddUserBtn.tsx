import { Box, Button } from "@mui/material";
import Strings from "../../../core/utils/Strings";
export const AddUserBtn = (props: any) => {
  const flag = props.loading;

  return (
    <Box width={props.buttonWidth}>
      <Button
        // variant="contained"
        // className="PrimaryBtn"
        {...props}
        sx={{
          width: "100%",
          height: "50px",
          borderRadius: "50px",      
          fontSize: "16px",
          fontFamily: "Montserrat",
          fontWeight: "600",
          color: "#fff",
          background: "#4C7B29",
      
          "&:hover": {
            backgroundColor: "#4C7B29",
            color: "#fff",
          },
          "&:focus": {
            backgroundColor: "#4C7B29",
            color: "#fff",
          },
        }}
      >
        {flag ? (
          <>
            {`${Strings.PLEASE_WAIT}`}
          </>
        ) : (
          props.label
        )}
      </Button>
    </Box>
  );
};
