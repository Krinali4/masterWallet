import { Typography, Box } from "@mui/material";
import completed from "../../../statics/svgs/completed.svg";
import { PrimaryBtn } from "../button/PrimaryBtn";


function SucessLoading(props: any) {
    return (
        <Box sx={{ width: "100%", textAlign: "center", justifyContent: "center", alignItems: "center" , minHeight:"calc(100vh - 280px)", display:"flex" }}>
            <Box>
                <Typography sx={{
                    fontWeight: "600",
                    fontSize: "36px",
                    color: "#171B1E",
                    marginBottom: "49px"
                }}>
                {props.pageHeading}
                </Typography>
                <img src={completed} alt="Success icon"/>
                <Box marginTop="55px" display="flex" justifyContent="center">
                    <PrimaryBtn buttonWidth="243px"
                    {...props}
                    label={props.buttonLabel}
                    />
                </Box>
            </Box>
        </Box>
    )
}
export default SucessLoading;