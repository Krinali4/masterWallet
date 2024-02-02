export default class AcessLevel {
    private mName: string
    public get name() {
      return this.mName
    }

    private mValue: string
    public get value() {
      return this.mValue
    }

    constructor(sName: string , sValue:string) {
        this.mName = sName
        this.mValue = sValue
    }
}