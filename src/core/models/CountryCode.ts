export default class CountryCode {
    private mCode: string
    public get code() {
      return this.mCode
    }

    constructor(sCode: string) {
        this.mCode = sCode
    }
}