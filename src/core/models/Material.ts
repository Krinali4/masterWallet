import TextUtils from "../utils/TextUtils"
import DropdownItem from "./DropdownItem"
import { IExcelRow } from "./UploadBatch"
import Tag, { ITag } from './Tag';
import MaterialType, { IMaterialType } from './MaterialType';

// export enum MaterialType {
//   PLASTIC = "PLASTIC",
//   PPE = "PPE",
//   METAL = "METAL",
//   CARDBOARD = "CARDBOARD",
//   ELECTRONICS = "ELECTRONICS",
//   GENERAL_WASTE = "GENERAL_WASTE",
// }

export enum WeightScale {
  KG = "KG",
  GRAM = "GRAM",
  OUNCE = "OUNCE",
  POUNDS = "POUNDS",
}

export type IMaterial = {
  id: number
  name: string
  materialType: IMaterialType
  defaultWeightScale: WeightScale
  isRemoved?: boolean
  weight?: number
  percentage?: number
}

export type IMaterialCreate = {
  name: string
  materialTypeId: number
  defaultWeightScale: WeightScale
}

export type IMaterialUpdate = IMaterialCreate & {
  id: number
}

export type IUploadMaterial = {
  id: number
  name: string
  defaultWeightScale: WeightScale
  weight?: number
}

export default class Material {
  private mId: number
  public get id() {
    return this.mId
  }

  private mName: string
  public get name() {
    return this.mName
  }

  private mMaterialType: MaterialType
  public get materialType() {
    return this.mMaterialType
  }

  private mDefaultWeightScale: WeightScale
  public get defaultWeightScale() {
    return this.mDefaultWeightScale
  }

  private mIsRemoved: boolean
  public get isRemoved() {
    return this.mIsRemoved
  }

  private mWeight: number
  public get weight() {
    return this.mWeight
  }

  private mPercentage: number
  public get parcentage() {
    return this.mPercentage
  }

  constructor(res: IMaterial) {
    this.mId = res.id
    this.mName = res.name
    this.mMaterialType = (res.materialType) ? MaterialType.initWithMaterialType(res.materialType) : undefined
    this.mDefaultWeightScale = res.defaultWeightScale
    this.mIsRemoved = res.isRemoved || false
    this.mWeight = res.weight ? res.weight : 0
    this.mPercentage = 0
  }

  public setWeight(newWeight: number) {
    this.mWeight = newWeight
  }

  public setPercentage(newPercentage: number) {
    this.mPercentage = newPercentage
  }

  public static initWithResult(res: IMaterial): Material {
    let material: Material = undefined
    if (res.id) {
      material = new Material(res)
    }
    return material
  }

  public static initWithList(res: any): Material[] {
    let finalArray: Material[] = []
    for (let material of res) {
      let materialObj: Material = this.initWithResult(material)
      if (materialObj) {
        finalArray.push(materialObj)
      }
    }
    return finalArray
  }

  public getMaterial(): IMaterial {
    const md: IMaterial = {
      id: this.mId,
      name: this.mName,
      materialType: (this.mMaterialType) ? this.mMaterialType.getMaterialType() : undefined,
      defaultWeightScale: this.mDefaultWeightScale,
      isRemoved: this.mIsRemoved,
      weight: this.mWeight,
      percentage: this.mPercentage,
    }
    return md
  }

  // public static materialTypeList() {
  //   const mtArr = Object.values(MaterialType)
  //   let arr: DropdownItem[] = []
  //   mtArr.forEach((material) => {
  //     arr.push(new DropdownItem(material, Material.displayMaterialType(material)))
  //   })
  //   return arr
  // }

  public static weightScaleList() {
    const wsArr = Object.values(WeightScale)
    let arr: DropdownItem[] = []
    wsArr.forEach((weightscale) => {
      arr.push(new DropdownItem(weightscale, weightscale))
    })
    return arr
  }

  public static getMaterialFromExcelRow(
    excelRow: IExcelRow,
    originalMaterial: Material
  ): Material {
    let mObj: Material = undefined
    mObj = new Material(originalMaterial.getMaterial())
    mObj.mWeight = excelRow.collected_weight // always in grams
    return mObj
  }

  // public static displayMaterialType(mType: MaterialType) {
  //   let displayStr = ""
  //   switch (mType) {
  //     case MaterialType.PLASTIC:
  //       displayStr = "Plastic"
  //       break
  //     case MaterialType.PPE:
  //       displayStr = "PPE"
  //       break
  //     case MaterialType.METAL:
  //       displayStr = "Metal"
  //       break
  //     case MaterialType.CARDBOARD:
  //       displayStr = "Card Board"
  //       break
  //     case MaterialType.ELECTRONICS:
  //       displayStr = "Electronics"
  //       break
  //     case MaterialType.GENERAL_WASTE:
  //       displayStr = "General Waste"
  //       break
  //     default:
  //       displayStr = ""
  //       break
  //   }
  //   return displayStr
  // }
}

/*
    "id": 1,
    "name": "Strapping",
    "materialType": "PLASTIC",
    "defaultWeightScale": "KG",
    "isRemoved": false
  */
