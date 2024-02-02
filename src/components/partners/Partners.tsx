import "./Partners.scss"
import withRouter from "../../withRouter"
import { Typography, Link, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import PartnerList from "../../core/models/PartnerList"
import PartnerService from "../../services/PartnerService"
import { ApiError } from "../../core/webservice/ApiError"
import { NavigationProps } from "../../navigation/Navigation.types"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import "../common/CommonTable.scss"
import PaginationBox from "../common/pagination/PaginationBox"
import Navigation from "../../navigation/Navigation"
import UserManager from "../../core/utils/UserManager"
import { AccountType, UserRole } from "../../core/models/User"
import Strings from "../../core/utils/Strings"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils"

interface IPartnersProps {
  router: NavigationProps
}

function Partners(props: IPartnersProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [partnerList, setPartnerList] = useState<PartnerList>(
    PartnerList.default()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    fetchPartnerList(filter.page)
  }, [filter])

  const fetchPartnerList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    PartnerService.getPartnerList(page)
      .then((newPartnerList: PartnerList) => {
        setIsLoading(false)
        setPartnerList(newPartnerList)
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toClients({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const isAddClientEnabled = () => {
    if (
      UserManager.shared().user.accountType === AccountType.ROOT_USER &&
      (UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN)
    ) {
      return true
    }
    return false
  }

  return (
    <>
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
            {Strings.CLIENTS_LIST_HEADER_TITLE}
          </Typography>
          <Box className="pageAction" marginRight="32px">
            {isAddClientEnabled() && (
              <PrimaryBtn
                label={Strings.ADD_CLIENT_BTN_TITLE}
                buttonWidth="169px"
                onClick={() => {
                  Navigation.toAddClient(props.router)
                }}
              />
            )}
          </Box>
        </Box>
        <Box className="listingTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Strings.TBL_HEADER_CLIENT_NAME}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_EMAIL}</TableCell>
                  <TableCell width="94">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {partnerList.partners.length > 0 ?
                  partnerList.partners.map((partner) => (
                    <TableRow key={partner.userId.toString()}>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>{partner.contactEmail}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewClient(
                                props.router,
                                partner.userId
                              )
                            }}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {Strings.TBL_VIEW_LINK_TITLE}
                          </Link>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                  :
                  <LoaderWithRecords colSpanValue={3} loaderValue={isLoading} />
                }
              </TableBody>

            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={partnerList.perPageItems}
        currentPage={filter.page}
        currentPageItems={partnerList.currentPageItems}
        totalRecordsCount={partnerList.totalItems}
        totalPagesCount={partnerList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  )
}
export default withRouter(Partners)
