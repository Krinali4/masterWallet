import { Box, Button } from "@mui/material";
import loader from "../../../statics/images/loading.gif";
import Strings from "../../../core/utils/Strings";
export const PrimaryBtn = (props: any) => {
  const flag = props.loading;
  const waitButtonText = (props.loadingText) ? props.loadingText : Strings.PLEASE_WAIT
  const {disabled = false} = props

  return (
    <Box width={props.buttonWidth}>
      <Button
        variant="contained"
        className="PrimaryBtn"
        disabled={disabled}
        onClick={(e) => {props.onClick(e)}}
        sx={{
          fontSize: "16px",
          color: "#fff",
          textTransform: 'capitalize',
          fontWeight: 600,
          lineHeight: "20px",
          background: "#4C7B29",
          borderRadius: "50px",
          border: "none",
          height: "60px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          boxShadow: "none",
          '&:hover': {
            backgroundColor: '#4C7B29',
            color: '#fff',
            border: "none",
          },
          '&:focus': {
            backgroundColor: '#4C7B29',
            color: '#fff',
            border: "none",
          }
        }}
      >
        {flag ? (
          <>
            {`${waitButtonText}`}
            <img src={loader} className="buttonLoader" alt="Circle dot loader" />
          </>
        ) : (
          props.label
        )}
      </Button>
    </Box>
  );
};
