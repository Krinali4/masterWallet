import GeneralUtils from "../utils/GeneralUtils";
import User from "./User";

export default class UserList {

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

    private mUsers: User[];
    public get users() {
      return this.mUsers;
    }

    public constructor() {
        
    }

    public static default():UserList {
      const defUserList = new UserList();
      defUserList.initWithDefault();
      return defUserList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = UserList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mUsers = []
    }

    public init(itemsResult: any,previousAccountList: UserList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = UserList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalUsers: User[] = []
        let previousUsers: User[] = []
        
        const newUsers = User.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalUsers = finalUsers.concat(previousUsers)
        }
        finalUsers = finalUsers.concat(newUsers)
        this.mUsers = finalUsers
    }

    public static initWithResult(result: any, previousUserList: UserList|null|undefined): UserList|undefined {
        let uList: UserList = undefined
        uList = new UserList()
        uList.init(result,previousUserList)
        return uList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }
}