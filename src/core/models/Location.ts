import Account, { IAccount } from './Account';
import Partner, { IPartner } from './Partner';
export enum LocationType {
    PRODUCER = "PRODUCER",
}

export type ILocation = {
    id: number
    partner: IPartner
    account: IAccount
    name: string
    locationType: LocationType
    latitude: number
    longitude: number
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    locationLogoFileId: string | null | undefined
    logoUrl: string | null | undefined
    isRemoved?: boolean
}

export type ILocationCreate = {
    accountId: number
    name: string
    locationType: LocationType
    latitude: number
    longitude: number
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    locationLogoFileId: string | null | undefined
}

type ILocationUpdatePreview = Omit<ILocationCreate, "accountId">;

export type ILocationUpdate = ILocationUpdatePreview & {
    id: number,
}

export default class Location {
    private mId: number
    public get id() {
      return this.mId
    }
  
    private mName: string
    public get name() {
      return this.mName
    }
  
    private mLocationType: LocationType
    public get locationType() {
      return this.mLocationType
    }

    private mLatitude: number
    public get latitude() {
      return this.mLatitude
    }

    private mLongitude: number
    public get longitude() {
      return this.mLongitude
    }

    private mAddress: string
    public get address() {
      return this.mAddress
    }

    private mCity: string
    public get city() {
      return this.mCity
    }

    private mState: string
    public get state() {
      return this.mState
    }

    private mCountry: string
    public get country() {
      return this.mCountry
    }

    private mPostalCode: string
    public get postalCode() {
      return this.mPostalCode
    }
    
    private mIsRemoved: boolean
    public get isRemoved() {
      return this.mIsRemoved
    }

    private mPartner: Partner|null|undefined
    public get partner() {
      return this.mPartner
    }

    private mAccount: Account|null|undefined
    public get account() {
      return this.mAccount
    }

    private mLogoUrl: string | null | undefined
    public get logoUrl() {
      return this.mLogoUrl
    }
  
    constructor(res: ILocation) {
      this.mId = res.id
      this.mName = res.name
      this.mLocationType = res.locationType
      this.mLatitude = res.latitude
      this.mLongitude = res.longitude
      this.mAddress = res.address
      this.mCity = res.city
      this.mState = res.state
      this.mCountry = res.country
      this.mPostalCode = res.postalCode
      this.mIsRemoved = res.isRemoved || false
      if(res.account) {
        this.mAccount = Account.initWithResult(res.account)
        this.mPartner = Partner.initWithResult(res.account.partner)
      }      
      this.mLogoUrl = res.logoUrl
    }
  
    public static initWithResult(res: ILocation): Location {
      let location: Location = undefined
      if (res.id) {
        location = new Location(res)
      }
      return location
    }
  
    public static initWithList(res: any): Location[] {
      let finalArray: Location[] = []
      for (let location of res) {
        let locationObj: Location = this.initWithResult(location)
        if(locationObj) {
          finalArray.push(locationObj)
        }
      }
      return finalArray
    }

    public getLocation(): ILocation {
      const ld: ILocation = {
        id: this.mId,
        partner: (this.mPartner) ? this.mPartner.getPartner(): undefined,
        account: (this.mAccount) ? this.mAccount.getAccount(): undefined,
        name: this.mName,
        locationType: this.mLocationType,
        latitude: this.mLatitude,
        longitude: this.mLongitude,
        address: this.mAddress,
        city: this.mCity,
        state: this.mState,
        country: this.mCountry,
        postalCode: this.mPostalCode,
        locationLogoFileId: '',
        logoUrl: this.mLogoUrl,
        isRemoved: this.mIsRemoved
      }
      return ld
    }
}

/*
    "id": 2,
    "name": "IKEA Burlington",
    "locationType": "PRODUCER",
    "latitude": 21.807104,
    "longitude": 73.0988544,
    "address": "1065 Plains Rd E, Burlington, ON L7T 4K1, Canada",
    "city": "Burlington",
    "state": "Ontario",
    "country": "Canada",
    "postalCode": "L7R",
    "isRemoved": false
*/