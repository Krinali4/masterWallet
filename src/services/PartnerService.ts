import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from "../core/models/User"
import UserManager from "../core/utils/UserManager"
import PartnerList from "../core/models/PartnerList"
import Partner, { IPartner, IPartnerCreate, IPartnerUpdate } from "../core/models/Partner"
import GeneralUtils from "../core/utils/GeneralUtils"
import { AccountType } from '../core/models/User';

export default class PartnerService {

  private static partnerApiUrl =
    process.env.REACT_APP_API_BASE_URL + "/graphql";
  private static config = { headers: { "Content-Type": "application/json" } };

  /**
   * Create new partner.
   * @returns {Partner} - partner
   */
  public static async createOrUpdatePartner(partner: IPartner) {
    
    const {
      id,
      name,
      contactName,
      contactEmailId,
      contactPhoneNum,
      contactPhoneNumCode,
      logoImageId,
    } = partner

    let isUpdateOperation = false
    let iPartnerCreateOrUpdate: IPartnerCreate|IPartnerUpdate = undefined
    if(id) {
      isUpdateOperation = true
      iPartnerCreateOrUpdate = {
        id,name,contactName,contactEmailId,contactPhoneNum,logoImageId
      }
    } else {
      iPartnerCreateOrUpdate = {
        name,contactName,contactEmailId,contactPhoneNum,logoImageId
      }
    }
    if(!iPartnerCreateOrUpdate.logoImageId || (iPartnerCreateOrUpdate.logoImageId && iPartnerCreateOrUpdate.logoImageId.length <= 0)) {
      delete iPartnerCreateOrUpdate.logoImageId
    }
    iPartnerCreateOrUpdate.contactPhoneNum = GeneralUtils.getPhoneNumberWithFormat(contactPhoneNumCode,iPartnerCreateOrUpdate.contactPhoneNum)
    
    const response = await WebServiceUtils.post(
      (isUpdateOperation) ? this.updatePartnerBody(iPartnerCreateOrUpdate as IPartnerUpdate) : this.createPartnerBody(iPartnerCreateOrUpdate as IPartnerCreate),
      PartnerService.config,
      PartnerService.partnerApiUrl
    );

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data && 
          response.data.data &&
          (response.data.data.createPartner || response.data.data.updatePartner)
        ) {
          const partnerJsonObject = (response.data.data.createPartner) ? response.data.data.createPartner : response.data.data.updatePartner
          const resultPartner: Partner = Partner.initWithResult(partnerJsonObject)
          if(resultPartner) {
            isSuccessResult = true
            return Promise.resolve(resultPartner);
          }
        }

        if(!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }

      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static createPartnerBody(iPartnerCreate: IPartnerCreate): any {
    return `{
      "query": "mutation($In:PartnerCreate!) {createPartner(in:$In) {id,name,logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}",
      "variables": {
          "In": ${JSON.stringify(iPartnerCreate)}
      }
    }`.replace(/\s+/g, " ");
  }

  private static updatePartnerBody(iPartnerUpdate: IPartnerUpdate): any {
    return `{
      "query": "mutation($In:PartnerUpdate!) {updatePartner(in:$In) {id,name,logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}",
      "variables": {
          "In": ${JSON.stringify(iPartnerUpdate)}
      }
    }`.replace(/\s+/g, " ");
  }

  /**
   * Get Partner List with pagination.
   * @returns {PartnerList} - partner list
   */
  public static async getPartnerList(page: number) {

    const pageSize = PartnerList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getPartnerListBody(offset,pageSize),
      PartnerService.config,
      PartnerService.partnerApiUrl
    );

