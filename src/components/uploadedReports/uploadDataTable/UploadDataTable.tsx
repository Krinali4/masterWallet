import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Link } from '@mui/material';
import "../../common/CommonTable.scss";
import Strings from '../../../core/utils/Strings';
import { NavigationProps } from '../../../navigation/Navigation.types';
import BatchList from '../../../core/models/BatchList';
import LoaderWithRecords from '../../common/loader/LoaderWithRecords';
interface IUploadDataTableProps {
    isLoading: boolean
    router: NavigationProps
    batchList: BatchList
}

function UploadDataTable(props: IUploadDataTableProps) {
    const {batchList,isLoading} = props
    return (
        <Box className="listingTable">
            <TableContainer component={Paper}>
                <Table sx={{}} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{Strings.TBL_HEADER_FILE_NAME}</TableCell>
                            <TableCell>{Strings.TBL_HEADER_ACCOUNT_TITLE}</TableCell>
                            <TableCell>{Strings.TBL_HEADER_DATE}</TableCell>
                            <TableCell>{Strings.TBL_HEADER_UPLOADED_BY}</TableCell>
                            <TableCell>{Strings.TBL_HEADER_STATUS_BY}</TableCell>
                            <TableCell>{Strings.TBL_HEADER_ACTION}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {batchList.batches.length > 0 ? batchList.batches.map((batch) => (
                            <TableRow key={batch.id.toString()}>
                                <TableCell>{batch.batchFileName}</TableCell>
                                <TableCell>{batch.account.name}</TableCell>
                                <TableCell>{batch.displayStringCreatedAt()}</TableCell>
                                <TableCell>{batch.uploadedBy}</TableCell>
                                <TableCell>{'Completed'}</TableCell>
                                <TableCell width="105">
                                    <Link color="inherit" sx={{cursor:"pointer"}} href={batch.batchFilePath} target="_blank">
                                        {Strings.TBL_DOWNLOAD_LINK_TITLE}
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )) : <LoaderWithRecords colSpanValue={6} loaderValue={isLoading} />}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
export default UploadDataTable