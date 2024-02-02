import { Box, IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import TextUtils from "../../../core/utils/TextUtils"
import { NavigationProps } from "../../../navigation/Navigation.types"
import withRouter from "../../../withRouter"
import { InverseBtn } from "../../common/button/InverseBtn"
import { PrimaryBtn } from "../../common/button/PrimaryBtn"
import CustomDropDown from "../../common/customDropDown/CustomDropDown"
import { InputField } from "../../common/inputfield/inputField"
import PageHeading from "../../common/pageHeading/PageHeading"
import EditIcon from "@mui/icons-material/Edit"
import Navigation from "../../../navigation/Navigation"
import { useParams } from "react-router-dom"
import { ApiError } from "../../../core/webservice/ApiError"
import Loader from "../../common/loader/Loader"
import UserManager from "../../../core/utils/UserManager"
import { UserRole } from "../../../core/models/User"
import Strings from '../../../core/utils/Strings';
import { IMaterial, WeightScale } from '../../../core/models/Material';
import MaterialService from '../../../services/MaterialService';
import Material from '../../../core/models/Material';
import { showApiErrorMessage, showMessage } from "../../common/customeToast/MessageNotifier"
import MaterialTypeService from '../../../services/MaterialTypeService';
import MaterialTypeList from "../../../core/models/MaterialTypeList"

interface INewMaterialProps {
  router: NavigationProps
}

function NewMaterial(props: INewMaterialProps) {
  const { materialId } = useParams()

  const [loading, setLoading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
  const [editBtnActive, setEditBtnActive] = useState(false)
  const [materialTypesList, setMaterialTypesList] = useState<MaterialTypeList>(MaterialTypeList.default())

  const [material, setMaterial] = useState<IMaterial>({
    id: undefined,
    name: "",
    materialType: undefined,
    defaultWeightScale: WeightScale.KG,
  })

  useEffect(() => {
    getInitialData()
  }, [])

  const upMaterialField = (field: string, value: any) => {
    setMaterial({ ...material, [field]: value })
  }

  const upMaterialMaterialTypeField = (value: any) => {
    let mt = materialTypesList.findMaterialTypeById(value)
    setMaterial({ ...material, materialType: mt.getMaterialType() })
  }

  const isFormValidated = () => {
    let isValidated = true
    if (
      !material ||
      !material.materialType || 
      TextUtils.isEmpty(material.defaultWeightScale)
    ) {
      isValidated = false
    }
    return isValidated
  }
  const readOnlyReturn = () => {
    if (!material.id) {
      return false
    } else if (editBtnActive) {
      return false
    } else {
      return true
    }
  }
  const btnDisapper = () => {
    if (!material.id) {
      return true
    } else if (material.id) {
      if (!editBtnActive) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const handleBackOrCancel = () => {
    if (editBtnActive) {
      setEditBtnActive(false)
    } else {
      Navigation.back(props.router)
    }
  }

  const getInitialData = () => {
    setIsDataLoading(true)
    let mID: number = undefined
    if (!isNaN(Number(materialId))) {
        mID = Number(materialId)
    }
    Promise.all([
        mID ? MaterialService.getMaterialDetails(mID) : Promise.resolve(),
        MaterialTypeService.getAllMaterialTypeList()
    ])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        if (_results[0]) {
          const rMaterial: Material = _results[0]
          const mObj = rMaterial.getMaterial()
          setMaterial(mObj)
        }
        if (_results[1]) {
          const rMaterialTypeList: MaterialTypeList = _results[1]
          setMaterialTypesList(rMaterialTypeList)
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const saveOrUpdateMaterial = () => {
    setLoading(true)
    MaterialService.createOrUpdateMaterial(material)
      .then((result: Material) => {
        setLoading(false)
        Navigation.back(props.router)
        setTimeout(() => {
          showMessage((material.id) ? 'Material Updated Successfully': 'Material Added Successfully')
        },100)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showApiErrorMessage(apiError)
      })
  }

  const handleSaveOrUpdate = (e: any) => {
    e.preventDefault()
    saveOrUpdateMaterial()
  }

  const isEditButtonEnabled = () => {
    if((UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN) && 
        !editBtnActive && material.id) {
      return true
    }
    return false
  }

  const isAddOrEditMode = () => {
    if(!material.id || editBtnActive) {
      return true
    }
    return false
  }

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <PageHeading
          backArrow={true}
          heading={
            !material.id
              ? Strings.NEW_MATERIAL_HEADER_TITLE
              : !editBtnActive
              ? Strings.VIEW_MATERIAL_HEADER_TITLE
              : Strings.EDIT_MATERIAL_HEADER_TITLE
          }
          onClick={() => {
            handleBackOrCancel()
          }}
        />
        {isEditButtonEnabled() && (
          <IconButton className="editIcon" onClick={() => setEditBtnActive(!editBtnActive)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>
      <Box className="mainContainer" display="flex" gap="72px" marginTop="43px">
        <Box width="100%" maxWidth="1198px" className="inputBox">
          <Box display="flex" gap="72px">
            <Box width="533px">
                <InputField
                    inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Material Name`}
                    placeholder="Material Name"
                    required={true}
                    value={material.name}
                    onChange={(e: any) => upMaterialField("name", e.target.value)}
                    InputProps={{
                        readOnly: readOnlyReturn(),
                    }}
                />
            </Box>
            <Box width="533px">
                <CustomDropDown
                    data={materialTypesList.dropDownItems}
                    heading={`${!readOnlyReturn() ? `Select` : ``} Material Type `}
                    placeholder="Select Material Type"
                    value={material.materialType ? material.materialType.id : ""}
                    onChange={(e: any) => upMaterialMaterialTypeField(e.target.value)}
                    disabled={readOnlyReturn()}
                />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width="533px">
                <CustomDropDown
                    data={Material.weightScaleList()}
                    heading={`${!readOnlyReturn() ? `Select` : ``} Default Scale `}
                    placeholder="Select Default Scale"
                    value={material.defaultWeightScale ? material.defaultWeightScale : ""}
                    onChange={(e: any) => upMaterialField('defaultWeightScale',e.target.value)}
                    disabled={readOnlyReturn()}
                />
            </Box>
            <Box width="533px">
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            {btnDisapper() && (
              <PrimaryBtn
                label={material.id ? Strings.UPDATE : Strings.SAVE}
                buttonWidth="243px"
                onClick={(e: any) => handleSaveOrUpdate(e)}
                loading={loading}
                disabled={!isFormValidated()}
              />
            )}
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
    </Box>
  )
}
export default withRouter(NewMaterial)
