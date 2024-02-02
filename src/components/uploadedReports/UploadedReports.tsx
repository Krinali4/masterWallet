import { Box, Pagination, Typography } from "@mui/material"
import Navigation from "../../navigation/Navigation"
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import withRouter from "../../withRouter"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import { InverseBtnDropDown } from "../common/customDropDown/filterDropdown/InverseBtnDropDown"
import PageHeading from "../common/pageHeading/PageHeading"
import PaginationBox from "../common/pagination/PaginationBox"
import { Customer, LocationIcon, arrowDownIcon, buyer } from "./icons"
import UploadDataTable from "./uploadDataTable/UploadDataTable"
import BatchList from "../../core/models/BatchList"
import { useState, useEffect } from "react"
import UploadDataService from "../../services/UploadDataService"
import { ApiError } from "../../core/webservice/ApiError"
import QueryParamUtils, { IQueryParams } from '../../core/utils/QueryParamUtils';
import AccountsFilter from "../common/filters/AccountsFilter"
import LocationsFilter from "../common/filters/LocationFilter"
import ClientsFilter from "../common/filters/ClientsFilter"
interface IProps {
  router: NavigationProps
  states: NavigationState
}

function UploadedReports(props: IProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [batchList, setBatchList] = useState<BatchList>(BatchList.default())
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)

  // componentDidMount
  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    fetchBatchList(filter.page)
  }, [filter])

  const fetchBatchList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    UploadDataService.getBatchList(filter)
      .then((newBatchList: BatchList) => {
        setIsLoading(false)
        setBatchList(newBatchList)
        console.log(JSON.stringify(newBatchList))
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toUplodedReports({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const upFilter = (field: string, value: any) => {
    const newFilter = {...filter, [field]: value}
    console.log('upFilter :'+newFilter)
    Navigation.toUplodedReports({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }


  return (
    <Box className="homeLayout">
      <Box
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
            {`Data Uploaded`}
          </Typography>
          {/* <PageHeading heading="Data Uploaded" padding="0 32px" /> */}
          <Box
            className="pageAction"
            marginRight="32px"
            display="flex"
            gap="25px"
          >
            <ClientsFilter
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
              />
            {<AccountsFilter
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
              buttonWidth="196px"
              label="Upload Data"
              onClick={() => Navigation.toNewUploadReport(props.router)}
            />
          </Box>
        </Box>

        <Box className="tableLayout" paddingTop="41px">
          <UploadDataTable
            router={props.router}
            batchList={batchList}
            isLoading={isLoading}
          />
        </Box>
      </Box>

      <PaginationBox
        perPageRecords={batchList.perPageItems}
        currentPage={filter.page}
        currentPageItems={batchList.currentPageItems}
        totalRecordsCount={batchList.totalItems}
        totalPagesCount={batchList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </Box>
  )
}
export default withRouter(UploadedReports)
