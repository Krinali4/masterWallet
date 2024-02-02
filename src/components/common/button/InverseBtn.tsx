import { Box, Button } from "@mui/material";
export const InverseBtn = (props: any) => {
    return (
        <Box width={props.buttonWidth} display="flex" >
            <Button
                variant="contained"
                className="InverseBtn"                
                {...props}
                sx={{
                    fontSize: "16px",
                    color: "#4C7B29",
                    background: "#fff",
                    borderRadius: "50px",
                    border: "1px solid #4C7B29",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    fontWeight: "600",
                    lineHeight: "20px",
                    boxShadow: "none",
                    textTransform:"capitalize",
                    position:"relative",
                    zIndex:"3",
                    '&:hover': {
                        backgroundColor: '#fff',
                        color: '#4C7B29',
                    },
                    '&:focus': {
                        backgroundColor: '#fff',
                        color: '#4C7B29',
                    }
                }}
            >
                <Box display="flex" justifyContent={"center"} width="100%">
                    {props?.label}
                </Box>
            </Button>
        </Box>
    );
};
