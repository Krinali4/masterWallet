import { Typography, Box } from "@mui/material";
import './TagStatus.scss'
interface ITagStatusProps {
    status: string
}

export default function TagStatus(props: ITagStatusProps) {
    return(
        <Box className="tagStatusBox">
          <Typography variant="h2">{props.status}</Typography>
        </Box>
    )
}