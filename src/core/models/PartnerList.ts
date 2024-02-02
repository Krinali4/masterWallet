import GeneralUtils from '../utils/GeneralUtils';
import DropdownItem from './DropdownItem';
import Partner from "./Partner";

export default class PartnerList {

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

    private mPartners: Partner[];
    public get partners() {
      return this.mPartners;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        
    }

    public static default():PartnerList {
      const defPartnerList = new PartnerList();
      defPartnerList.initWithDefault();
      return defPartnerList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = PartnerList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mPartners = []
        this.mDropDownItems = []
    }

    public init(itemsResult: any,previousPartnerList: PartnerList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = PartnerList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalPartners: Partner[] = []
        let previousPartners: Partner[] = []
        const newPartners = Partner.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalPartners = finalPartners.concat(previousPartners)
        }
        finalPartners = finalPartners.concat(newPartners)
        this.mPartners = finalPartners
        this.mDropDownItems = this.setupDropDownData(finalPartners)
    }

    private setupDropDownData(pArr: Partner[]) {
        let arr: DropdownItem[] = []
        pArr.forEach(partner => {
          arr.push(new DropdownItem(partner.userId,partner.name))
        });
        return arr
    }

    public static initWithResult(result: any, previousPartnerList: PartnerList|null|undefined): PartnerList|undefined {
        let pList: PartnerList = undefined
        pList = new PartnerList()
        pList.init(result,previousPartnerList)
        return pList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }

    public findPartnerById(partnerId: number): Partner {
      let partner: Partner = undefined
      partner = this.partners.find((item: Partner) => item.userId === partnerId)    
      return partner
    }

    public dropDownItemsByInfo(id: string|number, value: string): DropdownItem[] {
      let arr: DropdownItem[] = []
      arr.push(new DropdownItem(id,value))
      return arr
    }
}