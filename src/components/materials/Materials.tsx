import "./Materials.scss"
import withRouter from "../../withRouter"
import { NavigationProps } from "../../navigation/Navigation.types"
import { useState, useEffect } from "react"
import MaterialList from "../../core/models/MaterialList"
import MaterialService from "../../services/MaterialService"
import { ApiError } from "../../core/webservice/ApiError"
import UserManager from "../../core/utils/UserManager"
import { AccountType, UserRole } from "../../core/models/User"
import { Typography, Link, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import "../common/CommonTable.scss"
import PaginationBox from "../common/pagination/PaginationBox"
import Strings from '../../core/utils/Strings';
import Navigation from "../../navigation/Navigation"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils"

interface IMaterialsProps {
  router: NavigationProps
}

function Materials(props: IMaterialsProps) {
  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [materialList, setMaterialList] = useState<MaterialList>(
    MaterialList.default()
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
    fetchMaterialList(filter.page)
  }, [filter])

  const fetchMaterialList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    MaterialService.getMaterialList(page)
      .then((newMaterialList: MaterialList) => {
        setIsLoading(false)
        setMaterialList(newMaterialList)
          })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
         })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toMaterials({router:props.router,toBeReplaced:false,queryParams:newFilter})
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
            {Strings.MATERIALS_LIST_HEADER_TITLE}
          </Typography>
          <Box className="pageAction" marginRight="32px" display={"flex"} gap="15px">
            {isAddAccountEnabled() && (
              <PrimaryBtn
                label={Strings.ADD_MATERIAL_BTN_TITLE}
                buttonWidth="169px"
                onClick={() => {
                  Navigation.toAddNewMaterial({router:props.router})
                }}
              />
            )}
            {isAddAccountEnabled() && (
                <PrimaryBtn
                  label={'Material Types'}
                  buttonWidth="169px"
                  onClick={() => {
                    Navigation.toMaterialTypes({router:props.router,toBeReplaced:false})
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
                  <TableCell>{Strings.TBL_HEADER_MATERIAL_NAME}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_MATERIAL_DEFAULT_SCALE}</TableCell>
                  <TableCell>{Strings.TBL_HEADER_MATERIAL_TYPE}</TableCell>
                  <TableCell width="94">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialList.materials.length > 0 ?
                  materialList.materials.map((material) => (
                    <TableRow key={material.id.toString()}>
                      <TableCell>{material.name}</TableCell>
                      <TableCell>{material.defaultWeightScale}</TableCell>
                      <TableCell>{material.materialType.name}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {
                              Navigation.toViewMaterial(
                                props.router,
                                material.id
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
                  <LoaderWithRecords colSpanValue={4} loaderValue={isLoading} />
                }
                
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={materialList.perPageItems}
        currentPage={filter.page}
        currentPageItems={materialList.currentPageItems}
        totalRecordsCount={materialList.totalItems}
        totalPagesCount={materialList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
    </>
  )
}
export default withRouter(Materials)
