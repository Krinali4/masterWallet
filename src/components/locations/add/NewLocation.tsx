import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  NavigationProps,
  NavigationState,
} from "../../../navigation/Navigation.types";
import withRouter from "../../../withRouter";
import { Box, IconButton } from "@mui/material";
import { InputField } from "../../common/inputfield/inputField";
import Navigation from "../../../navigation/Navigation";
import { InverseBtn } from "../../common/button/InverseBtn";
import { PrimaryBtn } from "../../common/button/PrimaryBtn";
import PageHeading from "../../common/pageHeading/PageHeading";
import UploadImage from "../../common/uploadImage/UploadImage";
import Strings from "../../../core/utils/Strings";
import AccountList from "../../../core/models/AccountList";
import LocationService from "../../../services/LocationService";
import AccountService from "../../../services/AccountService";
import Location from "../../../core/models/Location";
import { ILocation, LocationType } from "../../../core/models/Location";
import { ApiError } from "../../../core/webservice/ApiError";
import CustomDropDown from "../../common/customDropDown/CustomDropDown";
import UserManager from "../../../core/utils/UserManager";
import { AccountType, UserRole } from "../../../core/models/User";
import PartnerList from "../../../core/models/PartnerList";
import PartnerService from "../../../services/PartnerService";
import EditIcon from "@mui/icons-material/Edit";
import TextUtils from '../../../core/utils/TextUtils';
import {
  showApiErrorMessage,
  showMessage,
} from "../../common/customeToast/MessageNotifier";
import Loader from "../../common/loader/Loader";
import GeoLocationResults from "../../common/geoLocationResults/GeoLocationResults";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import "./NewLocation.scss";
interface INewLocationProps {
  router: NavigationProps;
  states: NavigationState;
}

