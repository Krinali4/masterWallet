import GeneralUtils from "../utils/GeneralUtils"

export type IPartner = {
  id: number
  name: string
  logoImageId: string | null | undefined
  contactName: string
  contactEmailId: string
  contactPhoneNumCode: string
  contactPhoneNum: string
  logoUrl: string | null | undefined
  isActivated?: boolean
}

export type IPartnerCreate = {
  name: string
  contactName: string
  contactEmailId: string
  contactPhoneNum: string
  logoImageId: string | null | undefined
}

export type IPartnerUpdate = IPartnerCreate & {
  id: number
}
export default class Partner {
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

  constructor(res: IPartner) {
    this.mUserId = res.id
    this.mName = res.name
    this.mContactName = res.contactName
    this.mContactmail = res.contactEmailId
    this.mContactPhone = res.contactPhoneNum
    this.mLogoUrl = res.logoUrl
    this.mIsActive = res.isActivated
  }

  public static initWithResult(res: IPartner): Partner {
    let partner: Partner = undefined
    if (res && res.id) {
      partner = new Partner(res)
    }
    return partner
  }

  public static initWithList(res: any): Partner[] {
    let finalArray: Partner[] = []
    for (let partner of res) {
      let partnerObj: Partner = this.initWithResult(partner)
      if(partnerObj) {
        finalArray.push(partnerObj)
      }
    }
    return finalArray
  }

  public getPartner(): IPartner {
    const phone = GeneralUtils.parsePhoneNumberWithFormat(this.mContactPhone)
    const pd: IPartner = {
      id: this.mUserId,
      name: this.mName,
      contactName: this.mContactName,
      contactEmailId: this.mContactmail,
      contactPhoneNumCode: phone.phoneCode,
      contactPhoneNum: phone.phone,
      logoImageId: '',
      logoUrl: this.mLogoUrl
    }
    return pd
  }
}
