import { Typography, Box } from "@mui/material";
import Loader from "../loader/Loader";
import "./ReportMetrix.scss"
interface IProps {
    metrixTitle?: string, 
    metrixCount?:number|string,
    boxMaxWidth?:string,
    boxMinHeight?:string,
    variant?:string, /*use variant: "report" or variant: "kpa" only*/
    loading?:boolean,
    
  }
function ReportMetrix(props: IProps) {
    return (
        <Box className={props.variant == "report" ? "reportMetrix report" : "reportMetrix kpa" }  maxWidth={props?.boxMaxWidth} minHeight={props?.boxMinHeight}>
            {props?.loading ? <Loader pshow={props.loading} /> :
            <Box className="reportDataBox">
                <Typography  className="reportMetrixTitle">
                    {props?.metrixTitle}
                </Typography> 
                <Typography className="reportMetrixCount">{props?.metrixCount}</Typography>
            </Box>
            }
            
        </Box>  
    )
}
export default ReportMetrix;