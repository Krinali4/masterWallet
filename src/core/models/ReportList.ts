import GeneralUtils from '../utils/GeneralUtils';
import Report from './Report';
import DropdownItem from "./DropdownItem";

export default class ReportList {

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

    private mReports: Report[];
    public get reports() {
      return this.mReports;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        
    }

    public static default():ReportList {
      const defReportList = new ReportList();
      defReportList.initWithDefault();
      return defReportList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = ReportList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mReports = []
        this.mDropDownItems = []
    }

    public init(itemsResult: any,previousReportList: ReportList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = ReportList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalReports: Report[] = []
        let previousReports: Report[] = []
        const newReports = Report.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalReports = finalReports.concat(previousReports)
        }
        finalReports = finalReports.concat(newReports)
        this.mReports = finalReports
        this.mDropDownItems = this.setupDropDownData(finalReports)
    }

    private setupDropDownData(rArr: Report[]) {
      let arr: DropdownItem[] = []
      rArr.forEach(report => {
        arr.push(new DropdownItem(report.id,''))
      });
      return arr
    }

    public static initWithResult(result: any, previousReportList: ReportList|null|undefined): ReportList|undefined {
        let aList: ReportList = undefined
        aList = new ReportList()
        aList.init(result,previousReportList)
        return aList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }
}