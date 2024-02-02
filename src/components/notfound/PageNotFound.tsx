import { Box, Typography } from "@mui/material"
import { NavigationProps, NavigationState } from "../../navigation/Navigation.types"
import withRouter from "../../withRouter"


interface IProps {
    router: NavigationProps
    states: NavigationState
}

function PageNotFound(props: IProps) {
    return(
        <Box>
            <Typography variant="h1">Page not found</Typography> 
        </Box>
    )
}
export default withRouter(PageNotFound);