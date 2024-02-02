import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from '../core/models/User';
import UserManager from '../core/utils/UserManager';
import { ILocation, ILocationCreate, ILocationUpdate } from '../core/models/Location';
import Location from '../core/models/Location';
import LocationList from '../core/models/LocationList';
import AccountList from '../core/models/AccountList';
import Account from "../core/models/Account"
import { AccountType } from '../core/models/User';
import AccountService from "./AccountService"

export default class LocationService {
    private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
    private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Create/Update new location.
   * @returns {Location} - location
   */
  public static async createOrUpdateLocation(location: ILocation) {
    const {
      id,
      account,
      name,
      locationType,
      latitude,
      longitude,
      address,
      city,
      state,
      country,
      postalCode,
      locationLogoFileId
    } = location

    let isUpdateOperation = false
    let iLocationCreateOrUpdate: ILocationCreate | ILocationUpdate = undefined
    if (id) {
      isUpdateOperation = true
      //        accountId:account.id,
      iLocationCreateOrUpdate = {
        id,
        name,
        locationType,
        latitude,
        longitude,
        address,
        city,
        state,
        country,
        postalCode,
        locationLogoFileId
      }
    } else {
        iLocationCreateOrUpdate = {
            accountId:account.id,
            name,
            locationType,
            latitude,
            longitude,
            address,
            city,
            state,
            country,
            postalCode,
            locationLogoFileId
          }
    }
    if (
      !iLocationCreateOrUpdate.locationLogoFileId ||
      (iLocationCreateOrUpdate.locationLogoFileId &&
        iLocationCreateOrUpdate.locationLogoFileId.length <= 0)
    ) {
      delete iLocationCreateOrUpdate.locationLogoFileId
    }
    const response = await WebServiceUtils.post(
      isUpdateOperation
        ? this.updateLocationBody(iLocationCreateOrUpdate as ILocationUpdate)
        : this.createLocationBody(iLocationCreateOrUpdate as ILocationCreate),
        LocationService.config,
        LocationService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          (response.data.data.createLocation || response.data.data.updateLocation)
        ) {
          const locationJsonObject = response.data.data.createLocation
            ? response.data.data.createLocation
            : response.data.data.updateLocation
          const resultLocation: Location =
          Location.initWithResult(locationJsonObject)
          if (resultLocation) {
            isSuccessResult = true
            return Promise.resolve(resultLocation)
          }
        }

        if (!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static createLocationBody(iLocationCreate: ILocationCreate): any {
    return `{
      "query": "mutation($In:LocationCreate!) {createLocation(in:$In) {id,name,account{id,name,partner{id,name}},locationType,latitude,longitude,address,city,state,country,postalCode,logoUrl,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iLocationCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  private static updateLocationBody(iLocationUpdate: ILocationUpdate): any {
    return `{
      "query": "mutation($In:LocationUpdate!) {updateLocation(in:$In) {id,name,account{id,name,partner{id,name}},locationType,latitude,longitude,address,city,state,country,postalCode,logoUrl,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iLocationUpdate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Location List.
   * @returns {LocationList} - location list
   */
  public static async getLocationList(page: number, accountList?: AccountList) {
    const pageSize = LocationList.pageSize
    const offset = page * pageSize

    if(UserManager.shared().user.accountType === AccountType.PARTNER && (!accountList || (accountList && accountList.accounts.length == 0))) {
      return Promise.resolve(LocationList.default()) //PAR-102
    }

    const response = await WebServiceUtils.post(
      this.getLocationListBody(offset, pageSize, accountList),
      LocationService.config,
      LocationService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.locations &&
          response.data.data.locations.data &&
          Array.isArray(response.data.data.locations.data)
        ) {
          const locationList = LocationList.initWithResult(
            response.data.data.locations,
            null
          )
          return Promise.resolve(locationList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getLocationListBody(offset: number, limit: number, accountList?: AccountList): any {
    const sort = {
      id: "DESC",
    }
    let filter = {}
    if(accountList && accountList.accounts.length > 0) {
      filter = {
        accountId: {
          eq:accountList.getAccountIDs()
        }
      }
    }
    return `{
      "query": "query($filter:LocationFilter,$sort:LocationSorter,$limit: Int!,$offset: Int!){locations(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,locationType,latitude,longitude,address,city,state,country,postalCode,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Full Location List.
   * @returns {LocationList} - all location list
   */
  public static async getFullLocationList(page: number, accountList?: AccountList) {

    const pageSize = 1000
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getFullLocationListBody(offset, pageSize, accountList),
      LocationService.config,
      LocationService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.locations &&
          response.data.data.locations.data &&
          Array.isArray(response.data.data.locations.data)
        ) {
          const locationList = LocationList.initWithResult(
            response.data.data.locations,
            null
          )
          return Promise.resolve(locationList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getFullLocationListBody(offset: number, limit: number, accountList?: AccountList): any {
    const sort = {
      id: "DESC",
    }
    let filter = {}
    if(accountList && accountList.accounts.length > 0) {
      filter = {
        accountId: {
          eq:accountList.getAccountIDs()
        }
      }
    }
    return `{
      "query": "query($filter:LocationFilter,$sort:LocationSorter,$limit: Int!,$offset: Int!){locations(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,locationType,latitude,longitude,address,city,state,country,postalCode,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Location List by Single Account.
   * @returns {LocationList} - all location list
   */
  public static async getAllLocationsListByAccount(account: Account|undefined) {
    if(account && account.userId) {
      return this.getFullLocationList(0, AccountList.accountListWithID(account.userId))
    } else {
      return Promise.resolve(LocationList.default())
    }
  }


  /**
   * Get Location Details.
   * @returns {Location} - location
   */
  public static async getLocationDetails(locationId: number) {
    const response = await WebServiceUtils.post(
      this.getLocationDetailsBody(locationId),
      LocationService.config,
      LocationService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.locations &&
          response.data.data.locations.data &&
          Array.isArray(response.data.data.locations.data)
        ) {
          const locationList = LocationList.initWithResult(
            response.data.data.locations,
            null
          )
          if (locationList.locations.length === 1) {
            return Promise.resolve(locationList.locations[0])
          } else {
            return Promise.reject(new ApiError(500, Strings.NO_ACCOUNT_FOUND))
          }
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getLocationDetailsBody(locationId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      id: {
        eq: [locationId],
      },
    }
    return `{
      "query": "query($filter:LocationFilter,$sort:LocationSorter,$limit: Int!,$offset: Int!){locations(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,account{id,name,partner{id,name}},locationType,latitude,longitude,address,city,state,country,postalCode,logoUrl,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Upload file.
   * @returns {string} - file id of uploaded document
   */
  public static async uploadFile(file: any) {
    var fileName = file.name
    var allowedExtensions =
      /(\.jpeg|\.jpg|\.JPG|\.JPEG|\.gif|\.GIF|\.png|\.PNG|\.ico|\.ICO)$/
    if (fileName != "" && !allowedExtensions.exec(fileName)) {
      return Promise.reject(new ApiError(400, Strings.INVALID_FILE_ERROR))
    }

    await WebServiceUtils.validatePartnerAuthToken()
    const apiUrl =
      process.env.REACT_APP_API_BASE_URL + "/" + ApiEndpoints.UPLOAD_FILES
    const response = await WebServiceUtils.multipartPost(file, apiUrl)

    if (
      response.success &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      try {
        const fileObj = response.data[0]
        const fileId = fileObj.file
        return Promise.resolve(fileId)
      } catch (error) {}
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  /**
   * Get All Location List - to be use for filter.
   * @returns {LocationList} - all location list
   */
  public static async getAllLocationList(page: number, accountList?: AccountList) {

    const pageSize = 1000
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getAllLocationListBody(offset, pageSize, accountList),
      LocationService.config,
      LocationService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.locations &&
          response.data.data.locations.data &&
          Array.isArray(response.data.data.locations.data)
        ) {
          const locationList = LocationList.initWithResult(
            response.data.data.locations,
            null
          )
          return Promise.resolve(locationList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getAllLocationListBody(offset: number, limit: number, accountList?: AccountList): any {
    const sort = {
      name: "ASC",
    }
    let filter = {}
    if(accountList && accountList.accounts.length > 0) {
      filter = {
        accountId: {
          eq:accountList.getAccountIDs()
        }
      }
    }
    return `{
      "query": "query($filter:LocationFilter,$sort:LocationSorter,$limit: Int!,$offset: Int!){locations(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }


  public static async getLocationFiltersList() {
    const accountList = await AccountService.getUserAccountList()
    if(!accountList) {
      return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
    }
    return this.getAllLocationList(0,accountList)
  }
}