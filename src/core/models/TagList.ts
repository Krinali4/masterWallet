import GeneralUtils from "../utils/GeneralUtils";
import Tag from './Tag';

export default class TagList {

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

    private mTags: Tag[];
    public get tags() {
      return this.mTags;
    }

    public constructor() {
        
    }

    public static default():TagList {
      const defTagList = new TagList();
      defTagList.initWithDefault();
      return defTagList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = TagList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mTags = []
    }

    public init(itemsResult: any,previousTagList: TagList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = TagList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalTags: Tag[] = []
        let previousTages: Tag[] = []
        const newTags = Tag.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalTags = finalTags.concat(previousTages)
        }
        finalTags = finalTags.concat(newTags)
        this.mTags = finalTags
    }

    public initWithTagArray(mArr: Tag[]) {
      this.mCurrentPage = 0
      this.mPerPageItems = mArr.length
      this.mCurrentPageItems = mArr.length
      this.mTotalItems = mArr.length
      this.mTotalPagesCount = this.getPagesCount()
      this.mTags = mArr
  }

    public static initWithResult(result: any, previousTagList: TagList|null|undefined): TagList|undefined {
        let bList: TagList = undefined
        bList = new TagList()
        bList.init(result,previousTagList)
        return bList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }

    public static getDummyTagList = () => {
        const jsonResStr = "{\"total\":5,\"data\":[{\"id\":1,\"tagCode\":\"LQ/123/01\",\"tagType\":\"QRCODE\",\"tagAllocationType\":\"BATCH\",\"tagLastAction\":\"CREATED\",\"isVoided\":false},{\"id\":2,\"tagCode\":\"LQ/123/02\",\"tagType\":\"QRCODE\",\"tagAllocationType\":\"BATCH\",\"tagLastAction\":\"CREATED\",\"isVoided\":false},{\"id\":3,\"tagCode\":\"LQ/123/03\",\"tagType\":\"QRCODE\",\"tagAllocationType\":\"MATERIAL\",\"tagLastAction\":\"CREATED\",\"isVoided\":false},{\"id\":4,\"tagCode\":\"LQ/123/04\",\"tagType\":\"QRCODE\",\"tagAllocationType\":\"MATERIAL\",\"tagLastAction\":\"CREATED\",\"isVoided\":false},{\"id\":5,\"tagCode\":\"LQ/123/05\",\"tagType\":\"QRCODE\",\"tagAllocationType\":\"MATERIAL\",\"tagLastAction\":\"CREATED\",\"isVoided\":false}]}"
        const result = JSON.parse(jsonResStr)
        return this.initWithResult(result,undefined)
    }
}