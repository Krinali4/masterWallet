import DropdownItem from "./DropdownItem";
import AcessLevel from './AcessLevel';
import { UserRole } from './User';

export default class AcessLevelList {

    private mAcessLevels: AcessLevel[];
    public get acessLevels() {
      return this.mAcessLevels;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        this.mAcessLevels = this.setupAcessLevels()
        this.mDropDownItems = this.setupDropDownData(this.mAcessLevels)
    }

    public initWithDefault() {
        this.mAcessLevels = this.setupAcessLevels()
        this.mDropDownItems = this.setupDropDownData(this.mAcessLevels)
    }

    private setupAcessLevels() {
        let arr: AcessLevel[] = []
        arr.push(new AcessLevel("Read Only",UserRole.USER))
        arr.push(new AcessLevel("Mobile Only",UserRole.MOBILE_ONLY))
        arr.push(new AcessLevel("Full Access",UserRole.ADMIN)) 
        return arr
    }

    private setupDropDownData(cArr: AcessLevel[]) {
        let arr: DropdownItem[] = []
        cArr.forEach(AcessLevel => {
          arr.push(new DropdownItem(AcessLevel.value,AcessLevel.name))
        });
        return arr
    }
}