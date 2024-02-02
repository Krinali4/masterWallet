import dayjs, { Dayjs } from "dayjs"
import { ILocation } from "./Location"
import { ITag, TagType } from "./Tag"
import Tag from './Tag';
import Location from './Location';
import { IAccount } from './Account';
import Account from './Account';
import BatchMaterial, { IBatchMaterial } from "./BatchMaterial";
import BatchMaterialList from "./BatchMaterialList";
import Material from "./Material";

export type IUploadeBy = {
  email: string
}

export type IBatch = {
  id: number
  createdAt: string | null
  tag: ITag
  location: ILocation
  account: IAccount
  batchFileName: string
  batchFilePath: string
  uploadedBy: IUploadeBy
  materials: IBatchMaterial[]
  estimatedTotalWeight: number
}

export type IBatchCreate = {
  assignedTagCode: string
  assignedTagType: TagType
  partnerId: number
  accountId: number
  locationId: number
  uploadStartDt: string | null
  uploadEndDt: string | null
  batchFileName: string
  estimatedTotalWeight: number
}

export default class Batch {
  private mId: number
  public get id() {
    return this.mId
  }

  private mCreatedAt: Dayjs | null
  public get createdAt() {
    return this.mCreatedAt
  }

  private mTag: Tag|undefined
  public get tag() {
    return this.mTag
  }

  private mLocation: Location|undefined
  public get location() {
    return this.mLocation
  }

  private mAccount: Account|undefined
  public get account() {
    return this.mAccount
  }

  private mBatchFileName: string
  public get batchFileName() {
    return this.mBatchFileName
  }

  private mBatchFilePath: string
  public get batchFilePath() {
    return this.mBatchFilePath
  }

  private mUploadedBy: string
  public get uploadedBy() {
    return this.mUploadedBy
  }

  private mBatchMaterialList: BatchMaterialList
  public get batchMaterialList() {
    return this.mBatchMaterialList
  }

  private mEstimatedTotalWeight: number
  public get estimatedTotalWeight() {
    return this.mEstimatedTotalWeight
  }

  public displayStringCreatedAt() {
    if(this.mCreatedAt) {
      return this.mCreatedAt.format('MM/DD/YYYY')
    }
    return ''
  }

  public associatedBatchMaterialNames(): string[] {

    let bmNames: string[] = []
    let bmArr: Material[] = []
    if(this.mBatchMaterialList.batchMaterials.length > 0) {
      this.mBatchMaterialList.batchMaterials.forEach(bm => {
        bmArr.push(bm.material)
      });
    }
    const uniqueMaterialArr = Array.from(new Set(bmArr.map(bm => bm.id)))
    .map(id => {
      return bmArr.find(bm => bm.id === id)
    })

    if(uniqueMaterialArr.length > 0) {
      bmNames = uniqueMaterialArr.map((bm) => bm.name)
    }

    return bmNames
  }

  public associatedBatchMaterialTags(): Tag[] {
    let bmTagArr: Tag[] = []
    if(this.mBatchMaterialList.batchMaterials.length > 0) {
      const arr = this.mBatchMaterialList.batchMaterials
      arr.forEach(bm => {
        if(bm.tag) {
          bmTagArr.push(bm.tag)
        }
      });
    }

    if(bmTagArr.length > 0) {
      const uniqueTagArr = Array.from(new Set(bmTagArr.map(bm => bm.id)))
      .map(id => {
        return bmTagArr.find(bm => bm.id === id)
      })
      return uniqueTagArr
    }
    return[]
  }

  constructor(res: IBatch) {
    this.mId = res.id
    this.mCreatedAt = dayjs(res.createdAt)
    this.mTag = (res.tag) ? Tag.initWithResult(res.tag) : undefined
    this.mLocation = (res.location) ? Location.initWithResult(res.location) : undefined
    this.mAccount = (res.account) ? Account.initWithResult(res.account) : undefined
    this.mBatchFileName = res.batchFileName
    this.mBatchFilePath = res.batchFilePath
    this.mUploadedBy = (res.uploadedBy) ? res.uploadedBy.email : ''
    this.mBatchMaterialList = BatchMaterialList.default()
    const bmArr = BatchMaterial.initWithList(res.materials)
    this.mBatchMaterialList = BatchMaterialList.initWithBatchMaterials(bmArr)
    this.mEstimatedTotalWeight = res.estimatedTotalWeight
  }

  public static initWithResult(res: IBatch): Batch {
    let batch: Batch = undefined
    if (res.id) {
        batch = new Batch(res)
    }
    return batch
  }

  public static initWithList(res: any): Batch[] {
    let finalArray: Batch[] = []
    for (let batch of res) {
      let batchObj: Batch = this.initWithResult(batch)
      if(batchObj) {
        finalArray.push(batchObj)
      }
    }
    return finalArray
  }
}

/*

batch.tag.tagCode
batch.tag.tagAllocationType
batch.estimatedTotalWeight
Account??
batch.associatedBatchMaterialNames()

{
                    "id": 1,
                    "createdAt": "2022-12-31T00:00:00Z",
                    "tag": {
                        "id": 1,
                        "tagCode": "12",
                        "tagLastAction": "CREATED",
                        "tagActionModifiedAt": "2023-01-05T16:37:06.428483Z"
                    },
                    "location": {
                        "name": "IKEA Burlington"
                    },
                    "materials": [
                        {
                            "id": 1,
                            "weight": 1000,
                            "createdAt": "2022-12-01T00:30:00Z",
                            "material": {
                                "id": 1,
                                "name": "Strapping"
                            }
                        }
                    ]
                }
*/

/*
    "assignedTagCode":"12",
    "assignedTagType":"QRCODE",
    "partnerId": 1,
    "accountId": 1,
    "locationId": 1,
    "createdAt":"2022-12-31T00:00:00.000Z",
    "uploadStartDt": "2022-12-01T00:30:00.000Z",
    "uploadEndDt": "2022-12-31T00:00:00.000Z",
    "batchFileName": "batchFileName.xlsx"

    {
    "data": {
        "createBatch": {
            "id": 1
        }
    }
}
*/
