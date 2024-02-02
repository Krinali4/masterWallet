import Tag, { TagType, ITag } from './Tag';
import dayjs, { Dayjs } from "dayjs"
import { IMaterial } from "./Material"
import Material from './Material';
import { IBatch } from './Batch';
import Batch from './Batch';

export type IBatchMaterial = {
  id: number
  weight: number
  createdAt: string | null
  material: IMaterial
  tag: ITag
  batch: IBatch
}

export type IBatchMaterialCreate = {
  batchId: number
  assignedTagCode: string
  assignedTagType: TagType
  materialId: number
  weight: number
  isRecycled: boolean
}

export default class BatchMaterial {
  private mId: number
  public get id() {
    return this.mId
  }

  private mWeight: number
  public get weight() {
    return this.mWeight
  }

  private mCreatedAt: Dayjs | null
  public get createdAt() {
    return this.mCreatedAt
  }

  private mMaterial: Material|undefined
  public get material() {
    return this.mMaterial
  }

  private mTag: Tag
  public get tag() {
    return this.mTag
  }

  private mBatch: Batch
  public get batch() {
    return this.mBatch
  }

  public associatedBatchTags(): Tag[] {
    let bmTagArr: Tag[] = []
    if(this.mBatch.tag) {
      bmTagArr.push(this.mBatch.tag)
    }
    return bmTagArr
  }

  constructor(res: IBatchMaterial) {
    this.mId = res.id
    this.mWeight = res.weight
    this.mCreatedAt = dayjs(res.createdAt)
    this.mMaterial = (res.material) ? Material.initWithResult(res.material) : undefined
    this.mTag = (res.tag) ? Tag.initWithResult(res.tag) : undefined
    this.mBatch = (res.batch) ? Batch.initWithResult(res.batch) : undefined
  }

  public static initWithResult(res: IBatchMaterial): BatchMaterial {
    let batchM: BatchMaterial = undefined
    if (res.id) {
        batchM = new BatchMaterial(res)
    }
    return batchM
  }

  public static initWithList(res: IBatchMaterial[]): BatchMaterial[] {
    let finalArray: BatchMaterial[] = []
    if(res && Array.isArray(res) && res.length > 0) {
      for (let batch of res) {
        let batchObj: BatchMaterial = this.initWithResult(batch)
        if(batchObj) {
          finalArray.push(batchObj)
        }
      }
    }
    return finalArray
  }
}

/*
    "assignedTagCode":"123",
    "assignedTagType":"QRCODE",
    "materialId": 1,
    "batchId": 1,
    "weight":1000,
    "createdAt": "2022-12-01T00:30:00.000Z",
    "isRecycled": true

    {
    "data": {
        "importMaterial": {
            "id": 1
        }
    }

    {
                    "id": 1,
                    "weight": 1000,
                    "createdAt": "2022-12-01T00:30:00Z",
                    "material": {
                        "id": 1,
                        "name": "Strapping"
                    }
                }
}
*/
