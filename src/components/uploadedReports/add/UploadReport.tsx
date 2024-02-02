import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import {
  NavigationProps,
  NavigationState,
} from "../../../navigation/Navigation.types";
import withRouter from "../../../withRouter";
import CustomDropDown from "../../common/customDropDown/CustomDropDown";
import PageHeading from "../../common/pageHeading/PageHeading";
import { Dayjs } from "dayjs";
import BasicDatePicker from "../../common/customeDatePicker/CustomeDatePicker";
import { PrimaryBtn } from "../../common/button/PrimaryBtn";
import { InverseBtn } from "../../common/button/InverseBtn";
import Navigation from "../../../navigation/Navigation";
import Strings from "../../../core/utils/Strings";
import UploadExcel from "../../common/uploadExcel/UploadExcel";
import DateUtils from "../../../core/utils/DateUtils";
import LocationList from '../../../core/models/LocationList';
import AccountList from '../../../core/models/AccountList';
import AccountService from '../../../services/AccountService';
import { ApiError } from '../../../core/webservice/ApiError';
import Account from '../../../core/models/Account';
import LocationService from '../../../services/LocationService';
import MaterialService from '../../../services/MaterialService';
import MaterialList from '../../../core/models/MaterialList';
import { IExcelRow, IUploadBatch } from '../../../core/models/UploadBatch';
import TextUtils from "../../../core/utils/TextUtils";
import { IUploadMaterial } from '../../../core/models/Material';
import Loader from "../../common/loader/Loader";
import { showErrorMessage, showMessage } from '../../common/customeToast/MessageNotifier';
import UploadDataService from '../../../services/UploadDataService';

interface IProps {
  router: NavigationProps;
  states: NavigationState;
}

