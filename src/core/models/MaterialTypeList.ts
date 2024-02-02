import GeneralUtils from "../utils/GeneralUtils"
import DropdownItem from "./DropdownItem"
import MaterialType from "./MaterialType"

export default class MaterialTypeList {
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

  private mMaterialTypes: MaterialType[]
  public get materialTypes() {
    return this.mMaterialTypes
  }

  private mTotalWeight: number
  public get totalWeight() {
    return this.mTotalWeight
  }

  private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

  public constructor() {}

  public static default(): MaterialTypeList {
    const defMaterialTypeList = new MaterialTypeList()
    defMaterialTypeList.initWithDefault()
    return defMaterialTypeList
  }

  public initWithDefault() {
    this.mCurrentPage = 0
    this.mPerPageItems = MaterialTypeList.pageSize
    this.mCurrentPageItems = 0
    this.mTotalItems = 0
    this.mTotalPagesCount = 0
    this.mTotalWeight = 0
    this.mMaterialTypes = []
    this.mDropDownItems = []
  }

  public init(
    itemsResult: any,
    previousMaterialTypeList: MaterialTypeList | null | undefined
  ) {
    let records =
      itemsResult.data && Array.isArray(itemsResult.data)
        ? itemsResult.data
        : []
    this.mCurrentPage = 0
    this.mPerPageItems = MaterialTypeList.pageSize
    this.mCurrentPageItems = records.length
    this.mTotalItems = itemsResult.total
    this.mTotalWeight = 0
    this.mTotalPagesCount = this.getPagesCount()

    let finalMaterialTypes: MaterialType[] = []
    let previousMTypes: MaterialType[] = []
    const newMaterailTypes = MaterialType.initWithList(records)
    if (this.mCurrentPage !== 0) {
        finalMaterialTypes = finalMaterialTypes.concat(previousMTypes)
    }
    finalMaterialTypes = finalMaterialTypes.concat(newMaterailTypes)
    this.mMaterialTypes = finalMaterialTypes
    this.mDropDownItems = this.setupDropDownData(finalMaterialTypes)
  }

  public initWithMaterialTypeArray(mArr: MaterialType[]) {
    this.mCurrentPage = 0
    this.mPerPageItems = mArr.length
    this.mCurrentPageItems = mArr.length
    this.mTotalItems = mArr.length
    this.mTotalPagesCount = this.getPagesCount()
    this.mTotalWeight = 0
    this.mMaterialTypes = mArr
    this.mDropDownItems = this.setupDropDownData(mArr)
  }

  public static initWithResult(
    result: any,
    previousMaterialTypeList: MaterialTypeList | null | undefined
  ): MaterialTypeList | undefined {
    let mList: MaterialTypeList = undefined
    mList = new MaterialTypeList()
    mList.init(result, previousMaterialTypeList)
    return mList
  }

  private getPagesCount = () => {
    let totalPageCount = GeneralUtils.calculatePagesCount(
      this.mPerPageItems,
      this.mTotalItems
    )
    return totalPageCount
  }

  private setupDropDownData(pArr: MaterialType[]) {
    let arr: DropdownItem[] = []
    pArr.forEach(mt => {
      arr.push(new DropdownItem(mt.id,mt.name))
    });
    return arr
  }

  public findMaterialTypeById(mtId: number): MaterialType {
    let materialType: MaterialType = undefined
    materialType = this.materialTypes.find((item: MaterialType) => item.id === mtId)    
    return materialType
  }

  public static getDummyMaterialTypeList = () => {
    const jsonResStr = "{\"total\":6,\"data\":[{\"id\":1,\"name\":\"Plastic\",\"isActivated\":true,\"isRemoved\":false},{\"id\":2,\"name\":\"PPE\",\"isActivated\":true,\"isRemoved\":false},{\"id\":3,\"name\":\"Metal\",\"isActivated\":true,\"isRemoved\":false},{\"id\":4,\"name\":\"Card Board\",\"isActivated\":true,\"isRemoved\":false},{\"id\":5,\"name\":\"Electronics\",\"isActivated\":true,\"isRemoved\":false},{\"id\":6,\"name\":\"General Waste\",\"isActivated\":true,\"isRemoved\":false}]}"
    const result = JSON.parse(jsonResStr)
    return this.initWithResult(result,undefined)
}
}
