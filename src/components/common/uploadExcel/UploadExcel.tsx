import { Box, Typography } from "@mui/material";
import { useState } from "react";
import * as XLSX from 'xlsx';
import UploadImgIcon from "../../../statics/svgs/UploadImg.svg";
import DeleteIcon from '@mui/icons-material/Delete';
import Excel from "../../../statics/svgs/Excel.svg"
import "./UploadExcel.scss";
import { PrimaryBtn } from "../button/PrimaryBtn";
import { InverseBtn } from "../button/InverseBtn";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { IExcelRow } from "../../../core/models/UploadBatch";
import ExcelUtils from "../../../core/utils/ExcelUtils";
import Loader from "../loader/Loader";
import Strings from '../../../core/utils/Strings';

interface Iprops {
    selectedFileObject: any|undefined|null
    isFileUploading: boolean
    onFileUploadSuccess(parsedData: IExcelRow[], originalFile: File): void
    onFileUploadError(errorMsg: string): void
    onFileRemoved(): void
}

function UploadExcel(props: Iprops) {

    const {selectedFileObject, isFileUploading, onFileUploadSuccess, onFileUploadError, onFileRemoved} = props

    const [errorText, setErrorText] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState<boolean>(false)

    const fileTypeArray = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', '.csv'];

    const handleFile = (e: any) => {
        let selectedFile = e.target.files[0];
        setFileName(selectedFile.name);
        if (selectedFile) {
            if (selectedFile && fileTypeArray.includes(selectedFile.type)) {
                setLoading(true)
                let reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = (e) => {
                    try {
                        setErrorText(null);
                        e.preventDefault();
                        if (e.target.result !== null) {
                            const workbook = XLSX.read(e.target.result, { type: 'buffer' });
                            const worksheetName = workbook.SheetNames[0];
                            const worksheet = workbook.Sheets[worksheetName];
                            const data = XLSX.utils.sheet_to_json(worksheet);                        
                            const exItemsList = ExcelUtils.convertExcelJSONtoModel(data)
                            if(exItemsList && exItemsList.length > 0) {
                                onFileUploadSuccess(exItemsList, selectedFile)
                            } else {
                                setErrorText('File Headers mismatch');
                                onFileUploadError('File Headers mismatch')
                            }
                            setLoading(false)
                        }
                        else {
                            console.log('Not able to load the file.');
                            setErrorText(Strings.DEFAULT_ERROR_MSG);
                            onFileUploadError(Strings.DEFAULT_ERROR_MSG)
                            setLoading(false)
                        }
                    } catch (error: any) {
                        setLoading(false)
                        setErrorText(error.message);
                        onFileUploadError(error.message)
                    }
                }
                reader.onerror = (e) => {
                    setLoading(true)
                    setErrorText('Error occurred while reading file.');
                    onFileUploadError('Error occurred while reading file.')
                    console.error(`Error occurred reading file: ${selectedFile.name}`);
                };
            }
            else {
                const eMsg = 'Please upload only .xlsx, .xls or .csv files.'
                console.log(eMsg);
                setErrorText(eMsg);
                onFileUploadError(eMsg)
            }
        }
        else {
            const eMsg = 'Please select your file.'
            console.log(eMsg);
            setErrorText(eMsg);
            onFileUploadError(eMsg)
        }
    }

    const deleteFile = (e: any): void => {
        onFileRemoved()
        setErrorText(null);
        setFileName("");
    };

    if(isFileUploading || loading) {
        return(
            <Box sx={{position:"relative",width:"100%",zIndex:9999}}><Loader pshow={true}/></Box>
        )
    }
    
    return (
        <Box>
            <Box className="uploadExcelBox" >
                {selectedFileObject ?
                    <Box className={"fileHolderActive"} display="flex" alignItems="flex-start" minHeight="95px">
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Box display="flex" alignItems="center">
                                <Box className="excelFileIcon">
                                    <img src={Excel} height="32px" width="32px" alt="Excel file Img"/>
                                </Box>
                                <Box className="fileDetails">
                                    <Typography sx={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        color: "#171B1E",
                                        margin: "0px"
                                    }}>
                                        {fileName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            color: "#717579",
                                            margin: "0px"
                                        }}
                                    >
                                        {/* {DateField} */}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className="deleteBox">
                                <DeleteIcon className='deleteIcon' onClick={deleteFile} />
                            </Box>
                        </Box>
                    </Box> :
                    <Box className={"fileHolder"} minHeight="200px">
                        <img src={UploadImgIcon} alt="logo" id="uploadedExcel" className="uploadedExcel" />
                        <Typography marginTop="21px"
                            sx={{
                                color: "#717579",
                                fontWeight: "400",
                                fontSize: "16px",
                                lineHeight: "20px",
                            }}
                        >
                            Upload data
                        </Typography>
                    </Box>
                }
                <input type='file' onChange={handleFile}
                    accept=".csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <Box className="uploadAction" justifyContent="space-between" display="flex" marginTop="49px" position="relative"
                    zIndex={selectedFileObject != null && "3"} >
                    <PrimaryBtn label={selectedFileObject == null ? "Upload File" : "Add Another File"} buttonWidth="200px"
                        disabled={selectedFileObject != null} />
                    <InverseBtn label="Download Sample Format" buttonWidth="280px"
                        href="/assets/sample_data_file.xlsx" />
                </Box>
            </Box>
            {
                errorText &&
                <Box className="fileError">
                    <Typography><FiberManualRecordIcon  /> {errorText}</Typography>
                </Box>
            }
        </Box >)
}

export default UploadExcel;