function UploadReport(props: IProps) {

  const [loading, setLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [errorMsgStartDate, setErrorMsgStartDate] = useState("");
  const [errorMsgEndDate, setErrorMsgEndDate] = useState("");

  const [accountList, setAccountList] = useState<AccountList>(
    AccountList.default()
  );
  const [locationList, setLocationList] = useState<LocationList>(
    LocationList.default()
  );
  const [materialList, setMaterialList] = useState<MaterialList>(
    MaterialList.default()
  );

  const [uploadBatch, setUploadBatch] = useState<IUploadBatch>(
    {
      account: undefined,
      location: undefined,
      startDt: null,
      endDt: null,
      file: undefined,
      materialList: undefined,
      fileId: undefined,
      unknownMaterialList:undefined,
      allExcelMaterialList:undefined
    }
  );

  useEffect(() => {
    getInitialData();
  }, []);

  // useEffect(() => {
  //   console.log(JSON.stringify(uploadBatch))
  // }, [uploadBatch]);

  const getInitialData = () => {
    setIsDataLoading(true);
    Promise.all([
      AccountService.getFullAccountList(),
      MaterialService.getAllMaterialList(),
    ])
    .then((_results: any[]) => {
      setIsDataLoading(false);
      let aList: AccountList = (_results[0]) ? _results[0] : AccountList.default();
      let mList: MaterialList = (_results[1]) ? _results[1] : MaterialList.default();
      setAccountList(aList);
      setMaterialList(mList);
    })
    .catch((apiError: ApiError) => {
      setIsDataLoading(false);
      console.log(apiError.message);
    });
  }

  const getLocationListByAccount = (account: Account) => {
    LocationService.getAllLocationsListByAccount(account)
      .then((newLocationList: LocationList) => {
        setLocationList(newLocationList);
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false);
        console.log(apiError.message);
      });
  };

  const handleBackOrCancel = () => {
    Navigation.back(props.router);
  };

  const handleUploadDataClicked = (e: any) => {
    e.preventDefault();
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      Navigation.toUploadedReportReview(props.router, uploadBatch)
    },3000)
  }

  const upUploadBatchField = (field: string, value: any) => {
    setUploadBatch({ ...uploadBatch, [field]: value });
  };

  const upUploadBatchAccountField = (value: any) => {
    let account = accountList.findAccountById(value);
    // reset account by undefined to reset list
    setUploadBatch({
      ...uploadBatch,
      account: account.getAccount(),
      location: undefined,
    });

    // fetch location list by account id
    if (account.userId) {
      getLocationListByAccount(account);
    }
  };

  const upUploadBatchLocationField = (value: any) => {
    const location = locationList.findLocationById(value);
    setUploadBatch({ ...uploadBatch, location: location.getLocation() });
  };

  const upUploadBatchFileField = (sFile: any, 
    sMaterialList: IUploadMaterial[]|undefined, 
    fileId: string,
    sAllExcelMaterialList: IExcelRow[]|undefined,
    sUnknownMaterialList: IExcelRow[]|undefined) => {
    setUploadBatch({ ...uploadBatch, file: sFile, materialList: sMaterialList, fileId, allExcelMaterialList:sAllExcelMaterialList ,unknownMaterialList: sUnknownMaterialList });
  };

  const isFormValidated = () => {
    let isValidated = true;
    console.log(JSON.stringify(uploadBatch))
    if (
      !uploadBatch ||
      !uploadBatch.account ||
      !uploadBatch.location ||
      !uploadBatch.startDt ||
      !uploadBatch.endDt ||
      !uploadBatch.file ||
      !uploadBatch.materialList ||
      (uploadBatch.materialList && uploadBatch.materialList.length === 0) ||
      !TextUtils.isEmpty(errorMsgStartDate) ||
      !TextUtils.isEmpty(errorMsgEndDate)
    ) {
      isValidated = false;
    }
    return isValidated;
  };

  const handleFileUploadSuccess = (parsedData: IExcelRow[], originalFile: any) => {
    try {
      // Upload file
      setIsFileUploading(true)
      UploadDataService.uploadReportDataFile(originalFile)
      .then((fileId: string) => {
        if (fileId && fileId.length > 0) {
          console.log('materialList -->'+JSON.stringify(materialList))
          const result = MaterialList.filterMaterialList(parsedData,materialList)
          const finalMaterialList = result.materialList
          const unknownMaterialList = result.unknownMaterialList
          upUploadBatchFileField(originalFile,finalMaterialList.getUploadMaterialList(),fileId,parsedData,unknownMaterialList)
        }
        setIsFileUploading(false)
        showMessage('File uploaded successfully.')
      })
      .catch((apiError: ApiError) => {
        setIsFileUploading(false)
        showErrorMessage(apiError.message)
        console.log(apiError.message)
      })
    } catch (error: any) {
      setIsFileUploading(false)
      showErrorMessage(error)
    }
  }

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />;
  }

  return (
    <Box>
      <PageHeading
        backArrow={true}
        heading="Upload Data"
        onClick={() => {
          Navigation.back(props.router);
        }}
      />
      <Box
        className="mainContainer"
        display="flex"
        gap="25px"
        marginTop="43px"
      >
        <Box width="62.40%" maxWidth="1198px" className="inputBox">
          <Box display="flex" gap="25px">
            <Box width="533px">
              <CustomDropDown
                data={accountList.dropDownItems}
                heading="Select Account "
                placeholder="Select Account"
                value={uploadBatch.account ? uploadBatch.account.id : ""}
                onChange={(e: any) => upUploadBatchAccountField(e.target.value)}
              />
            </Box>
            <Box width="533px">
              <CustomDropDown
                data={locationList.dropDownItems}
                heading="Select Location "
                placeholder="Select Location"
                value={uploadBatch.location ? uploadBatch.location.id : ""}
                onChange={(e: any) => upUploadBatchLocationField(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            marginTop="40px"
            gap="25px"
          >
            <Box width="533px">
              <BasicDatePicker
                heading="Enter Start Date "
                disableFuture
                onChange={(date: any) => {
                  if(date){
                    setErrorMsgStartDate(DateUtils.startDateValidations(date))
                    setStartDate(date);
                    try {
                      upUploadBatchField("startDt", DateUtils.getStartDateISOString(date))
                    } catch (error) {
                      
                    }
                  }
                  
                }}
                value={startDate}
                errorMsg={errorMsgStartDate}
              />
            </Box>
            <Box width="533px">
              <BasicDatePicker
                disableFuture
                heading="Enter End Date "
                onChange={(date: any) => {
                  setErrorMsgEndDate(DateUtils.endDateValidations(date, startDate))
                  setEndDate(date);
                  try {
                    upUploadBatchField("endDt", DateUtils.getEndDateISOString(date))
                  } catch (error) {
                    
                  }
                }}
                value={endDate}
                errorMsg={errorMsgEndDate}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            <PrimaryBtn
              label="Upload Data"
              buttonWidth="243px"
              loading={loading}
              onClick={(e: any) => {handleUploadDataClicked(e)}}
              disabled={!isFormValidated()}
            />
            <InverseBtn 
              label={Strings.CANCEL} 
              buttonWidth="243px"
              onClick={() => {
                handleBackOrCancel();
              }}
            />
          </Box>
        </Box>
        <Box width="37.60%" maxWidth="608px" marginTop="55px">
          <UploadExcel 
            selectedFileObject={uploadBatch.file}
            isFileUploading={isFileUploading}
            onFileUploadSuccess={(parsedData: IExcelRow[], originalFile: any) => {
              handleFileUploadSuccess(parsedData,originalFile)
            }}
            onFileUploadError={(errorMsg: string) => {
              console.log('onFileUploadError')
            }}
            onFileRemoved={() => {
              upUploadBatchFileField(undefined,undefined,undefined,undefined,undefined)
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
export default withRouter(UploadReport);
