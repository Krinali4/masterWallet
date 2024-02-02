import DropdownItem from "./DropdownItem";
import CountryCode from './CountryCode';

export default class CountryCodeList {

    private mCountryCodes: CountryCode[];
    public get countryCodes() {
      return this.mCountryCodes;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        this.mCountryCodes = this.setupCountryCodes()
        this.mDropDownItems = this.setupDropDownData(this.mCountryCodes)
    }

    public initWithDefault() {
        this.mCountryCodes = this.setupCountryCodes()
        this.mDropDownItems = this.setupDropDownData(this.mCountryCodes)
    }

    private setupCountryCodes() {
        let arr: CountryCode[] = []
        arr.push(new CountryCode('+1'))
        return arr
    }

    private setupDropDownData(cArr: CountryCode[]) {
        let arr: DropdownItem[] = []
        cArr.forEach(countryCode => {
          arr.push(new DropdownItem(countryCode.code,countryCode.code))
        });
        return arr
    }
}