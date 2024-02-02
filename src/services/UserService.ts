import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User, { AccountType, UserRole } from "../core/models/User"
import UserManager from '../core/utils/UserManager';
import UserList from "../core/models/UserList"
import { IUser, IUserCreate, IUserUpdate } from '../core/models/User';
import GeneralUtils from "../core/utils/GeneralUtils"

export default class UserService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  public static async createOrUpdateUser(user: IUser, accountType: AccountType) {
    const {
        id,
        name,
        email,
        title,
        phoneNumCode,
        phoneNum,
        userRole = UserRole.USER
    } = user
  
      let isUpdateOperation = false
      let iUserCreateOrUpdate: IUserCreate | IUserUpdate = undefined
      if (id) {
        isUpdateOperation = true
        iUserCreateOrUpdate = {
          id,
          name,
          title,
          phoneNum,
          userRole
        }
      } else {
        iUserCreateOrUpdate = {
          name,
          email,
          title,
          phoneNum,
          userRole
        }
      }
    //   iUserCreateOrUpdate.phoneNum =
    //     GeneralUtils.getPhoneNumberWithFormat(
    //         phoneNumCode,
    //         iUserCreateOrUpdate.phoneNum
    //     )
      const response = await WebServiceUtils.post(
        isUpdateOperation
          ? this.updateUserBody(iUserCreateOrUpdate as IUserUpdate,accountType)
          : this.createUserBody(iUserCreateOrUpdate as IUserCreate,accountType),
        UserService.config,
        UserService.apiUrl
      )
  
