import User, { AccountType } from '../models/User';
import SessionManager from './SessionManager';

export default class UserManager {
  
  public static shared(): UserManager {
    if (!UserManager.sUserManager) {
      UserManager.sUserManager = new UserManager();
    }
    return UserManager.sUserManager;
  }

  private static sUserManager: UserManager | null;
  
  private constructor() { }

  public init() {
    
  }

  // get user
  private mUser: User | undefined | null;
  public get user() {
    return this.mUser;
  }

  // set user
  public setUser(user: User | undefined) {
    this.mUser = user
  }

  // update user
  public updateUser(updatedUser: User) {
    this.setUser(updatedUser)
  }

  // reset wallet user
  public resetUser() {
    this.setUser(undefined)
  }

  public isLoggedIn() {
    if(SessionManager.shared().isTokenAvailable()) {
      return true
    }
    return false
  }

  public doLogout() {
    this.resetUser()
    SessionManager.shared().clearSession()
    UserManager.sUserManager = undefined
  }

  public isPartner() {
    if(this.mUser && this.mUser.accountType === AccountType.PARTNER) {
      return true
    }
    return false
  }

  public isAccount() {
    if(this.mUser && this.mUser.accountType === AccountType.ACCOUNT) {
      return true
    }
    return false
  }

  public isRewaste() {
    if(this.mUser && this.mUser.accountType === AccountType.ROOT_USER) {
      return true
    }
    return false
  }

  public isLoggedInUser(userId: number) {
    if(this.mUser && userId && this.mUser.id === userId) {
      return true
    }
    return false
  }
}
