export type IDashboardMetrix = {
  totalWasteReceived: number
  totalWasteSorted: number
  totalWasteProcessed: number
  annualizedWastDiversion: number
  annualizedSequestered: number
}

export default class DashboardMetrix {
    private mTotalWasteReceived: number
    public get totalWasteReceived() {
      return this.mTotalWasteReceived
    }

    private mTotalWasteSorted: number
    public get totalWasteSorted() {
      return this.mTotalWasteSorted
    }

    private mTotalWasteProcessed: number
    public get totalWasteProcessed() {
      return this.mTotalWasteProcessed
    }

    private mAnnualizedWastDiversion: number
    public get annualizedWastDiversion() {
      return this.mAnnualizedWastDiversion
    }

    private mAnnualizedSequestered: number
    public get annualizedSequestered() {
      return this.mAnnualizedSequestered
    }

    constructor(res: IDashboardMetrix) {
        this.mTotalWasteReceived = res.totalWasteReceived
        this.mTotalWasteSorted = res.totalWasteSorted
        this.mTotalWasteProcessed = res.totalWasteProcessed
        this.mAnnualizedWastDiversion = res.annualizedWastDiversion
        this.mAnnualizedSequestered = 0
        if(res.annualizedSequestered) {
            this.mAnnualizedSequestered = res.annualizedSequestered
        } else {
            this.mAnnualizedSequestered = this.mAnnualizedWastDiversion * 6
        }
    }

    public static initWithResult(res: IDashboardMetrix): DashboardMetrix {
        let dm: DashboardMetrix = undefined
        if (res) {
            dm = new DashboardMetrix(res)
        }
        return dm
    }

    public getDashbaoardMatrix(): IDashboardMetrix {
        const dm: IDashboardMetrix = {
            totalWasteReceived: this.mTotalWasteReceived,
            totalWasteSorted: this.mTotalWasteSorted,
            totalWasteProcessed: this.mTotalWasteProcessed,
            annualizedWastDiversion: this.mAnnualizedWastDiversion,
            annualizedSequestered: this.mAnnualizedSequestered
        }
        return dm
    }
}
