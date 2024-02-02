import { Box, Link, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import withRouter from "../../withRouter"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import "../common/CommonTable.scss"
import PaginationBox from "../common/pagination/PaginationBox"
import Navigation from "../../navigation/Navigation"
import { useEffect, useState } from "react"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import UserManager from '../../core/utils/UserManager';
import { AccountType, UserRole } from "../../core/models/User"
import Strings from "../../core/utils/Strings"
import { InverseBtnDropDown } from "../common/customDropDown/filterDropdown/InverseBtnDropDown"
import arrowDownIcon from "../../statics/svgs/arrowDownIcon.svg"
import calendarIcon from "../../statics/svgs/calendarIcon.svg"
import ReportList from "../../core/models/ReportList"
import ReportService from '../../services/ReportService';
import { ApiError } from '../../core/webservice/ApiError';
import ReportMetrix from "../common/reportMetrix/ReportMetrix"
import DashboardMetrix, { IDashboardMetrix } from "../../core/models/DashboardMetrix"
import TextUtils from "../../core/utils/TextUtils"
import QueryParamUtils, { IQueryParams } from '../../core/utils/QueryParamUtils';
import AccountsFilter from "../common/filters/AccountsFilter"
import LocationsFilter from "../common/filters/LocationFilter"
import ClientsFilter from "../common/filters/ClientsFilter"

interface IProps {
  router: NavigationProps
  states: NavigationState
}

function Reports(props: IProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)

  const [reportList, setReportList] = useState<ReportList>(ReportList.default())
  const [isLoading, setIsLoading] = useState(false)
  const [isDMLoading, setIsDMLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)

  const [dashboardMatrix, setDashboardMatrix] = useState<IDashboardMetrix>({
    totalWasteReceived: 0,
    totalWasteSorted: 0,
    totalWasteProcessed: 0,
    annualizedWastDiversion: 0,
    annualizedSequestered: 0
  })

  // componentDidMount
  useEffect(() => {
    fetchDashboardMatrix()
  }, [])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    fetchDashboardMatrix()
    fetchReportList(filter.page)
  }, [filter])

  const fetchReportList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    ReportService.getReportList(filter)
      .then((newReportList: ReportList) => {
        setIsLoading(false)
        setReportList(newReportList)
        console.log(JSON.stringify(newReportList))
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
      })
  }

  const fetchDashboardMatrix = () => {
    if(isDMLoading) return
    setIsDMLoading(true)
    ReportService.getDashboardMatrix(filter)
      .then((dm: DashboardMetrix) => {
        setIsDMLoading(false)
        setDashboardMatrix(dm.getDashbaoardMatrix())
      })
      .catch((apiError: ApiError) => {
        setIsDMLoading(false)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toReports({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const upFilter = (field: string, value: any) => {
    const newFilter = {...filter, [field]: value}
    console.log('upFilter :'+newFilter)
    Navigation.toReports({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const isAddReportEnabled = () => {
    if (
      UserManager.shared().user.accountType === AccountType.ROOT_USER &&
      (UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN)
    ) {
      return true
    }
    return false
  }

  const shouldDisplayKPIBlocks = () => {
    if (
      UserManager.shared().user.accountType === AccountType.PARTNER ||
      UserManager.shared().user.accountType === AccountType.ACCOUNT
    ) {
      return true
    }
    return false
  }

  return (
    <>
      {shouldDisplayKPIBlocks() && <Box className="pageAction" justifyContent="flex-end" marginBottom="48px" display="flex" gap="25px"> 
       {(UserManager.shared().isRewaste() || UserManager.shared().isPartner()) && <AccountsFilter
        selectedIDs={filter.accountIds} 
        onSelectedItem={(accountIds) => {
          // console.log('selected accountIds :'+JSON.stringify(accountIds))
        }}
        onApplyClicked={((accountIds) => {
          upFilter("accountIds",accountIds)
        })}
        onResetClicked={((accountIds) => {
          upFilter("accountIds",accountIds)
        })}
      />}
      <LocationsFilter
        selectedIDs={filter.locationIds} 
        onSelectedItem={(locationIds) => {
          console.log('selected locationIds :'+JSON.stringify(locationIds))
        }}
        onApplyClicked={((locationIds) => {
          upFilter("locationIds",locationIds)
        })}
        onResetClicked={((locationIds) => {
          upFilter("locationIds",locationIds)
        })}
      />
      <InverseBtnDropDown
        buttonWidth="196px"
        startIcons={calendarIcon}
        endIcons={arrowDownIcon}
        label="Last Month"
        noRecordLabel="No Last Month Data" 
      /> 
      </Box>}
      {shouldDisplayKPIBlocks() && <Box className="reportMetrixRow" display="flex" justifyContent="space-between" gap="20px" marginBottom="58px">
          <ReportMetrix
            metrixTitle="Total Waste (KG) Received"
            metrixCount={TextUtils.displayMatrixData(dashboardMatrix.totalWasteReceived)}
            boxMaxWidth="340px"
            boxMinHeight="196px"
            variant="kpa"
            loading={isDMLoading}
          />  
          <ReportMetrix
            metrixTitle="Total Waste (KG) Sorted"
            metrixCount={TextUtils.displayMatrixData(dashboardMatrix.totalWasteSorted)}
            boxMaxWidth="340px"
            boxMinHeight="196px"
            variant="kpa"
            loading={isDMLoading}
          /> 
          <ReportMetrix
            metrixTitle="Total Waste (KG) Processed"
            metrixCount={TextUtils.displayMatrixData(dashboardMatrix.totalWasteProcessed)}
            boxMaxWidth="340px"
            boxMinHeight="196px"
            variant="kpa"
            loading={isDMLoading}
          /> 
          <ReportMetrix
            metrixTitle="Annualized Waste (KG) Diversion"
            metrixCount={TextUtils.displayMatrixData(dashboardMatrix.annualizedWastDiversion)}
            boxMaxWidth="340px"
            boxMinHeight="196px"
            variant="kpa"
            loading={isDMLoading}
          /> 
          <ReportMetrix
            metrixTitle="Annualized CO2 (KG) Sequestered"
            metrixCount={TextUtils.displayMatrixData(dashboardMatrix.annualizedSequestered)}
            boxMaxWidth="340px"
            boxMinHeight="196px"
            variant="kpa"
            loading={isDMLoading}
          />  
        </Box>}
      <Box
        className="reportsListing"
        sx={{
          background: "#fff",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
          borderRadius: "20px",
          padding: "38px 0 10px",
        }}
      >
        <Box
          className="BoxHeader"
          marginBottom="15px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "600",
              fontSize: "36px",
              color: "#171B1E",
              padding: "0 32px",
            }}
          >
            {Strings.REPORTS_LIST_HEADER_TITLE}
          </Typography>
          {isAddReportEnabled() && UserManager.shared().user.accountType === AccountType.ROOT_USER && (
            <Box className="pageAction" marginRight="32px" display="flex" gap="25px">
              {UserManager.shared().isRewaste() && <ClientsFilter
                selectedIDs={filter.clientIds} 
                onSelectedItem={(clientIds) => {
                  console.log('selected clientIds :'+clientIds)
                }}
                onApplyClicked={((clientIds) => {
                  upFilter("clientIds",clientIds)
                })}
                onResetClicked={((clientIds) => {
                  upFilter("clientIds",clientIds)
                })}
              />}
              {(UserManager.shared().isRewaste() || UserManager.shared().isPartner()) && <AccountsFilter
                selectedIDs={filter.accountIds} 
                onSelectedItem={(accountIds) => {
                  // console.log('selected accountIds :'+accountIds)
                }}
                onApplyClicked={((accountIds) => {
                  upFilter("accountIds",accountIds)
                })}
                onResetClicked={((accountIds) => {
                  upFilter("accountIds",accountIds)
                })}
              />}
              <LocationsFilter
                selectedIDs={filter.locationIds} 
                onSelectedItem={(locationIds) => {
                  console.log('selected locationIds :'+locationIds)
                }} 
                onApplyClicked={((locationIds) => {
                  upFilter("locationIds",locationIds)
                })}
                onResetClicked={((locationIds) => {
                  upFilter("locationIds",locationIds)
                })}
              />
              <PrimaryBtn
                label={Strings.ADD_REPORT_BTN_TITLE}
                buttonWidth="169px"
                onClick={() => {
                  Navigation.toAddReport(props.router)
                }}
              />
            </Box>
          )}
        </Box> 
        <Box className="listingTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Strings.TBL_HEADER_LOCATION_NAME}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_ACCOUNT_TITLE}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_REPORTED_ON_TITLE}</TableCell>
                  <TableCell width="200">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportList.reports.length > 0 ? (
                  reportList.reports.map((report, index) => (
                    <TableRow key={index + 1} >
                      <TableCell>{report.location.name}</TableCell>
                      <TableCell>{report.location.account.name}</TableCell>
                      <TableCell>{report.displayStringCreatedAt()}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewReport(props.router, {id:report.id})
                            }}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {Strings.TBL_VIEW_LINK_TITLE}
                          </Link>
                          <Link color="inherit" sx={{ cursor: "pointer" }} href={report.reportPdfUrl} target="_blank">
                            {Strings.TBL_DOWNLOAD_LINK_TITLE}
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <LoaderWithRecords
                    colSpanValue={4}
                    loaderValue={isLoading}
                  />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={reportList.perPageItems}
        currentPage={filter.page}
        currentPageItems={reportList.currentPageItems}
        totalRecordsCount={reportList.totalItems}
        totalPagesCount={reportList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  )
}
export default withRouter(Reports)
