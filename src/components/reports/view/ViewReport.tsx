import {
  NavigationProps,
  NavigationState,
  ViewReportNavigationState,
} from "../../../navigation/Navigation.types"
import withRouter from "../../../withRouter"
import { Box, IconButton, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import "./ViewReport.scss"
import PageHeading from "../../common/pageHeading/PageHeading"
import Navigation from "../../../navigation/Navigation"
import { PrimaryBtn } from "../../common/button/PrimaryBtn"
import { IReportData } from "../../../core/models/ReportData"
import TextUtils from "../../../core/utils/TextUtils"
import DoughnutPiechart from "../../common/pieChart/DoughnutPiechart"
import ReportMetrix from "../../common/reportMetrix/ReportMetrix"
import { useState, useEffect } from "react"
import ReportService from "../../../services/ReportService"
import { showErrorMessage, showApiErrorMessage } from '../../common/customeToast/MessageNotifier';
import { ApiError } from "../../../core/webservice/ApiError"
import Report from "../../../core/models/Report"
import { useParams } from "react-router-dom"
import Loader from "../../common/loader/Loader"
import { IReport } from "../../../core/models/Report"
import CircleLoader from '../../common/loader/CircleLoader';
import DateUtils from "../../../core/utils/DateUtils"
import { IDashboardMetrix } from '../../../core/models/DashboardMetrix';
import UserManager from '../../../core/utils/UserManager';
import { AccountType } from '../../../core/models/User';
import FilterDropDown from "../../common/customDropDown/filterWithoutCheckBox/ FilterDropDown";
import PrintIcon from '@mui/icons-material/Print';
import printJS from 'print-js'
import LegendList from "../../common/pieChart/LegendList"

interface IProps {
  router: NavigationProps
  states: NavigationState
}
function createData(
  MaterialCollected: string,
  CollectedWeight: string,
  Weight: string
) {
  return { MaterialCollected, CollectedWeight, Weight }
}

const rows = [
  createData("Strapping", "40", "30%"),
  createData("Planter Trays", "35", "28%"),
  createData("Black Trays", "58", "62%"),
  createData("Miscellaneous", "50", "25%"),
]

const ancherTagFunc = (url: string, targetValue: boolean) => {
  const element = document.createElement("a");
  element.href = url;
  element.target = targetValue ? "_blank" : "";
  element.download = ""
  document.body.appendChild(element);
  element.click();  
}

const formatArray = ["PDF Format", "JPG Format"];

function ViewReport(props: IProps) {
  const { reportId } = useParams()

  const [selectedStringValue, setSelectedStringValue] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false)
  const [isPDFDownloading, setIsPDFDownloading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
  const [reportData, setReportData] = useState<IReportData | undefined>(
    undefined
  )
  const [report, setReport] = useState<Report>(undefined)
  const [dashboardMatrix, setDashboardMatrix] = useState<IDashboardMetrix | undefined>(
    undefined
  )

  useEffect(() => {
    if (selectedStringValue.length > 0 && report) {
      if (selectedStringValue == formatArray[0]) {
        ancherTagFunc(report.reportPdfUrl, false);
      } else {
        ancherTagFunc(report.reportImgUrl, false);
      }
    }
  }, [selectedStringValue])

  useEffect(() => {
    console.log("useEffect reportData :" + JSON.stringify(reportData))
    if (
      reportData &&
      reportData.pdfFileId &&
      reportData.imageFileId &&
      !TextUtils.isEmpty(reportData.pdfFileId) &&
      !TextUtils.isEmpty(reportData.imageFileId)
    ) {
      // create report api
      handleCreateReport()
    }
  }, [reportData])

  useEffect(() => {
    const locState = props.router.location.state as ViewReportNavigationState
    if (locState && locState.reportData && locState.dashboardMatrix) {
      setReportData(locState.reportData)
      setDashboardMatrix(locState.dashboardMatrix)
      console.log("New Report "+JSON.stringify(locState.reportData))
    } else if (reportId) {
      getInitialData()
    } else {
      Navigation.toHome(props.router)
    }
  }, [])

  const getInitialData = () => {
    setIsDataLoading(true)
    let rID: number = undefined
    if (!isNaN(Number(reportId))) {
      rID = Number(reportId)
    }
    Promise.all([rID ? ReportService.getReportDetails(rID) : Promise.resolve()])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        if (_results[0]) {
          const rReport: Report = _results[0]
          const rObj = rReport.getReport()
          setReport(_results[0])
          getReportData(rObj)
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const getReportData = (iReport: IReport) => {
    setIsDataLoading(true)
    Promise.all([ReportService.getReportData(iReport), ReportService.getReportKPAData(iReport)])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        if (_results[0]) {
          console.log(
            "getReport :" + JSON.stringify(_results[0])
          )
          console.log(
            "getReportDetails :" + JSON.stringify(_results[0].getReportData())
          )
          setReportData(_results[0].getReportData())
        }
        if (_results[1]) {
          console.log(
            "getReportKPADetails :" + JSON.stringify(_results[1].getDashbaoardMatrix())
          )
          setDashboardMatrix(_results[1].getDashbaoardMatrix())
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        showErrorMessage(apiError.message)
        console.log(apiError.message)
      })
  }

  const handleCreateReport = () => {
    setLoading(true)
    ReportService.createReport(reportData)
      .then((result: Report) => {
        console.log(JSON.stringify(result))
        setLoading(false)
        Navigation.topublishReport(props.router)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showErrorMessage(apiError.message)
        // console.log(apiError.message)
      })
  }

  const handlePublishReport = () => {
    if (
      reportData.pdfFileId &&
      reportData.imageFileId &&
      !TextUtils.isEmpty(reportData.pdfFileId) &&
      !TextUtils.isEmpty(reportData.imageFileId)
    ) {
      // report already generated
      handleCreateReport()
      return
    }
    console.log("handlePublishReport :" + JSON.stringify(reportData))
    // generate pdf report
    setLoading(true)
    ReportService.generatePDFReport(reportData,dashboardMatrix)
      .then((result) => {
        const { pdfFileId, imageFileId } = result
        console.log("generatePDFReport :" + JSON.stringify(result))
        setReportData({
          ...reportData,
          pdfFileId: pdfFileId,
          imageFileId: imageFileId,
        })
        setLoading(false)
        //Navigation.topublishReport(props.router)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showErrorMessage(apiError.message)
        // console.log(apiError.message)
      })
  }

  const printPDFReport = () => {
    if(!report) return;
    setIsPDFDownloading(true)
    ReportService.downloadPDFFile(report.reportPdfUrl)
    .then((pdfUrl) => {
      printJS(pdfUrl);
      setTimeout(() => {
        setIsPDFDownloading(false)
      },1000)
    })
    .catch((apiError: ApiError) => {
      setIsPDFDownloading(false)
      showApiErrorMessage(apiError)
    })
  }

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />
  }

  if (!reportData) return null
  const { location } = reportData

  if (loading) {
    return (
      <Box><CircleLoader pshow={loading} pageTitle="Publishing Report" /></Box>
    )
  }

  return (
    <Box className="publishedReportWarpper">
      <Box
        className="pageHeader"
        marginBottom="45px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <PageHeading
          heading="Sustainability Report"
          backArrow={true}
          onClick={() => {
            Navigation.back(props.router)
          }}
        />
        <Box className="pageAction" marginRight="32px">
          {!reportId && reportData && UserManager.shared().user.accountType === AccountType.ROOT_USER && <PrimaryBtn
            label="Publish Report"
            buttonWidth="225px"
            loading={loading}
            onClick={() => handlePublishReport()}
          />}
          {report &&
            <Box width="180px" display="flex" justifyContent="space-between" alignItems="center">
              <FilterDropDown
                data={formatArray}
                label="Download"
                buttonWidth="150px"
                onSelectedValue={setSelectedStringValue}
              />
              <IconButton
                onClick={(e) => {
                  e.preventDefault()
                  printPDFReport()
                  // ancherTagFunc(report.reportPdfUrl, true)
                }}
                sx={{
                  position:"relative",
                  width:"40px",
                  height:"40px",
                  display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", 
                  '&:hover': {
                    backgroundColor: "#E7F2E7 !important"
                  },
                  '&:focus': {
                    backgroundColor: "#E7F2E7 !important"
                  }
                }}
              >
                
                {isPDFDownloading ? <Loader loadingImgWidth="20px"  pshow={isPDFDownloading}/> : <PrintIcon sx={{
                  color: "#4C7B29",
                }} />}
              </IconButton>
            </Box>
          }
        </Box>
      </Box>
      <Box className="reportHeader">
        <Box className="reportTitle">
          <Typography variant="h2">{location.account.name}</Typography>
        </Box>
        <Box className="reportDetails">
          <Box className="detailBox">
            <Typography>
              <span>Location:</span>
              {location.name}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>Address:</span>
              {location.address}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>Report Period:</span>
              {`${DateUtils.getDisplayDateFromISOString(reportData.startDt)} - ${DateUtils.getDisplayDateFromISOString(reportData.endDt)}`}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>Report Duration:</span>
              {reportData.auditDuration || ""}
            </Typography>
          </Box>
          <Box className="detailBox">
            <Typography>
              <span>Reported on:</span>
              {reportData.reportedOn || ""}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="reportsStats">
        <ReportMetrix
          metrixTitle="Annualized Waste (KG) Diversion"
          metrixCount={TextUtils.displayMatrixData(dashboardMatrix.annualizedWastDiversion || 0)}
          boxMaxWidth="555px"
          boxMinHeight="233px"
        />
        <ReportMetrix
          metrixTitle="Annualized CO2 (KG) Sequestered"
          metrixCount={TextUtils.displayMatrixData(dashboardMatrix.annualizedSequestered || 0)}
          boxMaxWidth="555px"
          boxMinHeight="333px"
        />
        <Box className="statsBox">
          <Box className="dataBox reportPieChart">
            <h2>Waste Stream Breakdown</h2>
            <Box className="chartBlock">
              <Box className="pieChartBox">
                <DoughnutPiechart data={reportData.materials} contant={true} />
              </Box>
              <LegendList data={reportData.materials} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="listingTable">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Collected Weight (KG)</TableCell>
                <TableCell>% Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.materials.map((row) => (
                <TableRow key={row.id.toString()}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{TextUtils.displayWeight(row.weight)}</TableCell>
                  <TableCell>{`${row.percentage}%`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="totalMaterial">
          Total Material:{" "}
          <span>{TextUtils.displayWeight(reportData.totalWeight)}</span>
        </Box>
      </Box>
      {/* <Box className="noteBox">
        Plastic Fact: Recycling one ton of plastic saves the equivalent of
        1,000–2,000 gallons of gasoline!
      </Box> */}
    </Box>
  )
}
export default withRouter(ViewReport)
