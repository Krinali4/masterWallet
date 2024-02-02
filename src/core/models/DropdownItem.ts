export default class DropdownItem {
    private mId: number|string
    public get id() {
      return this.mId
    }
  
    private mName: string
    public get name() {
      return this.mName
    }

    constructor(sId: number|string, sName: string) {
        this.mId = sId
        this.mName = sName
    }
}