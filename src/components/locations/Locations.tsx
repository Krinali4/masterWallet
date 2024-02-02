import { Link, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types";
import withRouter from "../../withRouter";
import { PrimaryBtn } from "../common/button/PrimaryBtn";
import "./Locations.scss";
import PaginationBox from "../common/pagination/PaginationBox";
import Navigation from "../../navigation/Navigation";
import { useEffect, useState } from "react";
import LocationList from '../../core/models/LocationList';
import LocationService from '../../services/LocationService';
import { ApiError } from '../../core/webservice/ApiError';
import UserManager from "../../core/utils/UserManager";
import { AccountType, UserRole } from '../../core/models/User';
import Strings from '../../core/utils/Strings';
import LoaderWithRecords from "../common/loader/LoaderWithRecords";
import AccountService from "../../services/AccountService";
import AccountList from '../../core/models/AccountList';
import TextUtils from "../../core/utils/TextUtils";
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils";

interface ILocationsProps {
  router: NavigationProps;
  states: NavigationState;
}

function Locations(props: ILocationsProps) {
  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [locationList, setLocationList] = useState<LocationList>(
    LocationList.default()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)
  const [accountList, setAccountList] = useState<AccountList>(undefined)
  const [error, setError] = useState('')

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    if(!accountList) {
      fetchAllAccountsList()
    } else {
      fetchLocationList(filter.page)
    }
  }, [filter])

  useEffect(() => {
    if(accountList) {
      fetchLocationList(filter.page)
    }
  }, [accountList])

  useEffect(() => {
    if(!TextUtils.isEmpty(error)) {
      setError(error)
    }
  }, [error])

  const fetchAllAccountsList = async () => {
    // incase of partner role first get the full account list
    setError('')
    if(UserManager.shared().user.accountType === AccountType.PARTNER) {
        setIsLoading(true)
        AccountService.getFullAccountList()
        .then((accountList: AccountList) => {
          setIsLoading(false)
          setAccountList(accountList)
        })
        .catch((apiError: ApiError) => {
          setIsLoading(false)
          setAccountList(undefined)
          setError(apiError ? apiError.message : Strings.DEFAULT_ERROR_MSG)
        })
    } else if(UserManager.shared().user.accountType === AccountType.ACCOUNT) {
      setAccountList(AccountList.accountListWithID(UserManager.shared().user.accountEntityId))
    } else {
      setAccountList(AccountList.default())
    }
  }

  const fetchLocationList = (page: number) => {
    setError('')
    if (isLoading) return
    setIsLoading(true)
    LocationService.getLocationList(page,accountList)
      .then((newLocationList: LocationList) => {
        setIsLoading(false)
        setLocationList(newLocationList)
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        setError(apiError ? apiError.message : Strings.DEFAULT_ERROR_MSG)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toLocations({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const handleOnNewLocationClicked = () => {
    Navigation.toAddLocation(props.router);
  };

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
            {Strings.LOCATIONS_LIST_HEADER_TITLE}
          </Typography>
          <Box className="pageAction" marginRight="32px" display="flex" gap="15px">
            {/* PAR-104 {(UserManager.shared().user.accountType !== AccountType.ACCOUNT) && <InverseBtnDropDown
              buttonWidth="196px"
              label="Accounts"
              endIcons={arrowDownIcon}
              startIcons={buyer}
              onClick={() =>{}}
            />} */}
            {isAddAccountEnabled() && <PrimaryBtn
              label={Strings.ADD_LOCATION_BTN_TITLE}
              buttonWidth="169px"
              onClick={handleOnNewLocationClicked}
            />}
          </Box>
        </Box>
        <Box className="listingTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{Strings.TBL_HEADER_LOCATION_NAME}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_LOCATION_COUNTRY}</TableCell>
                  <TableCell width="94">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locationList.locations.length > 0 ?
                  locationList.locations.map((location) => (
                    <TableRow key={location.id.toString()}>
                      <TableCell>{location.name}</TableCell>
                      <TableCell>{location.country}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewLocation(props.router, location.id);
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
        perPageRecords={locationList.perPageItems}
        currentPage={filter.page}
        currentPageItems={locationList.currentPageItems}
        totalRecordsCount={locationList.totalItems}
        totalPagesCount={locationList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  );
}
export default withRouter(Locations);
