import { Box, IconButton } from "@mui/material"
import { useState, useEffect } from "react"
import TextUtils from "../../../core/utils/TextUtils"
import { NavigationProps } from "../../../navigation/Navigation.types"
import withRouter from "../../../withRouter"
import { InverseBtn } from "../../common/button/InverseBtn"
import { PrimaryBtn } from "../../common/button/PrimaryBtn"
import { InputField } from "../../common/inputfield/inputField"
import PageHeading from "../../common/pageHeading/PageHeading"
import { PhoneInput } from "../../common/phoneInput/PhoneInput"
import UploadImage from "../../common/uploadImage/UploadImage"
import EditIcon from "@mui/icons-material/Edit"
import Navigation from "../../../navigation/Navigation"
import { IPartner } from "../../../core/models/Partner"
import GeneralUtils from "../../../core/utils/GeneralUtils"
import PartnerService from "../../../services/PartnerService"
import { ApiError } from "../../../core/webservice/ApiError"
import Partner from "../../../core/models/Partner"
import Loader from "../../common/loader/Loader"
import { useParams } from "react-router-dom"
import CountryCodeList from '../../../core/models/CountryCodeList';
import UserManager from "../../../core/utils/UserManager"
import { UserRole } from "../../../core/models/User"
import Strings from '../../../core/utils/Strings';
import { showApiErrorMessage, showMessage } from "../../common/customeToast/MessageNotifier"

interface INewPartnerProps {
  router: NavigationProps
}

