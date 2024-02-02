import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from "../core/models/User"
import UserManager from "../core/utils/UserManager"
import AccountList from "../core/models/AccountList"
import Account, {
  IAccount,
  IAccountCreate,
  IAccountUpdate,
} from "../core/models/Account"
import GeneralUtils from "../core/utils/GeneralUtils"
import { AccountType } from '../core/models/User';

export default class AccountService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Create new account.
   * @returns {Account} - account
   */
  public static async createOrUpdateAccount(account: IAccount) {
    const {
      id,
      name,
      partner,
      contactName,
      contactEmailId,
      contactPhoneNum,
      contactPhoneNumCode,
      logoImageId,
    } = account

    let isUpdateOperation = false
    let iAccountCreateOrUpdate: IAccountCreate | IAccountUpdate = undefined
    if (id) {
      isUpdateOperation = true
      iAccountCreateOrUpdate = {
        id,
        name,
        contactName,
        contactEmailId,
        contactPhoneNum,
        logoImageId,
      }
    } else {
      iAccountCreateOrUpdate = {
        name,
        partnerId: partner.id,
        contactName,
        contactEmailId,
        contactPhoneNum,
        logoImageId,
      }
    }
    if (
      !iAccountCreateOrUpdate.logoImageId ||
      (iAccountCreateOrUpdate.logoImageId &&
        iAccountCreateOrUpdate.logoImageId.length <= 0)
    ) {
      delete iAccountCreateOrUpdate.logoImageId
    }
    iAccountCreateOrUpdate.contactPhoneNum =
      GeneralUtils.getPhoneNumberWithFormat(
        contactPhoneNumCode,
        iAccountCreateOrUpdate.contactPhoneNum
      )
    const response = await WebServiceUtils.post(
      isUpdateOperation
        ? this.updateAccountBody(iAccountCreateOrUpdate as IAccountUpdate)
        : this.createAccountBody(iAccountCreateOrUpdate as IAccountCreate),
      AccountService.config,
      AccountService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          (response.data.data.createAccount || response.data.data.updateAccount)
        ) {
          const accountJsonObject = response.data.data.createAccount
            ? response.data.data.createAccount
            : response.data.data.updateAccount
          const resultAccount: Account =
            Account.initWithResult(accountJsonObject)
          if (resultAccount) {
            isSuccessResult = true
            return Promise.resolve(resultAccount)
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

  private static createAccountBody(iAccountCreate: IAccountCreate): any {
    return `{
      "query": "mutation($In:AccountCreate!) {createAccount(in:$In) {id,name,partner{id,name},logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}",
      "variables": {
          "In": ${JSON.stringify(iAccountCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  private static updateAccountBody(iAccountUpdate: IAccountUpdate): any {
    return `{
      "query": "mutation($In:AccountUpdate!) {updateAccount(in:$In) {id,name,partner{id,name},logoUrl,contactName,contactEmailId,contactPhoneNum,isActivated}}",
      "variables": {
          "In": ${JSON.stringify(iAccountUpdate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Account List.
   * @returns {AccountList} - account list
   */
  public static async getAccountList(page: number) {
    const pageSize = AccountList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getAccountListBody(offset, pageSize),
      AccountService.config,
      AccountService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.accounts &&
          response.data.data.accounts.data &&
          Array.isArray(response.data.data.accounts.data)
        ) {
          const accountList = AccountList.initWithResult(
            response.data.data.accounts,
            null
          )
          return Promise.resolve(accountList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  /**
   * Get full Account List.
   * @returns {AccountList} - account list
   */
  public static async getFullAccountList() {

    const pageSize = 1000 // this might change as per the future data.
    const offset = 0 * pageSize

    const response = await WebServiceUtils.post(
      this.getAccountListBody(offset,pageSize),
      AccountService.config,
      AccountService.apiUrl
    );

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.accounts &&
          response.data.data.accounts.data &&
          Array.isArray(response.data.data.accounts.data)
        ) {
          const accountList = AccountList.initWithResult(
            response.data.data.accounts,
            null
          )
          return Promise.resolve(accountList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getAccountListBody(offset: number, limit: number): any {
    const sort = {
      id: "DESC",
    }
    return `{
      "query": "query($filter:AccountFilter,$sort:AccountSorter,$limit: Int!,$offset: Int!){accounts(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,partner{id,name},contactName,contactEmailId,contactPhoneNum}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get all Account List - to be used for filter.
   * @returns {AccountList} - account list
   */
  public static async getAllAccountList() {

    const pageSize = 1000 // this might change as per the future data.
    const offset = 0 * pageSize

    const response = await WebServiceUtils.post(
      this.getAllAccountListBody(offset,pageSize),
      AccountService.config,
      AccountService.apiUrl
    );

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.accounts &&
          response.data.data.accounts.data &&
          Array.isArray(response.data.data.accounts.data)
        ) {
          const accountList = AccountList.initWithResult(
            response.data.data.accounts,
            null
          )
          return Promise.resolve(accountList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getAllAccountListBody(offset: number, limit: number): any {
    const sort = {
      name: "ASC",
    }
    return `{
      "query": "query($filter:AccountFilter,$sort:AccountSorter,$limit: Int!,$offset: Int!){accounts(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get full Account List by partnerID.
   * @returns {AccountList} - account list
   */
  public static async getFullAccountListByPartnerID(partnerId: number) {

    if(!partnerId) {
      return Promise.resolve(AccountList.default())
    }

    const pageSize = 1000 // this might change as per the future data.
    const offset = 0 * pageSize

    const response = await WebServiceUtils.post(
      this.getFullAccountListByPartnerIDBody(offset,pageSize,partnerId),
      AccountService.config,
      AccountService.apiUrl
    );

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.accounts &&
          response.data.data.accounts.data &&
          Array.isArray(response.data.data.accounts.data)
        ) {
          const accountList = AccountList.initWithResult(
            response.data.data.accounts,
            null
          )
          return Promise.resolve(accountList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(
          new ApiError(500, Strings.DEFAULT_ERROR_MSG)
        )
      }
    }
    return WebServiceUtils.handleNetworkError(response);
  }

  private static getFullAccountListByPartnerIDBody(offset: number, limit: number, partnerId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      partnerId: {
        eq: [partnerId],
      }
    }
    return `{
      "query": "query($filter:AccountFilter,$sort:AccountSorter,$limit: Int!,$offset: Int!){accounts(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,partner{id,name},contactName,contactEmailId,contactPhoneNum}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Account Details.
   * @returns {Account} - partner
   */
  public static async getAccountDetails(accountId: number) {
    const response = await WebServiceUtils.post(
      this.getAccountDetailsBody(accountId),
      AccountService.config,
      AccountService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.accounts &&
          response.data.data.accounts.data &&
          Array.isArray(response.data.data.accounts.data)
        ) {
          const accountList = AccountList.initWithResult(
            response.data.data.accounts,
            null
          )
          if (accountList.accounts.length === 1) {
            return Promise.resolve(accountList.accounts[0])
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

  private static getAccountDetailsBody(partnerId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      id: {
        eq: [partnerId],
      },
    }
    return `{
      "query": "query($filter:AccountFilter,$sort:AccountSorter,$limit: Int!,$offset: Int!){accounts(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,partner{id,name},contactName,contactEmailId,contactPhoneNum,logoUrl}}}",
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

  public static getUserAccountList() {
    return new Promise<AccountList|undefined>((resolve,reject) => {
      const loggedInUserAccountType = UserManager.shared().user.accountType
      if(loggedInUserAccountType === AccountType.PARTNER) {
        AccountService.getFullAccountList()
        .then((accountList: AccountList) => {
          resolve(accountList)
        })
        .catch((apiError: ApiError) => {
          resolve(undefined)
        })
      } else if(loggedInUserAccountType === AccountType.ACCOUNT) {
        const accountList = AccountList.accountListWithID(UserManager.shared().user.accountEntityId)
        resolve(accountList)
      } else {
        const accountList = AccountList.default()
        resolve(accountList)
      }
    })
  }

  public static async getAccountFiltersList() {
    const loggedInUserAccountType = UserManager.shared().user.accountType
    // loggedInUserAccountType === AccountType.PARTNER || 
    if(loggedInUserAccountType === AccountType.ACCOUNT) {
      // restricted access for PARTNER/ACCOUNT role
      return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
    }
    return this.getAllAccountList()
  }
}
