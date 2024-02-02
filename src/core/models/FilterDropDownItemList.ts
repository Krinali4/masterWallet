import FilterDropDownItem from "./FilterDropDownItem";
import AccountList from './AccountList';
import PartnerList from './PartnerList';
import LocationList from './LocationList';
import { TagAllocationType } from './Tag';

export default class FilterDropDownItemList {

    private mDropDownItems: FilterDropDownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    private mMasterItemsList: AccountList|PartnerList|LocationList;
    public get masterItemsList() {
      return this.mMasterItemsList;
    }

    public constructor() {
        this.mDropDownItems = []
    }

    public initWithDefault() {
        this.mDropDownItems = []
    }

    public static defaultList() {
        let fDropDownList: FilterDropDownItemList = new FilterDropDownItemList()
        fDropDownList.initWithDefault()
        fDropDownList.mDropDownItems = []
        return fDropDownList
    }

    public static initWithClientList(clientList: PartnerList|undefined,clientIds: number[]): FilterDropDownItemList {
        let fDropDownList: FilterDropDownItemList = new FilterDropDownItemList()
        fDropDownList.initWithDefault()
        let finalArray: FilterDropDownItem[] = []
        // finalArray.push(new FilterDropDownItem(1,"Client 1",false))
        // finalArray.push(new FilterDropDownItem(2,"Client 2",false))
        // finalArray.push(new FilterDropDownItem(3,"Client 3",false))
        // finalArray.push(new FilterDropDownItem(4,"Client 4",false))
        // finalArray.push(new FilterDropDownItem(5,"Client 5",false))

        if(clientList.partners.length > 0) {
            const arr = clientList.partners
            arr.forEach(item => {
                const isItemSelected = (clientIds.includes(item.userId)) ? true : false
                finalArray.push(new FilterDropDownItem(item.userId,item.name,isItemSelected))
            });
        }
        fDropDownList.mMasterItemsList = clientList
        fDropDownList.mDropDownItems = finalArray
        return fDropDownList;
    }

    public static initWithAccountList(accountList: AccountList|undefined,accountIds: number[]): FilterDropDownItemList {
        let fDropDownList: FilterDropDownItemList = new FilterDropDownItemList()
        fDropDownList.initWithDefault()
        let finalArray: FilterDropDownItem[] = []
        // finalArray.push(new FilterDropDownItem(1,"Account 1",false))
        // finalArray.push(new FilterDropDownItem(2,"Account 2",false))
        // finalArray.push(new FilterDropDownItem(3,"Account 3",false))
        // finalArray.push(new FilterDropDownItem(4,"Account 4",false))
        // finalArray.push(new FilterDropDownItem(5,"Account 5",false))

        console.log('accountIds :'+JSON.stringify(accountIds))

        if(accountList.accounts.length > 0) {
            const arr = accountList.accounts
            arr.forEach(item => {
                const isItemSelected = (accountIds.includes(item.userId)) ? true : false
                finalArray.push(new FilterDropDownItem(item.userId,item.name,isItemSelected))
            });
        }
        fDropDownList.mMasterItemsList = accountList
        fDropDownList.mDropDownItems = finalArray
        return fDropDownList;
    }

    public static initWithLocationList(locationList: LocationList|undefined,locationIds: number[]): FilterDropDownItemList {
        let fDropDownList: FilterDropDownItemList = new FilterDropDownItemList()
        fDropDownList.initWithDefault()
        let finalArray: FilterDropDownItem[] = []
        // finalArray.push(new FilterDropDownItem(1,"Location 1",false))
        // finalArray.push(new FilterDropDownItem(2,"Location 2",false))
        // finalArray.push(new FilterDropDownItem(3,"Location 3",false))
        // finalArray.push(new FilterDropDownItem(4,"Location 4",false))
        // finalArray.push(new FilterDropDownItem(5,"Location 5",false))

        if(locationList.locations.length > 0) {
            const arr = locationList.locations
            arr.forEach(item => {
                const isItemSelected = (locationIds.includes(item.id)) ? true : false
                finalArray.push(new FilterDropDownItem(item.id,item.name,isItemSelected))
            });
        }
        fDropDownList.mMasterItemsList = locationList
        fDropDownList.mDropDownItems = finalArray
        return fDropDownList;
    }

