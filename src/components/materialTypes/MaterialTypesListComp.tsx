import { useState, useEffect } from "react"
import "./MaterialTypesListComp.scss"
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import Navigation from "../../navigation/Navigation"
import withRouter from "../../withRouter"
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import LoaderWithRecords from "../common/loader/LoaderWithRecords"
import PaginationBox from "../common/pagination/PaginationBox"
import Strings from "../../core/utils/Strings"
import "../common/CommonTable.scss"
import { ApiError } from '../../core/webservice/ApiError';
import MaterialTypeList from "../../core/models/MaterialTypeList"
import NewMaterialType from './add/NewMaterialType';
import MaterialType from "../../core/models/MaterialType"
import { showMessage } from '../common/customeToast/MessageNotifier';
import MaterialTypeService from '../../services/MaterialTypeService';
import UserManager from "../../core/utils/UserManager"
import { UserRole, AccountType } from '../../core/models/User';
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import PageHeading from "../common/pageHeading/PageHeading"
import QueryParamUtils, { IQueryParams } from "../../core/utils/QueryParamUtils"

interface ITagsProps {
  router: NavigationProps
  states: NavigationState
}

function MaterialTypesListComp(props: ITagsProps) {
  const qParams = QueryParamUtils.getQueryParams(props.router.location.search)
  const [materialTypesList, setMaterialTypesList] = useState<MaterialTypeList>(MaterialTypeList.default())
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<IQueryParams>(qParams)
  const [showAddEditModel, setShowAddEditModel] = useState(false)
  const [selectedMaterialType, setSelectedMaterialType] = useState<MaterialType>(undefined)

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    let nqParams = QueryParamUtils.getQueryParams(props.router.location.search)
    setFilter(nqParams)
  }, [props.router.location.search])

  useEffect(() => {
    fetchMaterialTypesList(filter.page)
  }, [filter])

  const fetchMaterialTypesList = (page: number) => {
    if (isLoading) return
    setIsLoading(true)
    MaterialTypeService.getMaterialTypeList(page)
      .then((newMaterialTypeList: MaterialTypeList) => {
        setIsLoading(false)
        setMaterialTypesList(newMaterialTypeList)
      })
      .catch((apiError: ApiError) => {
        setIsLoading(false)
        console.log(apiError.message)
      })
  }

  const handleOnPageSelected = (page: number) => {
    const newFilter = {...filter}
    newFilter.page = page
    Navigation.toMaterialTypes({router:props.router,toBeReplaced:false,queryParams:newFilter})
  }

  const handleClose = () => {
    hideModal()
  }

  const handleEdit = (materialType: MaterialType) => {
    showEditModal(materialType)
  }

  const handleActivateOrDeactivate = (materialType: MaterialType) => {
    // pending
  }

  const isAddMaterialTypeEnabled = () => {
    if (
      UserManager.shared().user.accountType === AccountType.ROOT_USER &&
      (UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN)
    ) {
      return true
    }
    return false
  }

  const showAddModal = () => {
    setSelectedMaterialType(undefined)
    setShowAddEditModel(true)
  }

  const showEditModal = (mt: MaterialType) => {
    setShowAddEditModel(true)
    setSelectedMaterialType(mt)
  }

  const hideModal = () => {
    setShowAddEditModel(false)
    setTimeout(() => {
      setSelectedMaterialType(undefined)
    },1000)
  }

  const handleBackOrCancel = () => {
    Navigation.back(props.router)
  }

  return (
    <>
      <Box
        className="materialTypesListing"
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
          <Box marginLeft="32px" display={"flex"}>
          <PageHeading
          backArrow={true}
          heading={'All Material Types'}
          onClick={() => {
            handleBackOrCancel()
          }}
        />
          </Box>
          
          {/* <Typography
            variant="h2"
            sx={{
              fontWeight: "600",
              fontSize: "36px",
              color: "#171B1E",
              padding: "0 32px",
            }}
          >
            {'Material Types'}
          </Typography> */}
          <Box className="pageAction" marginRight="32px" display={"flex"} gap="15px">
            {isAddMaterialTypeEnabled() && (
              <PrimaryBtn
                label={'Add Material Type +'}
                buttonWidth="220px"
                onClick={() => {
                  showAddModal()
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
                  <TableCell>{'Name'}</TableCell>
                  <TableCell>{'Status'}</TableCell>
                  <TableCell width="200">{Strings.TBL_HEADER_ACTION}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materialTypesList.materialTypes.length > 0 ? (
                  materialTypesList.materialTypes.map((materialType, index) => (
                    <TableRow key={materialType.id.toString()}>
                      <TableCell>{materialType.name}</TableCell>
                      <TableCell>{materialType.isActive ? 'Active' : 'InActive'}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap="19px">
                          <Link
                            onClick={() => {handleEdit(materialType)}}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {'Edit'}
                          </Link>
                          {/* <Link
                            onClick={() => {handleActivateOrDeactivate(materialType)}}
                            color="inherit"
                            sx={{ cursor: "pointer" }}
                          >
                            {materialType.isActive ? 'Deactivate' : 'Activate'}
                          </Link> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <LoaderWithRecords colSpanValue={3} loaderValue={isLoading} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <PaginationBox
        perPageRecords={materialTypesList.perPageItems}
        currentPage={filter.page}
        currentPageItems={materialTypesList.currentPageItems}
        totalRecordsCount={materialTypesList.totalItems}
        totalPagesCount={materialTypesList.totalPagesCount}
        isDataLoading={isLoading}
        onPageSelected={handleOnPageSelected}
      />
      <NewMaterialType 
        show={showAddEditModel}
        pMaterialType={selectedMaterialType}
        onSuccess={(msg) => {
          showMessage(msg)
          handleClose()
          if(filter.page != 0) {
            handleOnPageSelected(0)
          } else {
            fetchMaterialTypesList(filter.page)
          }
        }} 
        onClose={() => {handleClose()}}
      />
    </>
  )
}
export default withRouter(MaterialTypesListComp)
