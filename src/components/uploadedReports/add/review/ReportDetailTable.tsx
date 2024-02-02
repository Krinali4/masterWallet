import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Link } from '@mui/material';
import "../../../common/CommonTable.scss";
import { IUploadMaterial } from '../../../../core/models/Material';
import GeneralUtils from '../../../../core/utils/GeneralUtils';
import TextUtils from '../../../../core/utils/TextUtils';

interface Iprops{
    data:IUploadMaterial[]
}

function ReportDetailTable(props:Iprops) {
    return (
        <Box className="listingTable">
            <TableContainer component={Paper}>
                <Table sx={{}} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell className='rowHeading'>Material</TableCell>
                            <TableCell className='rowHeading'>Collected Weight (KG)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {props.data.map((row) => (
                            <TableRow key={row.id.toString()}>
                                <TableCell className='removeBorder' scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell className='removeBorder' >{TextUtils.displayWeight(row.weight)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
export default ReportDetailTable