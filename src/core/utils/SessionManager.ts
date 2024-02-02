import TextUtils from "./TextUtils"; 
import LocalStorageUtils from "./LocalStorageUtils";
import Strings from "./Strings";
import User from "../models/User";
import UserManager from "./UserManager";

export default class SessionManager {

  private ACCESS_TOKEN = "token";
  private REFRESH_TOKEN = "refreshToken";

  public static shared(): SessionManager {
    if (!SessionManager.sSessionManager) {
      SessionManager.sSessionManager = new SessionManager();
    }
    return SessionManager.sSessionManager;
  }

  private static sSessionManager: SessionManager | null;

  // access token
  private mAccessToken: string | undefined;
  public get accessToken(): string | undefined {
    if (this.mAccessToken) {
      return this.mAccessToken;
    } else {
      const sessionAuthToken = LocalStorageUtils.getItem(this.ACCESS_TOKEN);
      if (sessionAuthToken) {
        return (this.mAccessToken = sessionAuthToken);
      }
      return undefined;
    }
  }

  // refresh token
  private mRefreshToken: string | undefined;
  public get refreshToken(): string | undefined {
    if (this.mRefreshToken) {
      return this.mRefreshToken;
    } else {
      const sessionAuthToken = LocalStorageUtils.getItem(this.REFRESH_TOKEN);
      if (sessionAuthToken) {
        return (this.mRefreshToken = sessionAuthToken);
      }
      return undefined;
    }
  }

  private constructor() { }

  public init() {
    this.mAccessToken = undefined;
    this.mRefreshToken = undefined;
  }

  public saveUserDetails(loginResponse: any) {
    this.clearSession();
    if (!loginResponse) return;
    let accessToken = loginResponse.accessToken;
    let refreshToken = loginResponse.refreshToken;
    if (accessToken && !TextUtils.isEmpty(accessToken) && refreshToken && !TextUtils.isEmpty(refreshToken)) {
      this.mAccessToken = accessToken;
      this.mRefreshToken = refreshToken;
      LocalStorageUtils.storeItem(this.ACCESS_TOKEN, accessToken);
      LocalStorageUtils.storeItem(this.REFRESH_TOKEN, refreshToken);
    } else {
      this.mAccessToken = undefined;
      this.mRefreshToken = undefined;
      localStorage.removeItem(this.ACCESS_TOKEN);
      localStorage.removeItem(this.REFRESH_TOKEN);
    }
  }

  public saveRefreshTokenDetails(loginResponse: any) {
    if (!loginResponse) return;
    let accessToken = loginResponse.accessToken;
    if (accessToken && !TextUtils.isEmpty(accessToken)) {
      this.mAccessToken = accessToken;
      LocalStorageUtils.storeItem(this.ACCESS_TOKEN, accessToken);
    } else {
      this.mAccessToken = undefined;
      localStorage.removeItem(this.ACCESS_TOKEN);
    }
  }

  public isTokenAvailable(): boolean {
    const authToken = this.accessToken;
    return authToken && !TextUtils.isEmpty(authToken) ? true : false;
  }

  /* Clear Session */
  public clearSession() {
    if (LocalStorageUtils.localStorageAvailable()) {
      localStorage.removeItem(this.ACCESS_TOKEN);
      localStorage.removeItem(this.REFRESH_TOKEN);
    }
    this.mAccessToken = undefined;
    this.mRefreshToken = undefined;
    SessionManager.sSessionManager = null;
  }
}
