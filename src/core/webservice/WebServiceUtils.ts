import axios, { AxiosInstance } from "axios";
import { ApiError } from "./ApiError";
import Strings from "../utils/Strings";
import TextUtils from "./../utils/TextUtils";
import SessionManager from '../utils/SessionManager';
import ApiEndpoints from "../../services/ApiEndpoints";
import AuthService from "../../services/AuthService";
import Navigation from '../../navigation/Navigation';

class WebServiceUtils {
  public static NETWORK_ERROR_STATUS_CODE = 0;
  public static async get(
    config = {},
    url = process.env.REACT_APP_GRAPH_QL_URL
  ) {
    let response;
    let success;

    try {
      response = await WebServiceUtils.getAxioInstance().get(url, config);
      success = true;
    } catch (e: any) {
      response = e.response;
      success = false;
    }

    const fatal = !response;
    const data = fatal ? null : response.data;
    const headers = fatal ? null : response.headers;

    let errorMsgIfAny = WebServiceUtils.checkIfErrorReturned(data)
    if(errorMsgIfAny) {
      success = false;
    }

    return { fatal, data, headers, success, response };
  }

  public static async post(
    body = {},
    config = {},
    url = process.env.REACT_APP_GRAPH_QL_URL
  ) {
    let response;
    let success;

    try {
      response = await WebServiceUtils.getAxioInstance().post(
        url,
        body,
        config
      );
      success = true;
    } catch (e: any) {
      response = e.response;
      success = false;
    }

    const fatal = !response;
    const data = fatal ? null : response.data;
    const headers = fatal ? null : response.headers;

    let errorMsgIfAny = WebServiceUtils.checkIfErrorReturned(data)
    if(errorMsgIfAny) {
      success = false;
    }
    
    return { fatal, data, headers, success, response };
  }

  public static async multipartPost(
    file: any,
    url = ''
  ) {
    let response;
    let success;

    try {
      const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('file',file)
      response = await WebServiceUtils.getAxioInstance().post(
        url,
        formData,
        config
      );
      success = true;
    } catch (e: any) {
      response = e.response;
      success = false;
    }

    const fatal = !response;
    const data = fatal ? null : response.data;
    const headers = fatal ? null : response.headers;

    let errorMsgIfAny = WebServiceUtils.checkIfErrorReturned(data)
    if(errorMsgIfAny) {
      success = false;
    }

    return { fatal, data, headers, success, response };
  }

  public static handleNetworkError(serviceResponse: {
    fatal: boolean;
    data: any;
    headers: any;
    success: boolean;
    response: any;
  }) {
    if (!serviceResponse.fatal) {
      const err = serviceResponse.data;
      const errorCode = serviceResponse.response.status;
      if (err) {
        let errMsg;
        if (Array.isArray(err)) {
          errMsg = err.length === 1 ? err[0].message : undefined;
        } else if (err.errors) {
          errMsg = err.errors.length > 0 ? err.errors[0].message : undefined;
        } else if(err && err.errorCode && err.errorMessage && !TextUtils.isEmpty(err.errorMessage)) {
          errMsg = err.errorMessage
        } else if(err && err.error && err.error.errorCode && err.error.errorMessage && !TextUtils.isEmpty(err.error.errorMessage)) {
          errMsg = err.error.errorMessage
        }

        if (!TextUtils.isEmpty(errMsg)) {
          return Promise.reject(
            new ApiError(errorCode, errMsg)
          );
        }
      }

      if (serviceResponse.response) {
        const respData = serviceResponse.response.data
        if (respData && (typeof respData === 'string' || respData instanceof String)) {
          return Promise.reject(
            new ApiError(errorCode, respData as string)
          );
        }
      
        if (errorCode === 401) {
          return Promise.reject(
            new ApiError(errorCode, Strings.UNAUTHORIZED_ERROR)
          );
        }

        const errorMsg = serviceResponse.response.statusText;
        if (errorCode > -1 && errorMsg) {
          return Promise.reject(new ApiError(errorCode, errorMsg));
        }
      }
    }

    if (!serviceResponse.response) {
      return Promise.reject(
        new ApiError(
          WebServiceUtils.NETWORK_ERROR_STATUS_CODE,
          Strings.NETWORK_ERROR
        )
      );
    } else {
      return Promise.reject(new ApiError(-1, ""));
    }
  }

  public static async validateAccessToken() {
    try{
      if(!SessionManager.shared().isTokenAvailable()) {
        return Promise.reject(
          new ApiError(400, Strings.BEARER_TOKEN_NOT_AVAILABLE_ERROR)
        );
      }
    }catch(e) {

    }
  }

  public static async validatePartnerAuthToken() {
    try{
      if(!SessionManager.shared().isTokenAvailable()) {
        return Promise.reject(
          new ApiError(400, Strings.BEARER_TOKEN_NOT_AVAILABLE_ERROR)
        );
      }
    }catch(e) {

    }
  }

  private static axiosInstance = axios.create({});

  private static getAxioInstance(): AxiosInstance {
    // Request interceptor for API calls
    this.axiosInstance.interceptors.request.use(config => {
      let urlConfig = config.url!;
      var dictHeader = {};
      if (SessionManager.shared().isTokenAvailable()) {
        // @ts-ignore
        dictHeader['Authorization'] = `Bearer ${
          SessionManager.shared().accessToken
        }`;
      }
      if(urlConfig.includes("oauth2/restore") || urlConfig.includes("oauth2/token")) {
        // @ts-ignore
        dictHeader['Content-Type'] = 'application/x-www-form-urlencoded';
        // @ts-ignore
        dictHeader['Authorization'] = '';
      } else if(urlConfig.includes("/files")) {
        // @ts-ignore
        dictHeader['Content-Type'] = 'multipart/form-data';
      } else {
        // @ts-ignore
        dictHeader['Content-Type'] = 'application/json; charset=UTF-8';
      }
      config.headers = dictHeader;
      return config;
    });

    // Response interceptor for API calls
    this.axiosInstance.interceptors.response.use(response => {
      return response;
    },
      async error => {
        const originalRequest = error.config;
        console.log(error.response.config)

        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        // refresh_token api
        const access_token = await WebServiceUtils.memRefreshToken()
        if(access_token) {
          originalRequest.headers['Authorization'] = 'Bearer ' + access_token
          return this.axiosInstance(originalRequest);
        } else {
          // logout
          console.log('Logout and clean the records. --- 2')
          Navigation.forceLogout()
        }
        
        // Reject promise if usual error
        return Promise.reject(error);
    });
    return this.axiosInstance;
  }

  public static throwGenericError() {
    return Promise.reject(
      new ApiError(500, Strings.DEFAULT_ERROR_MSG)
    )
  }

  public static memRefreshToken() {
    return new Promise((resolve) => {
      AuthService.refreshToken()
        .then((data) => {
          SessionManager.shared().saveRefreshTokenDetails(data)
          resolve(data.accessToken);
        })
        .catch((refreshError) => {
          resolve(undefined);
        })
    });
  }

  public static checkIfErrorReturned(data: any): string|undefined {
      // Track the error messages incase of 2.x response codes
      let errMsg = undefined;
      if(data && data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errMsg = data.errors[0].message
      } else if(data && data.errorCode && data.errorMessage && !TextUtils.isEmpty(data.errorMessage)) {
          errMsg = data.errorMessage
      }
      if (TextUtils.isEmpty(errMsg)) {
        errMsg = undefined;
      }
      return errMsg
  }
}

export default WebServiceUtils;
