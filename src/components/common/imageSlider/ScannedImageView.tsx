import "./ScannedImageView.scss"
import { Box } from "@mui/material"
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import placeHolderimg from "../../../statics/svgs/Placeholder_view_vector.svg"

interface IScannedImageViewProps {
    src?: string
    variant: string
}

function ScannedImageView(props: IScannedImageViewProps){
    return(
        <Box className="scanned-image-container">
            <img className="placeHolderimg" src={placeHolderimg} alt="Tag Scanned Placeholder Img" />
            <img className={`${props.variant}-image-view`} src={props.src} alt="Tag Scanned Img" />
            <Box className="zoomIcon"> 
                <ZoomInIcon />
            </Box>
        </Box>
    )
}
export default ScannedImageView