import GeneralUtils from "../utils/GeneralUtils";
import Tag from './Tag';
import TagScanHistory from "./TagScanHistory";

export default class TagScanHistoryList {

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

    private mTagScanHistories: TagScanHistory[];
    public get tagScanHistories() {
      return this.mTagScanHistories;
    }

    public constructor() {
        
    }

    public static default():TagScanHistoryList {
      const defTagList = new TagScanHistoryList();
      defTagList.initWithDefault();
      return defTagList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = TagScanHistoryList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mTagScanHistories = []
    }

    public init(itemsResult: any,pTagScanHistoryList: TagScanHistoryList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = TagScanHistoryList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalTagScanHistorys: TagScanHistory[] = []
        let previousTagScanHistories: TagScanHistory[] = []
        const newTags = TagScanHistory.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalTagScanHistorys = finalTagScanHistorys.concat(previousTagScanHistories)
        }
        finalTagScanHistorys = finalTagScanHistorys.concat(newTags)
        this.mTagScanHistories = finalTagScanHistorys
    }

    public initWithTagArray(mArr: TagScanHistory[]) {
      this.mCurrentPage = 0
      this.mPerPageItems = mArr.length
      this.mCurrentPageItems = mArr.length
      this.mTotalItems = mArr.length
      this.mTotalPagesCount = this.getPagesCount()
      this.mTagScanHistories = mArr
  }

    public static initWithResult(result: any, pTagScanHistoryist: TagScanHistoryList|null|undefined): TagScanHistoryList|undefined {
        let bList: TagScanHistoryList = undefined
        bList = new TagScanHistoryList()
        bList.init(result,pTagScanHistoryist)
        return bList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }

    public static getDummyList = () => {
        const jsonResStr = "{\"total\":5,\"data\":[{\"id\":1,\"tagId\":1,\"tagAction\":\"LOC_UPDATE\",\"scannedLat\":21.807104,\"scannedLong\":73.0988544,\"scannedLocationId\":1,\"scannedAt\":\"2023-01-04T14:03:09.123480Z\"},{\"id\":2,\"tagId\":2,\"tagAction\":\"MATERIAL_ADDED\",\"scannedLat\":21.807104,\"scannedLong\":73.0988544,\"scannedLocationId\":1,\"scannedAt\":\"2023-01-04T14:03:09.123480Z\"},{\"id\":3,\"tagId\":1,\"tagAction\":\"MATERIAL_ADDED\",\"scannedLat\":21.807104,\"scannedLong\":73.0988544,\"scannedLocationId\":1,\"scannedAt\":\"2023-01-04T14:03:09.123480Z\"},{\"id\":4,\"tagId\":1,\"tagAction\":\"LOC_UPDATE\",\"scannedLat\":21.807104,\"scannedLong\":73.0988544,\"scannedLocationId\":1,\"scannedAt\":\"2023-01-04T14:03:09.123480Z\"},{\"id\":5,\"tagId\":1,\"tagAction\":\"CHECK_IN\",\"scannedLat\":21.807104,\"scannedLong\":73.0988544,\"scannedLocationId\":1,\"scannedAt\":\"2023-01-04T14:03:09.123480Z\"}]}"
        const result = JSON.parse(jsonResStr)
        return this.initWithResult(result,undefined)
    }

    public updateTagScanHistoryObject(newObj: TagScanHistory): TagScanHistoryList {
        const foundTagScanHistory =  this.mTagScanHistories.find((tsh) => tsh.id == newObj.id)
        if(foundTagScanHistory && this.mTagScanHistories.indexOf(foundTagScanHistory) !== -1) {
          const index = this.mTagScanHistories.indexOf(foundTagScanHistory)
          this.mTagScanHistories[index] = newObj
        }
        const tshList = {...this}
        const newList = Object.assign(new TagScanHistoryList(), tshList)
        return newList
    }

    public updateTagScanHistoryObjectArray(newObjArr: TagScanHistory[]): TagScanHistoryList {
      newObjArr.forEach(newObj => {
        const foundTagScanHistory =  this.mTagScanHistories.find((tsh) => tsh.id == newObj.id)
        if(foundTagScanHistory && this.mTagScanHistories.indexOf(foundTagScanHistory) !== -1) {
          const index = this.mTagScanHistories.indexOf(foundTagScanHistory)
          this.mTagScanHistories[index] = newObj
        }
      });
      const tshList = {...this}
      const newList = Object.assign(new TagScanHistoryList(), tshList)
      return newList
  }
}