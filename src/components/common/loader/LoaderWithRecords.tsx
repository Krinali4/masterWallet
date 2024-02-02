import { Box, TableCell, TableRow, Typography } from "@mui/material";
import Loader from "./Loader";
import Strings from '../../../core/utils/Strings';

interface Iprops {
    colSpanValue: number,
    loaderValue: boolean,
}

function LoaderWithRecords(props: Iprops) {
    return (
        <TableRow>
            <TableCell colSpan={props.colSpanValue} sx={{ position: "relative" }}>
                <Box minHeight={props.loaderValue ? "50px" : "200px"} width="100%" display="flex" alignItems="center" justifyContent="center" >
                    {!props.loaderValue ? <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                        {Strings.NO_DATA_AVAILABLE}
                    </Typography> :
                        <Loader pshow={props.loaderValue} />}
                </Box>
            </TableCell>
        </TableRow>
    )
}
export default LoaderWithRecords;