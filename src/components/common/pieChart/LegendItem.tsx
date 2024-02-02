import { Typography, Box } from "@mui/material";
import './LegendItem.scss'
interface ILegendItemProps {
    title: string
    color: string
}

export default function LegendItem(props: ILegendItemProps) {
    return(
        <Box className="legendItem-container">
            <span className="dot" style={{backgroundColor:`${props.color}`}}></span>
            <Typography
                className="legend-title"
                variant="h6"
            >
               {props.title}
            </Typography>
        </Box>
    )
}