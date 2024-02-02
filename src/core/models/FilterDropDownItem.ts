export type IFilterDropDownItem = {
    id: number
    name: string
    isSelected: string
}

export default class FilterDropDownItem {
    private mId: number
    public get id() {
      return this.mId
    }
  
    private mName: string
    public get name() {
      return this.mName
    }

    private mIsSelected: boolean
    public get isSelected() {
      return this.mIsSelected
    }

    public setSelected(newSelected: boolean) {
        this.mIsSelected = newSelected
    }

    constructor(sId: number, sName: string, sIsSelected: boolean) {
        this.mId = sId
        this.mName = sName
        this.mIsSelected = sIsSelected
    }
}