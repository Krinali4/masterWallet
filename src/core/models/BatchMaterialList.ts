import GeneralUtils from "../utils/GeneralUtils"
import BatchMaterial from "./BatchMaterial"
import Tag from "./Tag"

export default class BatchMaterialList {
  private mTotalItems: number
  public get totalItems() {
    return this.mTotalItems
  }

  private mBatchMaterials: BatchMaterial[]
  public get batchMaterials() {
    return this.mBatchMaterials
  }

  public constructor() {}

  public static default(): BatchMaterialList {
    const defBatchList = new BatchMaterialList()
    defBatchList.initWithDefault()
    return defBatchList
  }

  public initWithDefault() {
    this.mTotalItems = 0
    this.mBatchMaterials = []
  }

  public static initWithBatchMaterials(
    bmArr: BatchMaterial[]
  ): BatchMaterialList {
    const bmList = new BatchMaterialList()
    bmList.mBatchMaterials = bmArr
    bmList.mTotalItems = bmArr.length
    return bmList
  }

  public static initWithResult(result: any): BatchMaterialList | undefined {
    let bmList: BatchMaterialList = new BatchMaterialList()
    let records = result.data && Array.isArray(result.data) ? result.data : []
    const bmArr = BatchMaterial.initWithList(records)
    bmList.mBatchMaterials = bmArr
    bmList.mTotalItems = bmArr.length
    return bmList
  }

  public getMaterialBinTotalWeight() {
    // array of batch material weight sum
    if(this.batchMaterials.length > 0) {
      const weightOfEachMat = this.batchMaterials.map(bm => bm.weight)
      const sum = weightOfEachMat.reduce((partialSum, a) => partialSum + a, 0);
      return sum
    }
    return 0
  }

  public getMaterialName() {
    if(this.mBatchMaterials.length > 0) {
      return this.mBatchMaterials[0].material.name
    }
    return ''
  }

  public associatedBatchTags(): Tag[] {
    let bmTagArr: Tag[] = []
    if(this.batchMaterials.length > 0) {
      this.batchMaterials.forEach(bm => {
        bmTagArr.push(bm.batch.tag)
      });
    }
    const uniqueTags = Array.from(new Set(bmTagArr.map(bm => bm.id)))
    .map(id => {
      return bmTagArr.find(bm => bm.id === id)
    })
    return uniqueTags
  } 
}