    public static initWithTagTypes(selectedTagTypes: string[]): FilterDropDownItemList {
        let fDropDownList: FilterDropDownItemList = new FilterDropDownItemList()
        fDropDownList.initWithDefault()
        let finalArray: FilterDropDownItem[] = []

        finalArray.push(new FilterDropDownItem(1,"Batch",(selectedTagTypes.includes("BATCH")) ? true : false))
        finalArray.push(new FilterDropDownItem(2,"Material",(selectedTagTypes.includes("MATERIAL")) ? true : false))

        // fDropDownList.mMasterItemsList = []
        fDropDownList.mDropDownItems = finalArray
        return fDropDownList;
    }

    public onDropDownItemSelected(selectedItem: FilterDropDownItem): FilterDropDownItemList {
        if(this.mDropDownItems.length > 0) {
            const mSelectedDropDownItem = this.mDropDownItems.find((dItem) => dItem.id === selectedItem.id)
            if(mSelectedDropDownItem && this.mDropDownItems.indexOf(mSelectedDropDownItem) !== -1) {
                mSelectedDropDownItem.setSelected(!mSelectedDropDownItem.isSelected)
                const indexToBeReplaced = this.mDropDownItems.indexOf(mSelectedDropDownItem)
                this.mDropDownItems[indexToBeReplaced] = mSelectedDropDownItem
            }
        }
        return this
    }

    public selectedItemCommaSeparatedNames(): string {
        let commaSepStr = ""
        if(this.mDropDownItems.length > 0) {
            const mSelectedDropDownItems = this.mDropDownItems.filter((dItem) => dItem.isSelected === true)
            if(mSelectedDropDownItems && mSelectedDropDownItems.length > 0) {
                commaSepStr = mSelectedDropDownItems.map(obj => obj.name).join(", ")
            }
        }
        return commaSepStr
    }

    public selectedIDs(): number[] {
        let selectedIDsArr: number[] = []
        if(this.mDropDownItems.length > 0) {
            const mSelectedDropDownItems = this.mDropDownItems.filter((dItem) => dItem.isSelected === true)
            if(mSelectedDropDownItems && mSelectedDropDownItems.length > 0) {
                selectedIDsArr = mSelectedDropDownItems.map( (item) => item.id);
            }
        }
        console.log('selectedIDsArr :'+JSON.stringify(selectedIDsArr))
        return selectedIDsArr
    }

    public selectedNames(): string[] {
        let selectedIDsArr: string[] = []
        if(this.mDropDownItems.length > 0) {
            const mSelectedDropDownItems = this.mDropDownItems.filter((dItem) => dItem.isSelected === true)
            if(mSelectedDropDownItems && mSelectedDropDownItems.length > 0) {
                selectedIDsArr = mSelectedDropDownItems.map( (item) => item.name.toUpperCase());
            }
        }
        console.log('selectedNamesArr :'+JSON.stringify(selectedIDsArr))
        return selectedIDsArr
    }

    public resetClientList(): FilterDropDownItemList {
        return FilterDropDownItemList.initWithClientList(this.mMasterItemsList as PartnerList,[])
    }

    public resetAccountList(): FilterDropDownItemList {
        return FilterDropDownItemList.initWithAccountList(this.mMasterItemsList as AccountList,[])
    }

    public resetLocationList(): FilterDropDownItemList {
        return FilterDropDownItemList.initWithLocationList(this.mMasterItemsList as LocationList,[])
    }

    public resetTagTypeList(): FilterDropDownItemList {
        return FilterDropDownItemList.initWithTagTypes([])
    }
}