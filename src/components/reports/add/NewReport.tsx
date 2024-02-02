import { Box } from "@mui/material"
import Strings from "../../../core/utils/Strings"
import Navigation from "../../../navigation/Navigation"
import {
  NavigationProps,
  NavigationState,
} from "../../../navigation/Navigation.types"
import withRouter from "../../../withRouter"
import { InverseBtn } from "../../common/button/InverseBtn"
import { PrimaryBtn } from "../../common/button/PrimaryBtn"
import CustomDropDown from "../../common/customDropDown/CustomDropDown"
import BasicDatePicker from "../../common/customeDatePicker/CustomeDatePicker"
import PageHeading from "../../common/pageHeading/PageHeading"
import { Dayjs } from "dayjs"
import { useState, useEffect } from "react"
import CircleLoader from "../../common/loader/CircleLoader"
import DateUtils from '../../../core/utils/DateUtils';
import AccountList from "../../../core/models/AccountList"
import LocationList from "../../../core/models/LocationList"
import PartnerList from "../../../core/models/PartnerList"
import { IReport } from "../../../core/models/Report"
import LocationService from "../../../services/LocationService"
import { ApiError } from "../../../core/webservice/ApiError"
import Account from "../../../core/models/Account"
import Partner from "../../../core/models/Partner"
import AccountService from "../../../services/AccountService"
import TextUtils from "../../../core/utils/TextUtils"
import PartnerService from "../../../services/PartnerService"
import Loader from "../../common/loader/Loader"
import ReportService from '../../../services/ReportService';
import { showErrorMessage } from '../../common/customeToast/MessageNotifier';
import ReportData from '../../../core/models/ReportData';
import DashboardMetrix from '../../../core/models/DashboardMetrix';
interface IProps {
  router: NavigationProps
  states: NavigationState
}
function NewReport(props: IProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true)

  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [errorMsgStartDate, setErrorMsgStartDate] = useState("")
  const [errorMsgEndDate, setErrorMsgEndDate] = useState("")

  const [partnerList, setPartnerList] = useState<PartnerList>(
    PartnerList.default()
  )
  const [accountList, setAccountList] = useState<AccountList>(
    AccountList.default()
  )
  const [locationList, setLocationList] = useState<LocationList>(
    LocationList.default()
  )

  const [report, setReport] = useState<IReport>({
    id: undefined,
    partner: undefined,
    account: undefined,
    location: undefined,
    startDt: null,
    endDt: null,
    createdAt: null,
    reportFileName: undefined,
    reportImgFileName: undefined,
    reportPdfUrl: "",
    reportImgUrl: "",
  })

  useEffect(() => {
    getInitialData()
  }, [])

  // useEffect(() => {
  //   console.log(JSON.stringify(uploadBatch))
  // }, [uploadBatch]);

  const getInitialData = () => {
    setIsDataLoading(true)
    // AccountService.getFullAccountList(),
    // LocationService.getFullLocationList(0),

    Promise.all([
      PartnerService.getFullPartnerList(),
    ])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        let pList: PartnerList = _results[0]
          ? _results[0]
          : PartnerList.default()
        let aList: AccountList = _results[1]
          ? _results[1]
          : AccountList.default()
        let lList: LocationList = _results[2]
          ? _results[2]
          : LocationList.default()
        setPartnerList(pList)
        setAccountList(aList)
        setLocationList(lList)
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const upReportField = (field: string, value: any) => {
    setReport({ ...report, [field]: value })
  }

  const upReportPartnerField = (value: any) => {
    let partner = partnerList.findPartnerById(value)
    // reset account by undefined to reset list
    setReport({
      ...report,
      partner: partner.getPartner(),
      account: undefined,
      location: undefined,
    })

    // fetch account list by partner id
    if (partner.userId) {
      getAccountListByPartner(partner)
    }
  }

  const upReportAccountField = (value: any) => {
    let account = accountList.findAccountById(value)
    // reset account by undefined to reset list
    setReport({
      ...report,
      account: account.getAccount(),
      location: undefined,
    })

    // fetch location list by account id
    if (account.userId) {
      getLocationListByAccount(account)
    }
  }

  const upReportLocationField = (value: any) => {
    const location = locationList.findLocationById(value)
    setReport({ ...report, location: location.getLocation() })
  }

  const getAccountListByPartner = (partner: Partner) => {
    AccountService.getFullAccountListByPartnerID(partner.userId)
      .then((newAccountList: AccountList) => {
        setAccountList(newAccountList)
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const getLocationListByAccount = (account: Account) => {
    LocationService.getAllLocationsListByAccount(account)
      .then((newLocationList: LocationList) => {
        setLocationList(newLocationList)
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const isFormValidated = () => {
    let isValidated = true
    console.log(JSON.stringify(report))
    if (
      !report ||
      !report.account ||
      !report.location ||
      !report.startDt ||
      !report.endDt ||
      (report.startDt && TextUtils.isEmpty(report.startDt)) ||
      (report.endDt && TextUtils.isEmpty(report.endDt)) ||
      !TextUtils.isEmpty(errorMsgStartDate) ||
      !TextUtils.isEmpty(errorMsgEndDate)
    ) {
      isValidated = false
    }
    return isValidated
  }

  const handleBackOrCancel = () => {
    Navigation.back(props.router)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const animationTime = 2
    var a = new Date()
    console.log(JSON.stringify(report))
    setLoading(true)

    Promise.all([ReportService.getReportData(report), ReportService.getReportKPAData(report)])
      .then((_results: any[]) => {
        const reportData: ReportData =  _results[0]
        const dashboardMatrix: DashboardMetrix =  _results[1]
        console.log(
          "getReportDetails :" + JSON.stringify(reportData.getReportData())
        )
        console.log(
          "getDashbaoardMatrix :" + JSON.stringify(dashboardMatrix.getDashbaoardMatrix())
        )
        var secondBetweenTwoDate = Math.abs((new Date().getTime() - a.getTime()) / 1000);
        if(secondBetweenTwoDate < animationTime) {
          const newTime = (animationTime - secondBetweenTwoDate) * 1000
          setTimeout(() => {
            setLoading(false)
            if(reportData.materialList.materials.length == 0) {
              showErrorMessage('No data available for the selected period.')
            } else {
              Navigation.toPublishCurrentReportPage(props.router, { reportData: reportData.getReportData(), dashboardMatrix: dashboardMatrix.getDashbaoardMatrix()})
            }
          }, newTime)
        }
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showErrorMessage(apiError.message)
        console.log(apiError.message)
      })
  }

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />
  }

  return (
    <Box>
      {loading ? (
        <CircleLoader pshow={loading} pageTitle="Generating Report" />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between">
            <PageHeading
              backArrow={true}
              heading={Strings.NEW_REPORT_HEADER_TITLE}
              onClick={handleBackOrCancel}
            />
          </Box>
          <Box
            className="mainContainer"
            display="flex"
            gap="72px"
            marginTop="43px"
          >
            <Box width="100%" className="inputBox">
              <Box display="flex" gap="72px">
                <Box width="533px">
                  <CustomDropDown
                    data={partnerList.dropDownItems}
                    heading="Select Client ID "
                    placeholder="Select Client ID"
                    value={report.partner ? report.partner.id : ""}
                    onChange={(e: any) => upReportPartnerField(e.target.value)}
                  />
                </Box>
                <Box width="533px">
                  <CustomDropDown
                    data={accountList.dropDownItems}
                    heading="Select Account "
                    placeholder="Select Account"
                    value={report.account ? report.account.id : ""}
                    onChange={(e: any) => upReportAccountField(e.target.value)}
                  />
                </Box>
                <Box width="533px">
                  <CustomDropDown
                    data={locationList.dropDownItems}
                    heading="Select Location "
                    placeholder="Select Location"
                    value={report.location ? report.location.id : ""}
                    onChange={(e: any) => upReportLocationField(e.target.value)}
                  />
                </Box>
              </Box>
              <Box display="flex" marginTop="40px" gap="72px">
                <Box width="533px">
                  <BasicDatePicker
                    heading="Enter Start Date "
                    disableFuture
                    onChange={(date: any) => {
                      setErrorMsgStartDate(DateUtils.startDateValidations(date))
                      setStartDate(date)
                      try {
                        upReportField("startDt", DateUtils.getStartDateISOString(date))
                      } catch (e: any) {
                        
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
                      setErrorMsgEndDate(
                        DateUtils.endDateValidations(date, startDate)
                      )
                      setEndDate(date)
                      try {
                        upReportField("endDt", DateUtils.getEndDateISOString(date))
                      } catch (e: any) {
                        
                      }
                    }}
                    value={endDate}
                    errorMsg={errorMsgEndDate}
                  />
                </Box>
                <Box sx={{ width: "533px", opacity: "0" }}>Dummy Box</Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap="47px"
                marginTop="49px"
              >
                <PrimaryBtn
                  label={Strings.GENERATE_ROPORT}
                  buttonWidth="243px"
                  loading={loading}
                  disabled={!isFormValidated()}
                  onClick={handleSubmit}
                />
                <InverseBtn
                  label={Strings.CANCEL}
                  buttonWidth="243px"
                  onClick={() => {
                    handleBackOrCancel()
                  }}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
export default withRouter(NewReport)