function NewLocation(props: INewLocationProps) {
  const { locationId } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [editBtnActive, setEditBtnActive] = useState(false);
  const [address, setAddress] = useState("");
  const [Autolocation, setAutoLocation] = useState([]);

  const [partnerList, setPartnerList] = useState<PartnerList>(
    PartnerList.default()
  );
  const [accountList, setAccountList] = useState<AccountList>(
    AccountList.default()
  );
  // const [location, setLocation] = useState<ILocation>({
  //   id: undefined,
  //   partner: undefined,
  //   account: undefined,
  //   name: "IKEA Edmonton",
  //   locationType: LocationType.PRODUCER,
  //   latitude: 53.44375,
  //   longitude: -133.48926,
  //   address: "1311 102 St NW, Edmonton, AB T6N 1M3, Canada",
  //   city: "Edmonton",
  //   state: "Alberta",
  //   country: "Canada",
  //   postalCode: "T5A 0A1",
  //   locationLogoFileId: "",
  //   logoUrl: "",
  // })

  const [location, setLocation] = useState<ILocation>({
    id: undefined,
    partner: undefined,
    account: undefined,
    name: "",
    locationType: LocationType.PRODUCER,
    latitude: undefined,
    longitude: undefined,
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    locationLogoFileId: "",
    logoUrl: "",
  });
  useEffect(() => {
    getInitialData();
  }, []);

  useEffect(() => {
    if (!TextUtils.isEmpty(location.locationLogoFileId)) {
      saveOrUpdateLocation();
    }
  }, [location.locationLogoFileId]);
  const getInitialData = () => {
    setIsDataLoading(true);
    let lID: number = undefined;
    if (!isNaN(Number(locationId))) {
      lID = Number(locationId);
    }
    Promise.all([
      lID ? LocationService.getLocationDetails(lID) : Promise.resolve(),
      isAddAccountEnabled()
        ? PartnerService.getFullPartnerList()
        : Promise.resolve(),
    ])
      .then((_results: any[]) => {
        setIsDataLoading(false);
        if (_results[0]) {
          const rLocation: Location = _results[0];
          const lObj = rLocation.getLocation();
          setLocation(lObj);
          setAddress(lObj.address);
          setImageUrl(lObj.logoUrl);
          getAccountListByPartner(lObj.account.partner.id);

          const pList = PartnerList.initWithResult(
            {
              total: 1,
              data: [
                {
                  id: lObj.account.partner.id,
                  name: lObj.account.partner.name,
                },
              ],
            },
            null
          );
          setPartnerList(pList);

          const aList = AccountList.initWithResult(
            {
              total: 1,
              data: [
                { id: lObj.account.id, name: lObj.account.name, partner: {} },
              ],
            },
            null
          );
          setAccountList(aList);
        }
        if (_results[1]) {
          let partnerList: PartnerList = _results[1];
          setPartnerList(partnerList);
        }
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false);
        console.log(apiError.message);
      });
  };

  const getAccountListByPartner = (partnerId: number) => {
    if (!isAddAccountEnabled()) return;
    AccountService.getFullAccountListByPartnerID(partnerId)
      .then((newAccountList: AccountList) => {
        setAccountList(newAccountList);
      })
      .catch((apiError: ApiError) => {
        setIsDataLoading(false);
        console.log(apiError.message);
      });
  };

  const upLocationField = (field: string, value: any) => {
    setLocation({ ...location, [field]: value });
  };

  const upLocationPartnerField = (value: any) => {
    let partner = partnerList.findPartnerById(value);
    // reset account by undefined to reset list
    setLocation({
      ...location,
      partner: partner.getPartner(),
      account: undefined,
    });

    // fetch account list by partner id
    if (partner.userId) {
      getAccountListByPartner(partner.userId);
    }
  };

  const upLocationAccountField = (value: any) => {
    let account = accountList.findAccountById(value);
    setLocation({ ...location, account: account.getAccount() });
  };

  const isFormValidated = () => {
    let isValidated = true;
    if (
      !location ||
      !location.account ||
      TextUtils.isEmpty(location.name) ||
      TextUtils.isEmpty(location.address) ||
      TextUtils.isEmpty(location.city) ||
      TextUtils.isEmpty(location.state) ||
      TextUtils.isEmpty(location.country) ||
      TextUtils.isEmpty(location.postalCode)
    ) {
      isValidated = false;
    }
    console.log('isValidated =>'+JSON.stringify(location))
    return isValidated;
  };

  const readOnlyReturn = () => {
    if (!location.id) {
      return false;
    } else if (editBtnActive) {
      return false;
    } else {
      return true;
    }
  };

  const btnDisapper = () => {
    if (!location.id) {
      return true;
    } else if (location.id) {
      if (!editBtnActive) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const handleBackOrCancel = () => {
    if (editBtnActive) {
      setEditBtnActive(false);
    } else {
      Navigation.back(props.router);
    }
  };

  const isAddAccountEnabled = () => {
    if (
      UserManager.shared().user.accountType === AccountType.ROOT_USER &&
      (UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN)
    ) {
      return true;
    }
    return false;
  };

  const handleImageUpload = () => {
    if (loading) return;
    setLoading(true);
    AccountService.uploadFile(selectedFile)
      .then((fileId: string) => {
        setLoading(false);
        if (fileId && fileId.length > 0) {
          upLocationField("locationLogoFileId", fileId);
        }
      })
      .catch((apiError: ApiError) => {
        setLoading(false);
        console.log(apiError.message);
      });
  };

  const saveOrUpdateLocation = () => {
    setLoading(true);
    LocationService.createOrUpdateLocation(location)
      .then((result: Location) => {
        setLoading(false);
        Navigation.back(props.router);
        setTimeout(() => {
          showMessage(
            location.id
              ? "Location Updated Successfully"
              : "Location Added Successfully"
          );
        }, 100);
      })
      .catch((apiError: ApiError) => {
        setLoading(false);
        showApiErrorMessage(apiError);
      });
  };

  const handleSaveOrUpdate = (e: any) => {
    e.preventDefault();
    if (selectedFile && TextUtils.isEmpty(location.locationLogoFileId)) {
      handleImageUpload();
    } else {
      saveOrUpdateLocation();
    }
  };

  const isEditButtonEnabled = () => {
    if (
      (UserManager.shared().user.accountType === AccountType.ROOT_USER && (UserManager.shared().user.userRole === UserRole.SUPER_ADMIN ||
        UserManager.shared().user.userRole === UserRole.ADMIN)) &&
      !editBtnActive &&
      location.id
    ) {
      return true;
    }
    return false;
  };

  const isAddOrEditMode = () => {
    if (!location.id || editBtnActive) {
      return true;
    }
    return false;
  };

  if (isDataLoading) {
    return <Loader pshow={isDataLoading} />;
  }
  const handleChangeAddress = (newAddress: any) => {
    setAddress(newAddress);
    setLocation({
      ...location,
      address: newAddress
    });
  };
  const handleSelectAddress = async (newAddress: any, placeId: string) => {
    setAddress(newAddress);
    /*geocodeByAddress(newAddress)
      .then(async (results: any) => {
        const placedata: any = await geocodeByPlaceId(placeId);
        const latLang = getLatLng(results[0]);
        const { long_name: postalCode = "" }: any =
          placedata.address_components.find((c: any) =>
            c.types.includes("postal_code")
          ) || {};
        console.log("postalCode && latLang", postalCode, latLang);
      })
      .then((latLng: any) => console.log("Success", latLng))
      .catch((error: any) => console.error("Error", error));*/
  };

  const AutoLocation = async(value: any) => { 
    const [place] = await geocodeByPlaceId(value.placeId);
    console.log(JSON.stringify(place))
    let city = ''
    let state = ''
    let country = ''
    let postalCode = ''
    if(place) {
      const address = place.formatted_address
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      place.address_components.find(c => {
        if(c.types.includes('administrative_area_level_3') || c.types.includes('locality')) {
          city = c.long_name
        } else if(c.types.includes('administrative_area_level_1')) {
          state = c.long_name
        } else if(c.types.includes('country')) {
          country = c.long_name
        } else if(c.types.includes('postal_code')) {
          postalCode = c.long_name
        }
      });
      console.log(Number(lat))
      console.log(Number(lng))
      console.log(lat)
      console.log(lng)
      setAddress(address)
      setLocation({
        ...location,
        address,
        city,
        state,
        country,
        postalCode,
        latitude: lat,
        longitude: lng
      });
    } else {
      setLocation({
        ...location,
        address: address
      });
    }
  };

  const isViewModeActive = () => {
    if(location && location.id && !editBtnActive) {
      return true
    }
    return false
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <PageHeading
          backArrow={true}
          heading={
            !location.id
              ? Strings.NEW_LOCATION_HEADER_TITLE
              : !editBtnActive
              ? Strings.VIEW_LOCATION_HEADER_TITLE
              : Strings.EDIT_LOCATION_HEADER_TITLE
          }
          onClick={() => {
            handleBackOrCancel();
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
            <Box width={"533px"}>
              <CustomDropDown
                data={partnerList.dropDownItems}
                heading={`${!readOnlyReturn() ? `Select ` : ``}Client ID `}
                placeholder="Select Client ID"
                value={
                  location.account
                    ? location.account.partner.id
                    : location.partner
                    ? location.partner.id
                    : ""
                }
                onChange={(e: any) => upLocationPartnerField(e.target.value)}
                disabled={location.id ? true : readOnlyReturn()}
              />
            </Box>
            <Box width={"533px"}>
              <CustomDropDown
                data={accountList.dropDownItems}
                heading={`${!readOnlyReturn() ? `Select ` : ``}Account `}
                placeholder="Select Account"
                value={location.account ? location.account.id : ""}
                onChange={(e: any) => upLocationAccountField(e.target.value)}
                disabled={location.id ? true : readOnlyReturn()}
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
          <Box width={"533px"}>
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter ` : ``}Location Name`}
                placeholder="Location Name"
                required={true}
                value={location.name}
                onChange={(e: any) =>
                  upLocationField("name", e.target.value)
                }
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
            <Box width={"533px"} sx={{position:"relative"}}>
              <GeoLocationResults
                address={address}
                handleChangeAddress={handleChangeAddress}
                handleSelectAddress={handleSelectAddress}
                readOnlyReturn={readOnlyReturn}
                AutoLocation={AutoLocation}
                placeholder="Address"
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width={"533px"}>
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter ` : ``}Country`}
                placeholder="Country"
                required={true}
                value={location.country}
                onChange={(e: any) =>
                  upLocationField("country", e.target.value)
                }
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>

            <Box width={"533px"}>
              <InputField
                inputLabel={`${
                  !readOnlyReturn() ? `Enter ` : ``
                }Province/State`}
                placeholder="Province/State"
                required={true}
                value={location?.state}
                onChange={(e: any) => upLocationField("state", e.target.value)}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
          </Box>
          <Box display="flex" marginTop="40px" gap="72px">
            <Box width={"533px"}>
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter ` : ``}City`}
                placeholder="City"
                required={true}
                value={location?.city}
                onChange={(e: any) => upLocationField("city", e.target.value)}
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>

            <Box width={"533px"}>
              <InputField
                inputLabel={`${!readOnlyReturn() ? `Enter ` : ``}Postal Code`}
                placeholder="Postal Code"
                required={true}
                value={location.postalCode}
                onChange={(e: any) =>
                  upLocationField("postalCode", e.target.value)
                }
                InputProps={{
                  readOnly: readOnlyReturn(),
                }}
              />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap="47px" marginTop="49px">
            {btnDisapper() && (
              <PrimaryBtn
                label={location.id ? Strings.UPDATE : Strings.SAVE}
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
                handleBackOrCancel();
              }}
            />
          </Box>
        </Box>
        <Box width="37.60%" maxWidth="608px" marginTop="55px">
          {isViewModeActive() && TextUtils.isEmpty(location.logoUrl) ? (<></>) : (<UploadImage
            error={error}
            setError={setError}
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            imageTitle="Upload Image"
            boxWidth="100%"
            boxHeight="200px"
            isEditable={isAddOrEditMode()}
          />)}
        </Box>
      </Box>
    </Box>
  );
}
export default withRouter(NewLocation);
