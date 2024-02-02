import React from "react";
import { CircularProgress, Box } from "@mui/material";

interface ILoaderProps {
  pshow: boolean,
  loadingImgWidth?:string,
  color?:string
}
class Loader extends React.Component<ILoaderProps, any> {
  public constructor(props: ILoaderProps) {
    super(props);
  }

  public render() {
    const {color = '#412E56'} = this.props
    const loaderColor = "#000";
    return (
      this.props.pshow && (
        <Box className="loaderBox"
          sx={{
            top: "50%",
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: (theme) => '#ffffff',
            transform:"translateY(-50%)"
          }}
        >
          <CircularProgress size={this.props.loadingImgWidth} style={{'color': color}} />
        </Box>
      )
    );
  }
}

export default Loader;
