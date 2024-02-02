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
import { PhoneInput } from "../../common/phoneInput/PhoneInput"
import UploadImage from "../../common/uploadImage/UploadImage"
import EditIcon from "@mui/icons-material/Edit"
import Navigation from "../../../navigation/Navigation"
import { useParams } from "react-router-dom"
import { IAccount } from "../../../core/models/Account"
import AccountService from "../../../services/AccountService"
import Account from "../../../core/models/Account"
import { ApiError } from "../../../core/webservice/ApiError"
import Loader from "../../common/loader/Loader"
import PartnerService from "../../../services/PartnerService"
import PartnerList from "../../../core/models/PartnerList"
import GeneralUtils from "../../../core/utils/GeneralUtils"
import CountryCodeList from '../../../core/models/CountryCodeList';
import UserManager from "../../../core/utils/UserManager"
import { UserRole, AccountType } from '../../../core/models/User';
import Strings from '../../../core/utils/Strings';
import { showApiErrorMessage, showMessage } from "../../common/customeToast/MessageNotifier"

interface INewAccountProps {
  router: NavigationProps
}

function NewAccount(props: INewAccountProps) {
  const { accountId } = useParams()

  const [loading, setLoading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")

  const [acceptedMaterial, setAcceptedMaterial] = useState("") // need to discard this
  const [editBtnActive, setEditBtnActive] = useState(false)

  const [partnerList, setPartnerList] = useState<PartnerList>(PartnerList.default())

  const countryCodeList: CountryCodeList = new CountryCodeList()

  const [account, setAccount] = useState<IAccount>({
    id: undefined,
    partner: undefined,
    name: "",
    contactName: "",
    contactEmailId: "",
    contactPhoneNumCode: `${countryCodeList.dropDownItems[0].id}`,
    contactPhoneNum: "",
    logoImageId: "",
    logoUrl: "",
  })

  useEffect(() => {
    getInitialData()
  }, [])

  useEffect(() => {
    if (!TextUtils.isEmpty(account.logoImageId)) {
      saveOrUpdateAccount()
    }
  }, [account.logoImageId])

  const upAccountField = (field: string, value: any) => {
    setAccount({ ...account, [field]: value })
  }

  const upAccountPartnerField = (value: any) => {
    let partner = partnerList.findPartnerById(value)
    setAccount({ ...account, partner: partner.getPartner() })
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

  const isFormValidated = () => {
    let isValidated = true
    if (!account || 
      !account.partner || 
      TextUtils.isEmpty(account.name) ||
      TextUtils.isEmpty(account.contactName) ||
      TextUtils.isEmpty(account.contactEmailId) ||
      (!TextUtils.isEmpty(account.contactEmailId) && !GeneralUtils.isValidEmailId(account.contactEmailId)) ||
      (!TextUtils.isEmpty(account.contactPhoneNum) && account.contactPhoneNum.length !== 10)) {
      isValidated = false
    }
    return isValidated
  }
  const readOnlyReturn = () => {
    if (!account.id) {
      return false
    } else if (editBtnActive) {
      return false
    } else {
      return true
    }
  }
  const btnDisapper = () => {
    if (!account.id) {
      return true
    } else if (account.id) {
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
    let aID: number = undefined
    if (!isNaN(Number(accountId))) {
      aID = Number(accountId)
    }
    Promise.all([
      aID ? AccountService.getAccountDetails(aID) : Promise.resolve(),
      (isAddAccountEnabled()) ? PartnerService.getFullPartnerList() : Promise.resolve(),
    ])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        if (_results[0]) {
          const rAccount: Account = _results[0]
          const aObj = rAccount.getAccount()
          setAccount(aObj)
          setImageUrl(aObj.logoUrl)

          const pList = PartnerList.initWithResult({total:1, data:[{id:aObj.partner.id,name:aObj.partner.name}]},null);
          setPartnerList(pList)
        }
        if (_results[1]) {
          let partnerList: PartnerList = _results[1]
          setPartnerList(partnerList)
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const handleImageUpload = () => {
    if (loading) return
    setLoading(true)
    AccountService.uploadFile(selectedFile)
      .then((fileId: string) => {
        setLoading(false)
        if (fileId && fileId.length > 0) {
          upAccountField("logoImageId", fileId)
        }
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        console.log(apiError.message)
      })
  }

  const saveOrUpdateAccount = () => {
    setLoading(true)
    AccountService.createOrUpdateAccount(account)
      .then((result: Account) => {
        setLoading(false)
        Navigation.back(props.router)
        setTimeout(() => {
          showMessage((account.id) ? 'Account Updated Successfully': 'Account Added Successfully')
        },100)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showApiErrorMessage(apiError) 
      })
  }

  const handleSaveOrUpdate = (e: any) => {
    e.preventDefault()
    if (selectedFile && TextUtils.isEmpty(account.logoImageId)) {
      handleImageUpload()
    } else {
      saveOrUpdateAccount()
    }
  }

  const isEditButtonEnabled = () => {
    if((UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN) && 
        !editBtnActive && account.id) {
      return true
    }
    return false
  }

  const isAddOrEditMode = () => {
    if(!account.id || editBtnActive) {
      return true
    }
    return false
  }

  const isViewModeActive = () => {
    if(account && account.id && !editBtnActive) {
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
            !account.id
              ? Strings.NEW_ACCOUNT_HEADER_TITLE
              : !editBtnActive
              ? Strings.VIEW_ACCOUNT_HEADER_TITLE
              : Strings.EDIT_ACCOUNT_HEADER_TITLE
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
              <CustomDropDown
                data={partnerList.dropDownItems}
                heading={`${
                  !readOnlyReturn() ? `Select` : ``
                } Client ID `}
                placeholder="Select Client ID"
                value={account.partner ? account.partner.id : ""}
                onChange={(e: any) => upAccountPartnerField(e.target.value)}
                disabled={account.id ? true : readOnlyReturn()}
              />
            </Box>
            <Box width="533px">
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Account Name`}
                placeholder="Account Name"
                required={true}
                value={account.name}
                onChange={(e: any) => upAccountField("name", e.target.value)}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width="533px">
              <InputField
                inputLabel={`${
                  !readOnlyReturn() ? `Enter` : ``
                } Account Contact Name`}
                placeholder="Contact Name"
                required={true}
                value={account.contactName}
                onChange={(e: any) =>
                  upAccountField("contactName", e.target.value)
                }
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
            <Box width="533px">
              <InputField
                inputLabel={`${
                  !readOnlyReturn() ? `Enter` : ``
                } Account Contact Email Address`}
                placeholder="Contact Email"
                required={true}
                value={account.contactEmailId}
                onChange={(e: any) => {
                  upAccountField("contactEmailId", e.target.value)
                }}
                InputProps={{
                  readOnly: account.id ? true : readOnlyReturn(),
                }}
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width="533px">
              <PhoneInput
                inputLabel={`${
                  !readOnlyReturn() ? `Enter` : ``
                } Account Contact Phone`}
                placeholder="Contact Phone"
                required={false}
                code={account.contactPhoneNumCode}
                setCode={(code: string) => {
                  upAccountField("contactPhoneNumCode", code)
                }}
                value={readOnlyReturn() ? TextUtils.formatPhoneNumber(account.contactPhoneNum) : account.contactPhoneNum}
                onChange={(e: any) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value == "" || regex.test(e.target.value)) {
                    upAccountField("contactPhoneNum", e.target.value)
                  }
                }}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
                isEditable={isAddOrEditMode()}
              />
            </Box>
            <Box sx={{width:"533px", opacity:"0"}}>Dummy Box</Box>

            {/* <Box width="533px">
              <InputField
                inputLabel="Select Accepted Materials "
                placeholder="Accepted Materials"
                required={false}
                value={acceptedMaterial}
                onChange={(e: any) => setAcceptedMaterial(e.target.value)}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box> */}
          </Box>
          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            {btnDisapper() && (
              <PrimaryBtn
                label={account.id ? Strings.UPDATE : Strings.SAVE}
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
        <Box width="37.60%" maxWidth="608px" marginTop="55px">
        {isViewModeActive() && TextUtils.isEmpty(account.logoUrl) ? (<></>) : (<UploadImage
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
export default withRouter(NewAccount)
