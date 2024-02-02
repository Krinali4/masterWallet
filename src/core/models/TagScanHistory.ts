import dayjs, { Dayjs } from "dayjs"
import Location, { ILocation } from "./Location"

export enum TagActionType {
  CREATED = "CREATED",
  CHECK_IN = "CHECK_IN",
  CHECK_OUT = "CHECK_OUT",
  LOC_UPDATE = "LOC_UPDATE",
  ADD_WEIGHT = "ADD_WEIGHT",
  TRANSFER = "TRANSFER",
  RECYCLED = "RECYCLED",
  SORTED = "SORTED",
}

export type ITagScannedBy = {
  email: string
}

export type ITagScanHistory = {
  id: number
  tagId: number
  tagAction: TagActionType
  scannedLat: number
  scannedLong: number
  scannedLocation: ILocation
  scannedAt: string
  scannedBy: ITagScannedBy
  tagHolderImages: string[]|null|undefined
  locality: string|null|undefined,
  city: string|null|undefined,
  state: string|null|undefined,
  country: string|null|undefined
}

export default class TagScanHistory {
  private mId: number
  public get id() {
    return this.mId
  }

  private mTagId: number
  public get tagId() {
    return this.mTagId
  }

  private mTagAction: TagActionType
  public get tagAction() {
    return this.mTagAction
  }

  private mScannedLat: number
  public get scannedLat() {
    return this.mScannedLat
  }

  private mScannedLong: number
  public get scannedLong() {
    return this.mScannedLong
  }

  private mScannedAt: Dayjs | null
  public get scannedAt() {
    return this.mScannedAt
  }

  private mGeoLocationName: string
  public get geoLocationName() {
    return this.mGeoLocationName
  }

  private mScannedBy: string
  public get scannedBy() {
    return this.mScannedBy
  }

  private mAttachedImageUrl: string
  public get attachedImageUrl() {
    return this.mAttachedImageUrl
  }

  private mScannedLocation: Location
  public get scannedLocation() {
    return this.mScannedLocation
  }

  private mLocality: string
  public get locality() {
    return this.mLocality
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

  public displayScannedAt() {
    if (this.mScannedAt) {
      return this.mScannedAt.format("MM/DD/YYYY HH:mm")
    }
    return ""
  }

  public displayScannedAtDate() {
    if (this.mScannedAt) {
      return this.mScannedAt.format("MM/DD/YYYY")
    }
    return ""
  }

  public displayScannedAtTime() {
    if (this.mScannedAt) {
      return this.mScannedAt.format("hh:mm A")
    }
    return ""
  }

  public getSmallImageUrl() {
    if(this.mAttachedImageUrl && this.mAttachedImageUrl.length > 0) {
      //,w_262,h_133
      const baseImgUrl = 'https://res.cloudinary.com/fhdev/image/fetch/q_auto:best,fl_lossy,f_jpg,fl_progressive/'
      const finalUrl = baseImgUrl + this.mAttachedImageUrl
      return finalUrl
    }
    return ""
  }

  public setGeoLocationName(gName: string) {
    this.mGeoLocationName = gName
  }

  constructor(res: ITagScanHistory) {
    if(res) {
      this.mId = res.id
      this.mTagId = res.tagId
      this.mTagAction = res.tagAction
      this.mScannedLat = res.scannedLat
      this.mScannedLong = res.scannedLong
      this.mScannedLocation = (res.scannedLocation) ? Location.initWithResult(res.scannedLocation) : undefined
      this.mScannedAt = dayjs(res.scannedAt)
      this.mScannedBy = res.scannedBy ? res.scannedBy.email : ""
      this.mAttachedImageUrl = ""
      if(res.tagHolderImages && Array.isArray(res.tagHolderImages) && res.tagHolderImages.length > 0) {
        this.mAttachedImageUrl = res.tagHolderImages[0]
      }

      this.mLocality = res.locality ? res.locality : ''
      this.mCity = res.city ? res.city : ''
      this.mState = res.state ? res.state : ''
      this.mCountry = res.country ? res.country : ''

      let displayGeoName = ''
      let city = ''
      let state = ''
      if(this.mCity.length > 0){
        city = this.mCity
      } else if(this.mLocality.length > 0){
        city = this.mLocality
      }

      if(this.mState.length > 0) {
        state = `${this.mState}`
      }

      if(city.length > 0 && state.length > 0) {
          displayGeoName = `${city}/${state}`
      } else if(city.length > 0) {
          displayGeoName = `${city}`
      } else if(state.length > 0) {
          displayGeoName = `${state}`
      }
      this.mGeoLocationName = displayGeoName
    }
    
  }

  public getDisplayTagActionType(): string {
    let tagActionTypeStr = ""
    switch (this.mTagAction) {
      case TagActionType.CREATED:
        tagActionTypeStr = "Tag Assigned"
        break
      case TagActionType.CHECK_IN:
        tagActionTypeStr = "Checked In"
        break
      case TagActionType.CHECK_OUT:
        tagActionTypeStr = "Checked Out"
        break
      case TagActionType.LOC_UPDATE:
        tagActionTypeStr = "Tag Scanned"
        break
      case TagActionType.ADD_WEIGHT:
        tagActionTypeStr = "Weight Added"
        break
      case TagActionType.TRANSFER:
        tagActionTypeStr = "Transferred"
        break
      case TagActionType.RECYCLED:
        tagActionTypeStr = "Processed"
        break
      case TagActionType.SORTED:
          tagActionTypeStr = "Sorted"
          break
      default:
        tagActionTypeStr = `${this.mTagAction}`
        break
    }
    return tagActionTypeStr
  }

  public static initWithResult(res: ITagScanHistory): TagScanHistory {
    let tagScanHistory: TagScanHistory = undefined
    // if (res.id) {
    tagScanHistory = new TagScanHistory(res)
    // }
    return tagScanHistory
  }

  public static initWithList(res: any): TagScanHistory[] {
    let finalArray: TagScanHistory[] = []
    for (let report of res) {
      let reportObj: TagScanHistory = this.initWithResult(report)
      if (reportObj) {
        finalArray.push(reportObj)
      }
    }
    return finalArray
  }

  public displayLocationTitle() {
    if(this.mGeoLocationName.length > 0) {
      return this.mGeoLocationName
    }
    if(this.mScannedLat && this.mScannedLong) {
      return `${this.mScannedLat.toFixed(6)}, ${this.mScannedLong.toFixed(6)}`
    }
    return ''
  }
}