      if (response.success) {
        try {
          let isSuccessResult = false
          if (
            response.data &&
            response.data.data
          ) {
            let userJsonObject: any = undefined
            if (accountType === AccountType.ROOT_USER) {
                userJsonObject = (isUpdateOperation) ? response.data.data.updateRootUser : response.data.data.createRootUser
            } else if (accountType === AccountType.PARTNER) {
                userJsonObject = (isUpdateOperation) ? response.data.data.updatePartnerUser : response.data.data.createPartnerUser
            } else {
                userJsonObject = (isUpdateOperation) ? response.data.data.updateAccountUser : response.data.data.createAccountUser
            }
            const resultUser: User =
            User.initWithUserDetails(userJsonObject)
            if (resultUser) {
              isSuccessResult = true
              return Promise.resolve(resultUser)
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

  private static createUserBody(iUserCreate: IUserCreate,accountType: AccountType): any {

    if (accountType === AccountType.ROOT_USER) {
        return `{
            "query": "mutation($In:RootUserCreate!) {createRootUser(in:$In) {id,name,email,title,phoneNum,userRole,isActivated}}",
            "variables": {
                "In": ${JSON.stringify(iUserCreate)}
            }
          }`.replace(/\s+/g, " ")
    } else if (accountType === AccountType.PARTNER) {
        return `{
            "query": "mutation($In:PartnerUserCreate!) {createPartnerUser(in:$In) {id,name,email,title,phoneNum,userRole,isActivated}}",
            "variables": {
                "In": ${JSON.stringify(iUserCreate)}
            }
          }`.replace(/\s+/g, " ")
    }
    
    return `{
      "query": "mutation($In:AccountUserCreate!) {createAccountUser(in:$In) {id,name,email,title,phoneNum,userRole,isActivated}}",
      "variables": {
          "In": ${JSON.stringify(iUserCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  private static updateUserBody(iUserUpdate: IUserUpdate,accountType: AccountType): any {

    if (accountType === AccountType.ROOT_USER) {
        return `{
            "query": "mutation($In:RootUserUpdate!) {updateRootUser(in:$In) {id,name,email,title,phoneNum,userRole,isActivated}}",
            "variables": {
                "In": ${JSON.stringify(iUserUpdate)}
            }
          }`.replace(/\s+/g, " ")
    } else if (accountType === AccountType.PARTNER) {
        return `{
            "query": "mutation($In:PartnerUserUpdate!) {updatePartnerUser(in:$In) {id,name,email,title,phoneNum,userRole,isActivated}}",
            "variables": {
                "In": ${JSON.stringify(iUserUpdate)}
            }
          }`.replace(/\s+/g, " ")
    }
    
    return `{
      "query": "mutation($In:AccountUserUpdate!) {updateAccountUser(in:$In) {id,name,email,title,phoneNum,userRole}}",
      "variables": {
          "In": ${JSON.stringify(iUserUpdate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Grant or revoke access of the User.
   * @returns {User} - updated user details.
  */
  public static async revokeOrGrantAccess(user: IUser, accountType: AccountType) {
    
    const {
        id,
        isActivated,
        name,
        title,
        phoneNum,
        userRole
    } = user

    const newIsActivated = !isActivated

    let iUserUpdate: IUserUpdate = {
      id,
      name,
      title,
      phoneNum,
      userRole,
      isActivated: newIsActivated
    }
    delete iUserUpdate.name
    delete iUserUpdate.title
    delete iUserUpdate.phoneNum
    delete iUserUpdate.userRole
  
      const response = await WebServiceUtils.post(
        this.updateUserBody(iUserUpdate as IUserUpdate,accountType),
        UserService.config,
        UserService.apiUrl
      )
  
      if (response.success) {
        try {
          let isSuccessResult = false
          if (
            response.data &&
            response.data.data
          ) {
            let userJsonObject: any = undefined
            if (accountType === AccountType.ROOT_USER) {
                userJsonObject = response.data.data.updateRootUser
            } else if (accountType === AccountType.PARTNER) {
                userJsonObject = response.data.data.updatePartnerUser
            } else {
                userJsonObject = response.data.data.updateAccountUser
            }
            const resultUser: User =
            User.initWithUserDetails(userJsonObject)
            if (resultUser) {
              isSuccessResult = true
              return Promise.resolve(resultUser)
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

  /**
   * Get User List.
   * @returns {UserList} - user list
   */
  public static async getUserList(page: number, accountType: AccountType) {
    const pageSize = UserList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getUserListBody(offset, pageSize, accountType),
      UserService.config,
      UserService.apiUrl
    )

    if (response.success) {
      try {
        if (response.data && response.data.data) {
          let userInfo = undefined
          if (accountType === AccountType.ROOT_USER) {
            userInfo = response.data.data.rootUsers
          } else if (accountType === AccountType.PARTNER) {
            userInfo = response.data.data.partnerUsers
          } else {
            userInfo = response.data.data.accountUsers
          }
          const userList = UserList.initWithResult(userInfo, null)
          return Promise.resolve(userList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getUserListBody(
    offset: number,
    limit: number,
    accountType: AccountType
  ): any {
    const sort = {
      id: "DESC",
    }
    let filter = {
      userRole: {
        os: ["ADMIN","USER","MOBILE_ONLY"]
      },
      isRemoved:{
        eq: false
      }
    }
    if(UserManager.shared().user.userRole === UserRole.SUPER_ADMIN) {
      filter = {
        userRole: {
          os: ["ADMIN","USER","MODERATOR","MOBILE_ONLY"]
        },
        isRemoved:{
          eq: false
        }
      }
    }

    if (accountType === AccountType.ROOT_USER) {
      return `{
            "query": "query($filter:RootUserFilter,$sort:RootUserSorter,$limit: Int!,$offset: Int!){rootUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
            "variables": {
                "sort": ${JSON.stringify(sort)},
                "filter": ${JSON.stringify(filter)},
                "offset": ${offset},
                "limit": ${limit}
            }
          }`.replace(/\s+/g, " ")
    }

    if (accountType === AccountType.PARTNER) {
      return `{
            "query": "query($filter:PartnerUserFilter,$sort:PartnerUserSorter,$limit: Int!,$offset: Int!){partnerUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
            "variables": {
                "sort": ${JSON.stringify(sort)},
                "filter": ${JSON.stringify(filter)},
                "offset": ${offset},
                "limit": ${limit}
            }
          }`.replace(/\s+/g, " ")
    }

    return `{
        "query": "query($filter:AccountUserFilter,$sort:AccountUserSorter,$limit: Int!,$offset: Int!){accountUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get User Details.
   * @returns {User} - user
   */
  public static async getUserDetails(userId: number, accountType: AccountType) {
    const response = await WebServiceUtils.post(
      this.getUserDetailsBody(userId, accountType),
      UserService.config,
      UserService.apiUrl
    )

    if (response.success) {
      try {
        if (response.data && response.data.data) {
          let userInfo = undefined
          if (accountType === AccountType.ROOT_USER) {
            userInfo = response.data.data.rootUsers
          } else if (accountType === AccountType.PARTNER) {
            userInfo = response.data.data.partnerUsers
          } else {
            userInfo = response.data.data.accountUsers
          }
          const userList = UserList.initWithResult(userInfo, null)
          if (userList.users.length === 1) {
            return Promise.resolve(userList.users[0])
          } else {
            return Promise.reject(new ApiError(500, Strings.NO_USER_FOUND))
          }
          return Promise.resolve(userList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getUserDetailsBody(
    userId: number,
    accountType: AccountType
  ): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
        id: {
          eq: [userId],
        },
      }
    if (accountType === AccountType.ROOT_USER) {
      return `{
            "query": "query($filter:RootUserFilter,$sort:RootUserSorter,$limit: Int!,$offset: Int!){rootUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
            "variables": {
                "sort": ${JSON.stringify(sort)},
                "filter": ${JSON.stringify(filter)},
                "offset": 0,
                "limit": 1
            }
          }`.replace(/\s+/g, " ")
    }

    if (accountType === AccountType.PARTNER) {
      return `{
            "query": "query($filter:PartnerUserFilter,$sort:PartnerUserSorter,$limit: Int!,$offset: Int!){partnerUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
            "variables": {
                "sort": ${JSON.stringify(sort)},
                "filter": ${JSON.stringify(filter)},
                "offset": 0,
                "limit": 1
            }
          }`.replace(/\s+/g, " ")
    }

    return `{
        "query": "query($filter:AccountUserFilter,$sort:AccountUserSorter,$limit: Int!,$offset: Int!){accountUsers(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,email,title,phoneNum,userRole,isActivated}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }
}
