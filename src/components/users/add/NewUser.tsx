import React, { useState, useEffect } from "react";
import { Box, IconButton, FormControl } from "@mui/material";
import "./NewUser.scss";
import {
  NavigationProps,
  NavigationState,
} from "../../../navigation/Navigation.types";
import Navigation from "../../../navigation/Navigation";
import PageHeading from "../../common/pageHeading/PageHeading";
import { InputField } from "../../common/inputfield/inputField";
import { PrimaryBtn } from "../../common/button/PrimaryBtn";
import { InverseBtn } from "../../common/button/InverseBtn";
import withRouter from "../../../withRouter";
import { PhoneInput } from "../../common/phoneInput/PhoneInput";
import { useParams } from "react-router-dom"
import CountryCodeList from "../../../core/models/CountryCodeList";
import { IUser, UserRole } from '../../../core/models/User';
import UserService from '../../../services/UserService';
import UserManager from '../../../core/utils/UserManager';
import User from '../../../core/models/User';
import { ApiError } from '../../../core/webservice/ApiError';
import Loader from "../../common/loader/Loader";
import TextUtils from "../../../core/utils/TextUtils";
import EditIcon from '@mui/icons-material/Edit';
import Strings from "../../../core/utils/Strings";
import CustomDropDown from "../../common/customDropDown/CustomDropDown";
import AccessLevelList from "../../../core/models/AcessLevelList";
import GeneralUtils from "../../../core/utils/GeneralUtils";
import { showApiErrorMessage, showMessage } from "../../common/customeToast/MessageNotifier";