function NewPartner(props: INewPartnerProps) {
  const { partnerId } = useParams()

  const [loading, setLoading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")
  const [editBtnActive, setEditBtnActive] = useState(false)

  const countryCodeList: CountryCodeList = new CountryCodeList()

  const [partner, setPartner] = useState<IPartner>({
    id: undefined,
    name: "",
    contactName: "",
    contactEmailId: "",
    contactPhoneNumCode: `${countryCodeList.dropDownItems[0].id}`,
    contactPhoneNum: "",
    logoImageId: "",
    logoUrl: "",
  })

  useEffect(() => {
    getPartnerDetails()
  }, [])

  useEffect(() => {
    if (!TextUtils.isEmpty(partner.logoImageId)) {
      saveOrUpdatePartner()
    }
  }, [partner.logoImageId])

  const upPartnerField = (field: string, value: any) => {
    setPartner({ ...partner, [field]: value })
  }

  const disableBtn = () => {
    if (!partner) return true
    if (
      partner.name.length > 0 &&
      partner.contactName.length > 0 &&
      partner.contactEmailId.length > 0 &&
      GeneralUtils.isValidEmailId(partner.contactEmailId)
    ) {
      return false
    } else {
      return true
    }
  }

  const isFormValidated = () => {
    let isValidated = true
    if (!partner ||
      TextUtils.isEmpty(partner.name) ||
      TextUtils.isEmpty(partner.contactName) ||
      TextUtils.isEmpty(partner.contactEmailId) ||
      (!TextUtils.isEmpty(partner.contactEmailId) && !GeneralUtils.isValidEmailId(partner.contactEmailId)) ||
      (!TextUtils.isEmpty(partner.contactPhoneNum) && partner.contactPhoneNum.length !== 10)) {
      isValidated = false
    }
    return isValidated
  }

  const readOnlyReturn = () => {
    if (!partner.id) {
      return false
    } else if (editBtnActive) {
      return false
    } else {
      return true
    }
  }
  const btnDisapper = () => {
    if (!partner.id) {
      return true
    } else if (partner.id) {
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

  const getPartnerDetails = () => {
    if (isNaN(Number(partnerId))) {
      return
    }
    setIsDataLoading(true)
    const pID = Number(partnerId)
    PartnerService.getPartnerDetails(pID)
      .then((partner: Partner) => {
        setIsDataLoading(false)
        const pObj = partner.getPartner()
        setPartner(pObj)
        setImageUrl(pObj.logoUrl)
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const handleImageUpload = () => {
    if (loading) return
    setLoading(true)
    PartnerService.uploadFile(selectedFile)
      .then((fileId: string) => {
        setLoading(false)
        if (fileId && fileId.length > 0) {
          upPartnerField("logoImageId", fileId)
        }
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        console.log(apiError.message)
      })
  }

  const saveOrUpdatePartner = () => {
    setLoading(true)
    PartnerService.createOrUpdatePartner(partner)
      .then((result: Partner) => {
        setLoading(false)
        Navigation.back(props.router)
        setTimeout(() => {
          showMessage((partner.id) ? 'Client Updated Successfully' : 'Client Added Successfully')
        }, 100)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showApiErrorMessage(apiError)
      })
  }

  const handleSaveOrUpdate = (e: any) => {
    e.preventDefault()
    if (selectedFile && TextUtils.isEmpty(partner.logoImageId)) {
      handleImageUpload()
    } else {
      saveOrUpdatePartner()
    }
  }

  const isEditButtonEnabled = () => {
    if ((UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
      UserManager.shared().user.userRole === UserRole.ADMIN) &&
      !editBtnActive && partner.id) {
      return true
    }
    return false
  }

  const isAddOrEditMode = () => {
    if (!partner.id || editBtnActive) {
      return true
    }
    return false
  }

  const isViewModeActive = () => {
    if(partner && partner.id && !editBtnActive) {
      return true
    }
    return false
  }

  if (isDataLoading) {
    return (
      <Loader pshow={isDataLoading} />
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <PageHeading
          backArrow={true}
          heading={
            !partner.id
              ? Strings.NEW_CLIENT_HEADER_TITLE
              : !editBtnActive
                ? Strings.VIEW_CLIENT_HEADER_TITLE
                : Strings.EDIT_CLIENT_HEADER_TITLE
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
        <Box width="62.40%" maxWidth="1198px" className="inputBox">
          <Box display="flex" gap="72px">
            <Box width="533px">
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Client Name`}
                placeholder="Name"
                required={true}
                value={partner.name}
                onChange={(e: any) => upPartnerField("name", e.target.value)}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
            <Box width="533px">
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``
                  } Client Contact Name`}
                placeholder="Client Contact Name"
                required={true}
                value={partner.contactName}
                onChange={(e: any) =>
                  upPartnerField("contactName", e.target.value)
                }
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width="533px">
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``
                  } Client Contact Email`}
                placeholder="Client Contact Email"
                required={true}
                value={partner.contactEmailId}
                InputProps={{
                  readOnly: (partner.id) ? true : readOnlyReturn(),
                }}
                onChange={(e: any) => {
                  upPartnerField("contactEmailId", e.target.value)
                }}
              />
            </Box>
            <Box width="533px">
              <PhoneInput
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``
                  }  Client Contact Mobile Number`}
                placeholder="Client Contact Mobile"
                required={false}
                value={readOnlyReturn() ? TextUtils.formatPhoneNumber(partner.contactPhoneNum) : partner.contactPhoneNum}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
                onChange={(e: any) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value == "" || regex.test(e.target.value)) {
                    upPartnerField("contactPhoneNum", e.target.value)
                  }
                  // if (e.target.value == "") { setClientNo("") }
                  // if (TextUtils.isDigitsOnly(e.target.value) && e.target.value.length <= 10) { setClientNo(e.target.value) }
                }}
                code={partner.contactPhoneNumCode}
                setCode={(code: string) => {
                  upPartnerField("contactPhoneNumCode", code)
                }}
                isEditable={isAddOrEditMode()}
              />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            {btnDisapper() && (
              <PrimaryBtn
                label={partner.id ? Strings.UPDATE : Strings.SAVE}
                buttonWidth="243px"
                onClick={(e: any) => handleSaveOrUpdate(e)}
                loading={loading}
                disabled={!isFormValidated()}
              />
            )}
            <InverseBtn label={Strings.CANCEL} buttonWidth="243px" onClick={() => { handleBackOrCancel() }} />
          </Box>
        </Box>
        <Box width="37.60%" maxWidth="608px" marginTop="55px">
        {isViewModeActive() && TextUtils.isEmpty(partner.logoUrl) ? (<></>) : (<UploadImage
            error={error}
            setError={setError}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imageTitle="Upload Logo"
            boxWidth="100%"
            boxHeight="200px"
            isEditable={isAddOrEditMode()}
          />)}
        </Box>
      </Box>
    </Box>
  )
}
export default withRouter(NewPartner)
