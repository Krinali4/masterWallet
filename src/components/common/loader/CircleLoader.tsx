import React from "react";
import { Typography, Box } from "@mui/material";
import CircleLoading from "../../../statics/images/CircleLoading.gif";
interface ILoaderProps {
    pshow: boolean;
    pageTitle: string;
}
class CircleLoader extends React.Component<ILoaderProps, any> {
    public constructor(props: ILoaderProps) {
        super(props);
    }
    public render() {
        return (
            this.props.pshow && (
                <Box
                    sx={{
                        top: "50%",
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "translateY(-50%)",
                        flexDirection: "column",
                    }}
                >
                    <Typography sx={{
                        fontSize: "36px",
                        fontWeight: "600",
                        color: "#171B1E"
                    }}>
                        {this.props.pageTitle}
                    </Typography>
                    <img src={CircleLoading} alt="Circle Loader" />
                </Box>
            )
        );
    }
}

export default CircleLoader;