    if (response.success) {
      try {
        if (
          response.data && 
          response.data.data &&
          response.data.data.partners &&
          response.data.data.partners.data &&
          Array.isArray(response.data.data.partners.data)
        ) {
          const partnerList = PartnerList.initWithResult(response.data.data.partners,null);
          return Promise.resolve(partnerList);
        } else {
          return Promise.reject(
            new ApiError(500, Strings.DEFAULT_ERROR_MSG)
          )
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  /**
   * Get full Partner List with pagination.
   * @returns {PartnerList} - partner list
   */
  public static async getFullPartnerList() {

    const pageSize = 1000 // this might change as per the future data.
    const offset = 0 * pageSize

    const response = await WebServiceUtils.post(
      this.getPartnerListBody(offset,pageSize),
      PartnerService.config,
      PartnerService.partnerApiUrl
    );

    if (response.success) {
      try {
        if (
          response.data && 
          response.data.data &&
          response.data.data.partners &&
          response.data.data.partners.data &&
          Array.isArray(response.data.data.partners.data)
        ) {
          const partnerList = PartnerList.initWithResult(response.data.data.partners,null);
          return Promise.resolve(partnerList);
        } else {
          return Promise.reject(
            new ApiError(500, Strings.DEFAULT_ERROR_MSG)
          )
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getPartnerListBody(offset: number, limit: number): any {
    const sort = {
      id:"DESC"
    }
    return `{
      "query": "query($filter: PartnerFilter,$sort:PartnerSorter,$limit: Int!,$offset: Int!){partners(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ");
  }

  /**
   * Get all Partner List - to be used for filters.
   * @returns {PartnerList} - partner list
   */
  public static async getAllPartnerList() {

    const pageSize = 1000 // this might change as per the future data.
    const offset = 0 * pageSize

    const response = await WebServiceUtils.post(
      this.getAllPartnerListBody(offset,pageSize),
      PartnerService.config,
      PartnerService.partnerApiUrl
    );

    if (response.success) {
      try {
        if (
          response.data && 
          response.data.data &&
          response.data.data.partners &&
          response.data.data.partners.data &&
          Array.isArray(response.data.data.partners.data)
        ) {
          const partnerList = PartnerList.initWithResult(response.data.data.partners,null);
          return Promise.resolve(partnerList);
        } else {
          return Promise.reject(
            new ApiError(500, Strings.DEFAULT_ERROR_MSG)
          )
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getAllPartnerListBody(offset: number, limit: number): any {
    const sort = {
      name:"ASC"
    }
    return `{
      "query": "query($filter: PartnerFilter,$sort:PartnerSorter,$limit: Int!,$offset: Int!){partners(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ");
  }

  /**
   * Get Partner Details.
   * @returns {Partner} - partner
   */
  public static async getPartnerDetails(partnerId: number) {

    const response = await WebServiceUtils.post(
      this.getPartnerDetailsBody(partnerId),
      PartnerService.config,
      PartnerService.partnerApiUrl
    );

    if (response.success) {
      try {
        if (
          response.data && 
          response.data.data &&
          response.data.data.partners &&
          response.data.data.partners.data &&
          Array.isArray(response.data.data.partners.data)
        ) {
          const partnerList = PartnerList.initWithResult(response.data.data.partners,null);
          if(partnerList.partners.length === 1) {
            return Promise.resolve(partnerList.partners[0]);
          } else {
            return Promise.reject(
              new ApiError(500, Strings.NO_PARTNER_FOUND)
            )
          }
        } else {
          return Promise.reject(
            new ApiError(500, Strings.DEFAULT_ERROR_MSG)
          )
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getPartnerDetailsBody(partnerId: number): any {
    const sort = {
      id:"DESC"
    }
    const filter = {
      id:{
        eq:[partnerId]
      }
    }
    return `{
      "query": "query($filter: PartnerFilter,$sort:PartnerSorter,$limit: Int!,$offset: Int!){partners(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ");
  }

  public static async revokePartnerUserAccess() {}

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

  public static async getClientsFiltersList() {
    const loggedInUserAccountType = UserManager.shared().user.accountType
    if(loggedInUserAccountType === AccountType.PARTNER || loggedInUserAccountType === AccountType.ACCOUNT) {
      // restricted access for PARTNER/ACCOUNT role
      return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
    }
    return this.getAllPartnerList()
  }
}
