import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from '../core/models/User';
import UserManager from '../core/utils/UserManager';
import { UserRole } from '../core/models/User';

export default class AuthService {
  public static async sendAuthCodeByEmail(email: string) {
    if (TextUtils.isEmpty(email)) {
      return Promise.reject(
        new ApiError(400, Strings.MISSING_SEND_OTP_PARAMS_ERROR)
      )
    }

    const params = new URLSearchParams()
    params.append("restore_type", "email")
    params.append("email_account", email)
    params.append("client_id", "rewaste")

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
    const apiUrl = process.env.REACT_APP_API_BASE_URL + "/" + ApiEndpoints.SEND_AUTHCODE
    const response = await WebServiceUtils.post(params, config, apiUrl)

    if (response.success) {
      const httpStatus =
        response.response && response.response.status
          ? response.response.status
          : 200
      try {
        let isOtpSent = false
        if (response.data && httpStatus === 201) {
          isOtpSent = true
        }
        return Promise.resolve(isOtpSent)
      } catch (error) {}
    }
    // if(response.response.status === 404) {
    //   return Promise.reject(
    //     new ApiError(404, Strings.USER_NOT_EXISTS)
    //   )
    // }
    return WebServiceUtils.handleNetworkError(response)
  }
  
  public static async verifyAuthCodeByEmail(email: string, otp: string) {
    if (TextUtils.isEmpty(email) || TextUtils.isEmpty(otp)) {
      return Promise.reject(
        new ApiError(400, Strings.MISSING_VERIFY_OTP_PARAMS_ERROR)
      )
    }

    const params = new URLSearchParams()
    const code = otp
    params.append("code", code)
    params.append("grant_type", "authorization_code")
    params.append("client_id", "rewaste")

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }

    const apiUrl = process.env.REACT_APP_API_BASE_URL + "/" + ApiEndpoints.VERIFY_AUTHCODE
    const response = await WebServiceUtils.post(params, config, apiUrl)
    if (response.success) {
      try {
        if (response.data && response.data.accessToken && response.data.refreshToken) {
          const user: User = User.initWithResult(response.data)
          if(user && user.userRole !== UserRole.MOBILE_ONLY) {
            SessionManager.shared().saveUserDetails(response.data)
            UserManager.shared().setUser(user)
            return Promise.resolve(user)
          } else {
            return Promise.reject(
              new ApiError(901, Strings.MOBILE_USER_RESTRICTED_MESSAGE)
            )
          }
        } else if (response.data.errorCode && response.data.errorMessage){
          return Promise.reject(
            new ApiError(response.data.errorCode, response.data.errorMessage)
          )
        } else {
          return Promise.reject(
            new ApiError(500, Strings.DEFAULT_ERROR_MSG)
          )
        }
      } catch (error) {
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  public static async refreshToken() {

    const params = new URLSearchParams()
    const refreshToken = SessionManager.shared().refreshToken;
    
    params.append('refresh_token', refreshToken)
    params.append('grant_type', 'refresh_token')
    params.append('client_id', 'rewaste')

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

    const apiUrl = process.env.REACT_APP_API_BASE_URL + "/" + ApiEndpoints.REFRESH_TOKEN
    const response = await WebServiceUtils.post(
        params,
        config,
        apiUrl
    );

    if (response.success) {
        try {
        if (
            response.data
        ) {
            return Promise.resolve(response.data);
        }
        } catch (error) { }
    }
    return WebServiceUtils.handleNetworkError(response);
}

  public static async getUserProfile() {
    const apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql";
    const config = { headers: { "Content-Type": "application/json" } };

    const response = await WebServiceUtils.post(
      this.getUserProfileBody(),
      config,
      apiUrl
    );

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.session
        ) {
          const user: User = User.initWithUserProfile(response.data.data.session)
          console.log(JSON.stringify(user))
          if(user) {
            UserManager.shared().setUser(user)
            return Promise.resolve(user);
          } else {
            return Promise.reject(
              new ApiError(500, Strings.DEFAULT_ERROR_MSG)
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

  private static getUserProfileBody(): any {
    return `{
      "query": "query { session{accountType,primaryContact,userId,userRole,accountEntityId}}"
    }`.replace(/\s+/g, " ");
  }
}
