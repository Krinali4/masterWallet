import Location from './Location';
import GeneralUtils from '../utils/GeneralUtils';
import DropdownItem from './DropdownItem';

export default class LocationList {

    public static pageSize: number = 10 // default page size
    
    private mCurrentPage: number;
    public get currentPage() {
      return this.mCurrentPage;
    }
  
    private mPerPageItems: number;
    public get perPageItems() {
      return this.mPerPageItems;
    }

    private mCurrentPageItems: number;
    public get currentPageItems() {
      return this.mCurrentPageItems;
    }

    private mTotalItems: number;
    public get totalItems() {
      return this.mTotalItems;
    }

    private mTotalPagesCount: number;
    public get totalPagesCount() {
      return this.mTotalPagesCount;
    }

    private mLocations: Location[];
    public get locations() {
      return this.mLocations;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        
    }

    public static default():LocationList {
      const defLocationList = new LocationList();
      defLocationList.initWithDefault();
      return defLocationList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = LocationList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mLocations = []
        this.mDropDownItems = []
    }

    public init(itemsResult: any,previousLocationList: LocationList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = LocationList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalAccounts: Location[] = []
        let previousAccounts: Location[] = []
        const newAccounts = Location.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalAccounts = finalAccounts.concat(previousAccounts)
        }
        finalAccounts = finalAccounts.concat(newAccounts)
        this.mLocations = finalAccounts
        this.mDropDownItems = this.setupDropDownData(finalAccounts)
    }

    private setupDropDownData(lArr: Location[]) {
      let arr: DropdownItem[] = []
      lArr.forEach(location => {
        arr.push(new DropdownItem(location.id,location.name))
      });
      return arr
    }

    public static initWithResult(result: any, previousLocationList: LocationList|null|undefined): LocationList|undefined {
        let mList: LocationList = undefined
        mList = new LocationList()
        mList.init(result,previousLocationList)
        return mList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }

    public findLocationById(locationId: number): Location {
      let location: Location = undefined
      location = this.locations.find((item: Location) => item.id === locationId)    
      return location
    }

    public dropDownItemsByInfo(id: string|number, value: string): DropdownItem[] {
      let arr: DropdownItem[] = []
      arr.push(new DropdownItem(id,value))
      return arr
    }

    public static locationListWithID(locationId: number|undefined) {
      if(!locationId) {
        return LocationList.default()
      }
      let jsonList = { total: 1, data: [{id:locationId}]}
      let lList: LocationList = LocationList.initWithResult(jsonList, null)
      return lList;
  }
}