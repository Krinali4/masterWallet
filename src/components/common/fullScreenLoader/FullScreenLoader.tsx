import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import "./FullScreenLoader.scss";
import Loader from "../loader/Loader";
interface Iprops {
    show: boolean,
    loaderText?: string,
}

export default function FullScreenLoader(props: Iprops) {

  if(!props.show) return null

  return ( 
    <Box className="fullScreenLoader">
        <Box position="relative" width="50px" height="50px">
            <Loader pshow={props.show} loadingImgWidth="50px" />
        </Box>
        {props.loaderText && <Typography>{props.loaderText}</Typography>}
    </Box>
  );
}
 