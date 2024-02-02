
export type IMaterialType = {
    id: number
    name: string
    isActivated: boolean
    isRemoved: boolean
}

export type IMaterialTypeCreate = {
  name: string
}

export type IMaterialTypeUpdate = {
  id: number
  name: string
  isActivated: boolean
}

export default class MaterialType {
    private mId: number
    public get id() {
      return this.mId
    }
  
    private mName: string
    public get name() {
      return this.mName
    }

    private mIsActive: boolean
    public get isActive() {
        return this.mIsActive
    }

    private mIsRemoved: boolean
    public get isRemoved() {
        return this.mIsRemoved
    }

    constructor(res: IMaterialType) {
        this.mId = res.id
        this.mName = res.name
        this.mIsActive = (res.isActivated) ? true : false
        this.mIsRemoved = (res.isRemoved) ? true : false
    }

    public static initWithMaterialType(mt: IMaterialType): MaterialType {
        let mtype: MaterialType = undefined
        if (mt.id) {
            mtype = new MaterialType(mt)
        }
        return mtype
    }
    
      public static initWithList(res: any): MaterialType[] {
        let finalArray: MaterialType[] = []
        for (let mt of res) {
          let mtObj: MaterialType = this.initWithMaterialType(mt)
          if(mtObj) {
            finalArray.push(mtObj)
          }
        }
        return finalArray
      }

      public getMaterialType(): IMaterialType {
        const mt: IMaterialType = {
          id: this.mId,
          name: this.mName,
          isActivated: this.mIsActive,
          isRemoved: this.mIsRemoved
        }
        return mt
      }
}