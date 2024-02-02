import "./Accounts.scss"
import "../common/CommonTable.scss"
import withRouter from "../../withRouter"
import { Typography, Link, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import { ApiError } from "../../core/webservice/ApiError"
import { NavigationProps } from "../../navigation/Navigation.types"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import PaginationBox from "../common/pagination/PaginationBox"
import AccountList from "../../core/models/AccountList"
import AccountService from "../../services/AccountService"
import Navigation from "../../navigation/Navigation"
import UserManager from "../../core/utils/UserManager"
import { UserRole, AccountType } from "../../core/models/User"
import Strings from "../../core/utils/Strings"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils"

interface IAccountsProps {
  router: NavigationProps
}

function Accounts(props: IAccountsProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [accountList, setAccountList] = useState<AccountList>(
    AccountList.default()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    const fetchAccountList = (page: number) => {
      if (isLoading) return
      setIsLoading(true)
      AccountService.getAccountList(page)
        .then((newAccountList: AccountList) => {
          setIsLoading(false)
          setAccountList(newAccountList)
        })
        .catch((apiError: ApiError) => {
          setIsLoading(false)
          console.log(apiError.message)
        })
    }
    fetchAccountList(filter.page)
  }, [filter])

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toAccounts({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const isAddAccountEnabled = () => {
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
            {Strings.ACCOUNTS_LIST_HEADER_TITLE}
          </Typography>
          <Box className="pageAction" marginRight="32px">
            {isAddAccountEnabled() && (
              <PrimaryBtn
                label={Strings.ADD_ACCOUNT_BTN_TITLE}
                buttonWidth="169px"
                onClick={() => {
                  Navigation.toAddAccount(props.router)
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
                  <TableCell>{Strings.TBL_HEADER_NAME}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_EMAIL}</TableCell>
                  <TableCell width="76">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountList.accounts.length > 0 ?
                  accountList.accounts.map((account) => (
                    <TableRow key={account.userId.toString()}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.contactEmail}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewAccount(
                                props.router,
                                account.userId
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
                  )) :
                  <LoaderWithRecords colSpanValue={3} loaderValue={isLoading} />
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={accountList.perPageItems}
        currentPage={filter.page}
        currentPageItems={accountList.currentPageItems}
        totalRecordsCount={accountList.totalItems}
        totalPagesCount={accountList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  )
}
export default withRouter(Accounts)
