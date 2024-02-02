import GeneralUtils from '../utils/GeneralUtils';
import Account from './Account';
import DropdownItem from "./DropdownItem";

export default class AccountList {

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

    private mAccounts: Account[];
    public get accounts() {
      return this.mAccounts;
    }

    private mDropDownItems: DropdownItem[];
    public get dropDownItems() {
      return this.mDropDownItems;
    }

    public constructor() {
        
    }

    public static default():AccountList {
      const defAccountList = new AccountList();
      defAccountList.initWithDefault();
      return defAccountList
    }

    public initWithDefault() {
        this.mCurrentPage = 0
        this.mPerPageItems = AccountList.pageSize
        this.mCurrentPageItems = 0
        this.mTotalItems = 0
        this.mTotalPagesCount = 0
        this.mAccounts = []
        this.mDropDownItems = []
    }

    public init(itemsResult: any,previousAccountList: AccountList|null|undefined) {
        let records = (itemsResult.data && Array.isArray(itemsResult.data)) ? itemsResult.data : []
        this.mCurrentPage = 0
        this.mPerPageItems = AccountList.pageSize
        this.mCurrentPageItems = records.length
        this.mTotalItems = itemsResult.total
        this.mTotalPagesCount = this.getPagesCount()

        let finalAccounts: Account[] = []
        let previousAccounts: Account[] = []
        const newAccounts = Account.initWithList(records)
        if(this.mCurrentPage !== 0) {
            finalAccounts = finalAccounts.concat(previousAccounts)
        }
        finalAccounts = finalAccounts.concat(newAccounts)
        this.mAccounts = finalAccounts
        this.mDropDownItems = this.setupDropDownData(finalAccounts)
    }

    private setupDropDownData(aArr: Account[]) {
      let arr: DropdownItem[] = []
      aArr.forEach(account => {
        arr.push(new DropdownItem(account.userId,account.name))
      });
      return arr
    }

    public static initWithResult(result: any, previousAccountList: AccountList|null|undefined): AccountList|undefined {
        let aList: AccountList = undefined
        aList = new AccountList()
        aList.init(result,previousAccountList)
        return aList
    } 

    private getPagesCount = () => {
      let totalPageCount = GeneralUtils.calculatePagesCount(this.mPerPageItems,this.mTotalItems)
      return totalPageCount
    }

    public findAccountById(accountId: number): Account {
      let account: Account = undefined
      account = this.accounts.find((item: Account) => item.userId === accountId)    
      return account
    }

    public dropDownItemsByInfo(id: string|number, value: string): DropdownItem[] {
      let arr: DropdownItem[] = []
      arr.push(new DropdownItem(id,value))
      return arr
    }

    public getAccountIDs(): number[] {
      let accountIds: number[] = []
      if(this.accounts.length > 0) {
        accountIds = this.accounts.map((account) => Number(account.userId))
      }
      return accountIds
    }

    public static accountListWithID(accountId: number|undefined) {
        if(!accountId) {
          return AccountList.default()
        }
        let jsonList = { total: 1, data: [{id:accountId}]}
        let aList: AccountList = AccountList.initWithResult(jsonList, null)
        return aList;
    }
}