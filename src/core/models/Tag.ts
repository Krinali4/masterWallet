import dayjs, { Dayjs } from "dayjs"
import TagScanHistory, { TagActionType } from './TagScanHistory';
import { ITagScanHistory } from './TagScanHistory';

export enum TagType {
  QRCODE = "QRCODE",
}

export enum TagAllocationType {
  BATCH = "BATCH",
  MATERIAL= "MATERIAL"
}

export type ITag = {
  id: number
  tagCode: string
  tagLastAction: TagActionType
  tagActionModifiedAt: string | null
  tagType: TagType,
  tagAllocationType: TagAllocationType
  totalWeight: number|undefined
  lastTrackingItem: ITagScanHistory
}

export default class Tag {
  private mId: number
  public get id() {
    return this.mId
  }

  private mTagCode: string
  public get tagCode() {
    return this.mTagCode
  }

  private mTagLastAction: string
  public get tagLastAction() {
    return this.mTagLastAction
  }

  private mTagActionModifiedAt: Dayjs | null
  public get tagActionModifiedAt() {
    return this.mTagActionModifiedAt
  }

  private mTagType: TagType
  public get tagType() {
    return this.mTagType
  }

  private mTagAllocationType: TagAllocationType
  public get tagAllocationType() {
    return this.mTagAllocationType
  }

  private mTotalWeight: number
  public get totalWeight() {
    return this.mTotalWeight
  }

  private mLastTrackingItem: TagScanHistory
  public get lastTrackingItem() {
    return this.mLastTrackingItem
  }

  constructor(res: ITag) {
    this.mId = res.id
    this.mTagCode = res.tagCode
    this.mTagLastAction = res.tagLastAction
    this.mTagActionModifiedAt = dayjs(res.tagActionModifiedAt)
    this.mTagType = res.tagType
    this.mTagAllocationType = res.tagAllocationType
    this.mLastTrackingItem = undefined
    this.mTotalWeight = (res.totalWeight) ? res.totalWeight : 0
    if(res.lastTrackingItem) {
      this.mLastTrackingItem = TagScanHistory.initWithResult(res.lastTrackingItem)
    }
  }

  public static initWithResult(res: ITag): Tag {
    let tag: Tag = undefined
    if (res.id) {
        tag = new Tag(res)
    }
    return tag
  }

  public static initWithList(res: any): Tag[] {
    let finalArray: Tag[] = []
    for (let report of res) {
      let reportObj: Tag = this.initWithResult(report)
      if (reportObj) {
        finalArray.push(reportObj)
      }
    }
    return finalArray
  }

  public getDisplayLastTagActionType(): string {
    let tagActionTypeStr = ""
    switch (this.mTagLastAction) {
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
        tagActionTypeStr = `${this.mTagLastAction}`
        break
    }
    return tagActionTypeStr
  }
}