interface INewUserProps {
  router: NavigationProps;
  states: NavigationState;
}
function NewUser(props: INewUserProps) {
  const { userId } = useParams()

  const accessLevelList: AccessLevelList = new AccessLevelList();

  // const [accLevel, setAccLevel] = useState();

  // console.log(accLevel);
  const [loading, setLoading] = useState<boolean>(false)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false)

  const [editBtnActive, setEditBtnActive] = useState(false)

  const countryCodeList: CountryCodeList = new CountryCodeList();

  const [user, setUser] = useState<IUser>({
    id: undefined,
    name: "",
    email: "",
    title: "",
    phoneNumCode: `${countryCodeList.dropDownItems[0].id}`,
    phoneNum: "",
    userRole: UserRole.USER,
  })

  useEffect(() => {
    getInitialData()
  }, [])

  const getInitialData = () => {
    setIsDataLoading(true)
    let uID: number = undefined
    if (!isNaN(Number(userId))) {
      uID = Number(userId)
    }
    Promise.all([
      uID ? UserService.getUserDetails(uID, UserManager.shared().user.accountType) : Promise.resolve(),
    ])
      .then((_results: any[]) => {
        setIsDataLoading(false)
        if (_results[0]) {
          const rUser: User = _results[0]
          const uObj = rUser.getUser()
          setUser(uObj)
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false)
        console.log(apiError.message)
      })
  }

  const upUserField = (field: string, value: any) => {
    setUser({ ...user, [field]: value })
  }

  const saveOrUpdateUser = () => {
    setLoading(true)
    UserService.createOrUpdateUser(user, UserManager.shared().user.accountType)
      .then((result: User) => {
        setLoading(false)
        Navigation.back(props.router)
        setTimeout(() => {
          showMessage((user.id) ? 'User Updated Successfully' : 'User Added Successfully')
        }, 100)
      })
      .catch((apiError: ApiError) => {
        setLoading(false)
        showApiErrorMessage(apiError)
      })
  }

  const handleSaveOrUpdate = (e: any) => {
    e.preventDefault()
    saveOrUpdateUser()
  }

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />
  }

  const handleBackOrCancel = () => {
    Navigation.back(props.router);
  };

  const formIsValid = () => {
    let isValidated = true
    if (!user ||
      TextUtils.isEmpty(user.name) ||
      TextUtils.isEmpty(user.email) ||
      TextUtils.isEmpty(user.userRole) ||
      (!TextUtils.isEmpty(user.email) && !GeneralUtils.isValidEmailId(user.email)) ||
      (!TextUtils.isEmpty(user.phoneNum) && user.phoneNum.length !== 10)) {
      isValidated = false
    }
    return isValidated
  };

  const readOnlyReturn = () => {
    if (!user.id) {
      return false
    } else if (editBtnActive) {
      return false
    } else {
      return true
    }
  }
  const btnDisapper = () => {
    if (!user.id) {
      return true
    } else if (user.id) {
      if (!editBtnActive) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const isEditButtonEnabled = () => {
    if ((UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
      UserManager.shared().user.userRole === UserRole.ADMIN) &&
      !editBtnActive && user.id) {
        if(UserManager.shared().isLoggedInUser(user.id)) {
          return false
        }
      return true
    }
    return false
  }

  const isAddOrEditMode = () => {
    if (!user.id || editBtnActive) {
      return true
    }
    return false
  }

  return (
    <>
      <Box >
        <Box display="flex" justifyContent="space-between">
          <PageHeading
            heading={
              !user.id
                ? Strings.NEW_USER_HEADER_TITLE
                : !editBtnActive
                  ? Strings.VIEW_USER_HEADER_TITLE
                  : Strings.EDIT_USER_HEADER_TITLE
            }
            backArrow={true}
            onClick={() => {
              Navigation.back(props.router);
            }}
          />
          {isEditButtonEnabled() && (
            <IconButton className="editIcon" onClick={() => setEditBtnActive(!editBtnActive)}>
              <EditIcon />
            </IconButton>
          )}
        </Box>
        <FormControl
          variant="standard"
          sx={{
            marginTop: "20px",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "76px",
            }}
          >
            <Box width={"533px"} marginBottom="40px">
              <InputField
                placeholder="Name"
                value={user.name}
                onChange={(e: any) => upUserField('name', e.target.value)}
                name="name"
                type="text"
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Name`}
                required={true}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
            <Box width={"533px"} marginBottom="40px">
              <InputField
                placeholder="Title"
                value={user.title}
                onChange={(e: any) => upUserField('title', e.target.value)}
                name="title"
                type="text"
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Title`}
                required={false}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
            <Box width={"533px"} marginBottom="40px">
              <InputField
                placeholder="Email"
                onChange={(e: any) => upUserField('email', e.target.value)}
                value={user.email}
                name="email"
                type="email"
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``} Email`}
                required={true}
                InputProps={{
                  readOnly: user.id ? true : readOnlyReturn(),
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "76px",
            }}
          >
            <Box width={"533px"} marginBottom="40px">
              <PhoneInput
                inputLabel={`${!readOnlyReturn() ? `Enter` : ``
                  } Mobile Number`}
                placeholder="Mobile"
                required={false}
                code={user.phoneNumCode}
                setCode={(code: string) => {
                  upUserField("phoneNumCode", code)
                }}
                value={readOnlyReturn() ? TextUtils.formatPhoneNumber(user.phoneNum) : user.phoneNum}
                onChange={(e: any) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value == "" || regex.test(e.target.value)) {
                    upUserField("phoneNum", e.target.value)
                  }
                }}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
                isEditable={isAddOrEditMode()}
              />
            </Box>
            <Box width={"533px"} marginBottom="40px">
              <CustomDropDown
                heading={`${!readOnlyReturn() ? `Select` : ``
                  } Access Level `}
                placeholder="Select Access Level"
                data={accessLevelList.dropDownItems}
                value={user.userRole}
                onChange={(e: any) => {
                  upUserField("userRole", e.target.value)
                }}
                disabled={!isAddOrEditMode()}
              />
            </Box>
            <Box width={"533px"} marginBottom="40px"></Box>
          </Box>
          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            {btnDisapper() && <PrimaryBtn
              label={user.id ? Strings.UPDATE : Strings.SAVE}
              buttonWidth="243px"
              disabled={!formIsValid()}
              onClick={(e: any) => { handleSaveOrUpdate(e) }}
              loading={loading}
            />}
            <Box>
              <InverseBtn
                label={Strings.CANCEL}
                buttonWidth="243px"
                onClick={() => {
                  handleBackOrCancel();
                }}
              />
            </Box>
          </Box>
        </FormControl>
      </Box>
    </>
  );
}
export default withRouter(NewUser);
