import GeneralUtils from "../utils/GeneralUtils";
import Batch from './Batch';

export default class BatchList {

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

    private mBatches: Batch[];
    public get batches() {
      return this.mBatches;
    }

    public constructor() {
        
    }

    public static default():BatchList {
      const defBatchList = new BatchList();
      defBatchList.initWithDefault();
      return defBatchList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = BatchList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mBatches = []
    }

    public init(itemsResult: any,previousBatchList: BatchList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = BatchList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalBatches: Batch[] = []
        let previousBatches: Batch[] = []
        const newBatches = Batch.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalBatches = finalBatches.concat(previousBatches)
        }
        finalBatches = finalBatches.concat(newBatches)
        this.mBatches = finalBatches
    }

    public initWithBatchArray(mArr: Batch[]) {
      this.mCurrentPage = 0
      this.mPerPageItems = mArr.length
      this.mCurrentPageItems = mArr.length
      this.mTotalItems = mArr.length
      this.mTotalPagesCount = this.getPagesCount()
      this.mBatches = mArr
  }

    public static initWithResult(result: any, previousBatchList: BatchList|null|undefined): BatchList|undefined {
        let bList: BatchList = undefined
        bList = new BatchList()
        bList.init(result,previousBatchList)
        return bList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }
}