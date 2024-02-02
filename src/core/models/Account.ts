import GeneralUtils from "../utils/GeneralUtils"
import Partner, { IPartner } from './Partner';

export type IAccount = {
    id: number
    partner: IPartner
    name: string
    logoImageId: string | null | undefined
    contactName: string
    contactEmailId: string
    contactPhoneNumCode: string
    contactPhoneNum: string
    logoUrl: string | null | undefined
    isActivated?: boolean
  }

  export type IAccountCreate = {
    name: string
    partnerId: number
    contactName: string
    contactEmailId: string
    contactPhoneNum: string
    logoImageId: string | null | undefined
  }
  
  type IAccountUpdatePreview = Omit<IAccountCreate, "partnerId">;

  export type IAccountUpdate = IAccountUpdatePreview & {
    id: number,
  }
  
  export default class Account {
    private mUserId: number
    public get userId() {
      return this.mUserId
    }
  
    private mName: string
    public get name() {
      return this.mName
    }
  
    private mContactName: string
    public get contactName() {
      return this.mContactName
    }
  
    private mContactmail: string
    public get contactEmail() {
      return this.mContactmail
    }
  
    private mContactPhone: string
    public get contactPhone() {
      return this.mContactPhone
    }
  
    private mLogoUrl: string | null | undefined
    public get logoUrl() {
      return this.mLogoUrl
    }
  
    private mIsActive: boolean
    public get isActive() {
      return this.mIsActive
    }

    private mPartner: Partner|null|undefined
    public get partner() {
      return this.mPartner
    }
  
    constructor(res: IAccount) {
      this.mUserId = res.id
      this.mName = res.name
      this.mContactName = res.contactName
      this.mContactmail = res.contactEmailId
      this.mContactPhone = res.contactPhoneNum
      this.mLogoUrl = res.logoUrl
      this.mIsActive = res.isActivated
      this.mPartner = Partner.initWithResult(res.partner)
    }
  
    public static initWithResult(res: IAccount): Account {
      let account: Account = undefined
      if (res.id) {
        account = new Account(res)
      }
      return account
    }
  
    public static initWithList(res: any): Account[] {
      let finalArray: Account[] = []
      for (let account of res) {
        let accountObj: Account = this.initWithResult(account)
        if(accountObj) {
          finalArray.push(accountObj)
        }
      }
      return finalArray
    }

    public getAccount(): IAccount {
      const phone = GeneralUtils.parsePhoneNumberWithFormat(this.mContactPhone)
      const ad: IAccount = {
        id: this.mUserId,
        partner: (this.mPartner) ? this.mPartner.getPartner() : undefined,
        name: this.mName,
        contactName: this.mContactName,
        contactEmailId: this.mContactmail,
        contactPhoneNumCode: phone.phoneCode,
        contactPhoneNum: phone.phone,
        logoImageId: '',
        logoUrl: this.mLogoUrl
      }
      return ad
    }
  }
  