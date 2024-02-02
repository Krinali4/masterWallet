import { Link, Typography, Box, Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper } from "@mui/material"
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import Navigation from "../../navigation/Navigation"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import PaginationBox from "../common/pagination/PaginationBox"
import withRouter from "../../withRouter"
import "./Users.scss"
import UserList from "../../core/models/UserList"
import { useState, useEffect } from "react"
import UserService from '../../services/UserService';
import { AccountType, UserRole } from "../../core/models/User"
import UserManager from '../../core/utils/UserManager';
import { ApiError } from "../../core/webservice/ApiError"
import Strings from "../../core/utils/Strings"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import AlertController from "../common/alertController/AlertController"
import { showMessage } from "../common/customeToast/MessageNotifier"
import User from '../../core/models/User';
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils"

interface IUsersProps {
  router: NavigationProps
  states: NavigationState
}

function Users(props: IUsersProps) {

  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [userList, setUserList] = useState<UserList>(UserList.default())
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)

  const [displayModel, setDisplayModel] = useState(false);
  const [userToBeUpdated, setUserTobeUpdated] = useState<User|undefined>(undefined);

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    fetchUserList(filter.page)
  }, [filter])

  const fetchUserList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    UserService.getUserList(page, UserManager.shared().user.accountType)
      .then((newUserList: UserList) => {
        setIsLoading(false)
        setUserList(newUserList)
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toUsers({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const handleOnAddUserClicked = () => {
    Navigation.toNewUser(props.router)
  }

  const getHeadingTitle = () => {
    if (UserManager.shared().user.accountType === AccountType.ROOT_USER) {
      return Strings.USERS_LIST_HEADER_TITLE
    } else if (UserManager.shared().user.accountType === AccountType.PARTNER) {
      return Strings.USERS_LIST_HEADER_TITLE
    } else {
      return Strings.USERS_LIST_HEADER_TITLE
    }
  }

  const isAddUserEnabled = () => {
    if (
      UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
      UserManager.shared().user.userRole === UserRole.ADMIN
    ) {
      return true
    }
    return false
  }

  const isRevokeAccessEnabled = (u: User) => {
    if (
      UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
      UserManager.shared().user.userRole === UserRole.ADMIN
    ) {
      if(UserManager.shared().isLoggedInUser(u.id)) {
        return false
      }
      return true
    }
    return false
  }

  const handleRevokeOrGrantAction = (user: User) => {
    setUserTobeUpdated(user)
    setDisplayModel(true);
  }

  const onYesClick = () => {
    if(isUpdating) return;
    setIsUpdating(true);
    UserService.revokeOrGrantAccess(userToBeUpdated.getUser(),UserManager.shared().user.accountType)
    .then((newUser: User) => {
      setIsUpdating(false);
      setDisplayModel(false);
      setUserTobeUpdated(undefined)
      fetchUserList(filter.page) // update the user list
      setTimeout(() => {
        showMessage((newUser.isActive) ? "User Activated Successfully" :"User Deactivated Successfully");
      }, 200)
    })
    .catch((apiError: ApiError) => {
      setIsUpdating(false)
      setDisplayModel(false);
      setUserTobeUpdated(undefined)
      console.log(apiError.message)
    })
  }

  const onCancelClick = () => {
    setDisplayModel(false)
    setIsUpdating(false)
    setUserTobeUpdated(undefined)
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
            {getHeadingTitle()}
          </Typography>
          <Box className="pageAction" marginRight="32px">
            {isAddUserEnabled() && (
              <PrimaryBtn
                label={Strings.ADD_USER_BTN_TITLE}
                buttonWidth="169px"
                onClick={() => {
                  handleOnAddUserClicked()
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
                  <TableCell width="33%">{Strings.TBL_HEADER_NAME}</TableCell>
                  <TableCell width="33%">{Strings.TBL_HEADER_EMAIL}</TableCell>
                  <TableCell width="13%">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.users.length > 0 ?
                  userList.users.map((user) => (
                    <TableRow key={user.id.toString()}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewUser(props.router, user.id)
                            }}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {Strings.TBL_VIEW_LINK_TITLE}
                          </Link>
                          {isRevokeAccessEnabled(user) && (
                            <Link color="inherit" sx={{ cursor: "pointer" }} onClick={() => handleRevokeOrGrantAction(user)}>
                              {user.isActive ? Strings.TBL_REVOKE_ACCESS_LINK_TITLE : Strings.TBL_GRANT_ACCESS_LINK_TITLE}
                            </Link>
                          )}
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
        perPageRecords={userList.perPageItems}
        currentPage={filter.page}
        currentPageItems={userList.currentPageItems}
        totalRecordsCount={userList.totalItems}
        totalPagesCount={userList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
      {userToBeUpdated && <AlertController
        pTitle={(userToBeUpdated && userToBeUpdated.isActive) ? "Do you want to deactivate the user login?" : "Do you want to activate the user login?"}
        pShow={displayModel}
        pCancelButtonTitle="Cancel"
        pYesButtonTitle="Yes"
        pLoading={isUpdating}
        onYesClick={onYesClick}
        onCancelClick={onCancelClick}
      />}

    </>
  )
}


export default withRouter(Users)