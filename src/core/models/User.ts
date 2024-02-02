import GeneralUtils from "../utils/GeneralUtils"

export enum AccountType {
  ROOT_USER = "ROOT_USER",
  PARTNER = "PARTNER",
  ACCOUNT = "ACCOUNT",
  UNKNOWN = "UNKNOWN",
}

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
  UNKNOWN = "UNKNOWN",
  MOBILE_ONLY = "MOBILE_ONLY",
}

export type IUser = {
  id: number
  name: string
  email: string
  title: string
  phoneNumCode: string
  phoneNum: string
  userRole: UserRole
  isActivated?: boolean
}

export type IUserCreate = {
  name: string
  email: string
  title: string
  phoneNum: string
  userRole: UserRole
}

type IUserUpdatePreview = Omit<IUserCreate, "email">;

export type IUserUpdate = IUserUpdatePreview & {
  id: number,
  isActivated?: boolean
}

export type ILoginResponse = {
  tokenType: string
  accessToken: number
  expiresIn: string
  refreshToken: string
  params: IUserParams
}

export type IUserParams = {
  accountType: AccountType
  primaryContact: string
  userId: string
  userRole: UserRole
  accountEntityId?: number|null|undefined
}
export default class User {
  private mId: number
  public get id() {
    return this.mId
  }

  private mName: string
  public get name() {
    return this.mName
  }

  private mEmail: string
  public get email() {
    return this.mEmail
  }

  private mAccountType: AccountType
  public get accountType() {
    return this.mAccountType
  }

  private mUserRole: UserRole
  public get userRole() {
    return this.mUserRole
  }

  private mAccountEntityId: number|null|undefined
  public get accountEntityId() {
    return this.mAccountEntityId
  }

  private mTitle: string
  public get title() {
    return this.mTitle
  }

  private mPhone: string
  public get phone() {
    return this.mPhone
  }

  private mIsActive: boolean
  public get isActive() {
    return this.mIsActive
  }

  constructor() {}

  private initWithLoginOrUserProfileResult(res: IUserParams) {
    this.mId = Number(res.userId)
    this.mEmail = res.primaryContact
    this.mAccountType = res.accountType
    this.mUserRole = res.userRole
    this.mAccountEntityId = res.accountEntityId
    this.mName = ''
    this.mTitle = ''
    this.mPhone = ''
    this.mIsActive = true
  }

  private initWithUserDetails(res: IUser) {
    this.mId = res.id
    this.mName = res.name
    this.mEmail = res.email
    this.mAccountType = AccountType.UNKNOWN
    this.mUserRole = res.userRole
    this.mTitle = (res.title) ? res.title : ''
    this.mPhone = (res.phoneNum) ? res.phoneNum : ''
    this.mIsActive = (res.isActivated) ? true : false
  }

  public static initWithResult(res: ILoginResponse): User {
    let user: User = undefined
    if (res.params) {
      user = new User()
      user.initWithLoginOrUserProfileResult(res.params)
    }
    return user
  }

  public static initWithUserProfile(res: IUserParams): User {
    let user: User = undefined
    if (res.userId) {
      user = new User()
      user.initWithLoginOrUserProfileResult(res)
    }
    return user
  }

  public static initWithUserDetails(u: IUser): User {
    let user: User = undefined
    if (u.id) {
      user = new User()
      user.initWithUserDetails(u)
    }
    return user
  }

  public static initWithList(res: any): User[] {
    
    let finalArray: User[] = []
    for (let user of res) {
      let userObj: User = this.initWithUserDetails(user)
      if(userObj) {
        finalArray.push(userObj)
      }
    }
    return finalArray
  }

  public getUser(): IUser {
    const phone = GeneralUtils.parsePhoneNumberWithFormat(this.mPhone)
    const ad: IUser = {
      id: this.mId,
      name: this.mName,
      email: this.mEmail,
      phoneNumCode: phone.phoneCode,
      phoneNum: phone.phone,
      title: this.mTitle,
      userRole: this.mUserRole,
      isActivated: this.mIsActive
    }
    return ad
  }

  public getUserRoleNameByValue(userRole: UserRole): string {
    if(userRole === UserRole.ADMIN) {
      return 'Full Access'
    } else if(userRole === UserRole.USER) {
      return 'Read Only'
    } else if(userRole === UserRole.MODERATOR) {
      return 'Moderator'
    } else if(userRole === UserRole.SUPER_ADMIN) {
      return 'Super Admin'
    } else if(userRole === UserRole.MOBILE_ONLY) {
      return 'Mobile Only'
    }
    return 'Unknown'
  }

  public isSuperAdminRole() {
    if(this.mAccountType === AccountType.ROOT_USER && 
      (this.mUserRole === UserRole.SUPER_ADMIN || this.mUserRole === UserRole.ADMIN)) {
      return true
    }
    return false
  }

  public isSuperAdminUserRole() {
    if(this.mAccountType === AccountType.ROOT_USER && 
      this.mUserRole === UserRole.USER) {
      return true
    }
    return false
  }

  public isPartnerAdminRole() {
    if(this.mAccountType === AccountType.PARTNER && 
      (this.mUserRole === UserRole.SUPER_ADMIN || this.mUserRole === UserRole.ADMIN)) {
      return true
    }
    return false
  }

  public isPartnerUserRole() {
    if(this.mAccountType === AccountType.PARTNER && 
      this.mUserRole === UserRole.USER) {
      return true
    }
    return false
  }

  public isAccountAdminRole() {
    if(this.mAccountType === AccountType.ACCOUNT && 
      (this.mUserRole === UserRole.SUPER_ADMIN || this.mUserRole === UserRole.ADMIN)) {
      return true
    }
    return false
  }

  public isAccountUserRole() {
    if(this.mAccountType === AccountType.ACCOUNT && 
      this.mUserRole === UserRole.USER) {
      return true
    }
    return false
  }
}

/*{
    "tokenType": "Bearer",
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzIzMTA4NDcsImlhdCI6MTY3MjIyNDQ0NywiYWNjb3VudFR5cGUiOiJST09UX1VTRVIiLCJwcmltYXJ5Q29udGFjdCI6ImhpcmVuQHdhcnBzcGQuYWkiLCJ1c2VySWQiOjEsInVzZXJSb2xlIjoiU1VQRVJfQURNSU4iLCJhY2NvdW50RW50aXR5SWQiOm51bGx9.IdUIGyTLzuGO53q9miPND5t5QWLtw5R1ZHdkHSKS_XQ",
    "expiresIn": 86399,
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzQ4MTY0NDcsImlhdCI6MTY3MjIyNDQ0NywiYWNjb3VudFR5cGUiOiJST09UX1VTRVIiLCJwcmltYXJ5Q29udGFjdCI6ImhpcmVuQHdhcnBzcGQuYWkiLCJ1c2VySWQiOjEsInVzZXJSb2xlIjoiU1VQRVJfQURNSU4iLCJhY2NvdW50RW50aXR5SWQiOm51bGx9.2w4FNiNgfNEhjBWRkJnNB6tFwLewJTMBDc4LCk9wab4",
    "params": {
        "accountType": "ROOT_USER",
        "primaryContact": "hiren@warpspd.ai",
        "userId": "1",
        "userRole": "SUPER_ADMIN"
    }
}*/

/*
    "id": 3,
    "name": "partner_sub_user_1",
    "email": "partner_sub_user_1@yopmail.com",
    "userRole": "USER"
*/
