import GeneralUtils from "../utils/GeneralUtils"
import Material, { IUploadMaterial } from "./Material"
import { IExcelRow } from "./UploadBatch"

export default class MaterialList {
  public static pageSize: number = 10 // default page size

  private mCurrentPage: number
  public get currentPage() {
    return this.mCurrentPage
  }

  private mPerPageItems: number
  public get perPageItems() {
    return this.mPerPageItems
  }

  private mCurrentPageItems: number
  public get currentPageItems() {
    return this.mCurrentPageItems
  }

  private mTotalItems: number
  public get totalItems() {
    return this.mTotalItems
  }

  private mTotalPagesCount: number
  public get totalPagesCount() {
    return this.mTotalPagesCount
  }

  private mMaterials: Material[]
  public get materials() {
    return this.mMaterials
  }

  private mTotalWeight: number
  public get totalWeight() {
    return this.mTotalWeight
  }

  public constructor() {}

  public static default(): MaterialList {
    const defMaterialList = new MaterialList()
    defMaterialList.initWithDefault()
    return defMaterialList
  }

  public initWithDefault() {
    this.mCurrentPage = 0
    this.mPerPageItems = MaterialList.pageSize
    this.mCurrentPageItems = 0
    this.mTotalItems = 0
    this.mTotalPagesCount = 0
    this.mTotalWeight = 0
    this.mMaterials = []
  }

  public init(
    itemsResult: any,
    previousMaterialList: MaterialList | null | undefined
  ) {
    let records =
      itemsResult.data && Array.isArray(itemsResult.data)
        ? itemsResult.data
        : []
    this.mCurrentPage = 0
    this.mPerPageItems = MaterialList.pageSize
    this.mCurrentPageItems = records.length
    this.mTotalItems = itemsResult.total
    this.mTotalWeight = 0
    this.mTotalPagesCount = this.getPagesCount()

    let finalAccounts: Material[] = []
    let previousAccounts: Material[] = []
    const newAccounts = Material.initWithList(records)
    if (this.mCurrentPage !== 0) {
      finalAccounts = finalAccounts.concat(previousAccounts)
    }
    finalAccounts = finalAccounts.concat(newAccounts)
    this.mMaterials = finalAccounts
    this.calculateTotalAndPercentages()
  }

  public initWithMaterialArray(mArr: Material[]) {
    this.mCurrentPage = 0
    this.mPerPageItems = mArr.length
    this.mCurrentPageItems = mArr.length
    this.mTotalItems = mArr.length
    this.mTotalPagesCount = this.getPagesCount()
    this.mTotalWeight = 0
    this.mMaterials = mArr
    this.calculateTotalAndPercentages()
  }

  public calculateTotalAndPercentages() {
    const weightArr = this.mMaterials.map((m) => m.weight)
    const totalWeight = weightArr.reduce((partialSum, a) => partialSum + a, 0)
    this.mMaterials.forEach((mObj) => {
      const per = Number((mObj.weight / totalWeight) * 100).toFixed(2)
      mObj.setPercentage(Number(per))
    })
    this.mTotalWeight = totalWeight
  }

  public static initWithResult(
    result: any,
    previousMaterialList: MaterialList | null | undefined
  ): MaterialList | undefined {
    let mList: MaterialList = undefined
    mList = new MaterialList()
    mList.init(result, previousMaterialList)
    return mList
  }

  private getPagesCount = () => {
    let totalPageCount = GeneralUtils.calculatePagesCount(
      this.mPerPageItems,
      this.mTotalItems
    )
    return totalPageCount
  }

  /* compare it with excel sheet results */
  public static filterMaterialList(
    withExelRowItems: IExcelRow[],
    masterList: MaterialList
  ): {
    materialList: MaterialList | undefined;
    unknownMaterialList: IExcelRow[];
  } {
    console.log('masterList =>'+JSON.stringify(masterList))
    console.log('withExelRowItems =>'+JSON.stringify(withExelRowItems))
    let mList: MaterialList = undefined
    let materialArr: Material[] = []
    let unknownMaterialArr: IExcelRow[] = []
    withExelRowItems.forEach((item) => {
      const materialFoundArr = masterList.materials.filter(
        (material) =>
          material.name.toLowerCase() === item.material.toLowerCase()
      )
      if (materialFoundArr && materialFoundArr.length > 0) {
        const foundMaterialObj = materialFoundArr[0]
        // unique objects and add total weights
        let isMaterialAdded = materialArr.find(
          (m) => m.id === foundMaterialObj.id
        )
        if (isMaterialAdded) {
          const index = materialArr.indexOf(isMaterialAdded)
          if (index !== -1) {
            // addition of weights
            let newTotalWeight = isMaterialAdded.weight + item.collected_weight
            isMaterialAdded.setWeight(newTotalWeight)
            materialArr[index] = isMaterialAdded
          }
        } else {
          // Add new
          materialArr.push(
            Material.getMaterialFromExcelRow(item, foundMaterialObj)
          )
        }
      } else {
        unknownMaterialArr.push(item)
      }
    })
    mList = new MaterialList()
    mList.initWithMaterialArray(materialArr)
    return {
      materialList: mList,
      unknownMaterialList:unknownMaterialArr
    }
  }

  // convert material list to upload material object
  public getUploadMaterialList(): IUploadMaterial[] {
    let uMaterialArr: IUploadMaterial[] = []
    if (this.mMaterials.length > 0) {
      this.mMaterials.forEach((m) => {
        const { id, name, weight, defaultWeightScale } = m
        uMaterialArr.push({ id, name, weight, defaultWeightScale })
      })
    }
    return uMaterialArr
  }
}
