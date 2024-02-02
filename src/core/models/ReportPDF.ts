import { ILocation } from "./Location"
import { IMaterial } from "./Material"
import { IReportData } from "./ReportData"
import DashboardMetrix, { IDashboardMetrix } from "./DashboardMetrix"
import DateUtils from "../utils/DateUtils"

export type IReportPDF = {
  accountName: string
  locationName: string
  address: string
  reportStartDate: string
  reportEndDate: string
  reportPeriod: string
  reportDuration: string
  reportedOn: string
  estimatedTotalWeight: number
  annualizedWastDiversion: number
  annualizedSequestered: number
  materials: IMaterial[]
}

export default class ReportPDF {
  private mAccountName: string
  public get accountName() {
    return this.mAccountName
  }

  private mLocationName: string
  public get locationName() {
    return this.mLocationName
  }

  private mAddress: string
  public get address() {
    return this.mAddress
  }

  private mReportStartDate: string
  public get reportStartDate() {
    return this.mReportStartDate
  }

  private mReportEndDate: string
  public get reportEndDate() {
    return this.mReportEndDate
  }

  private mReportPeriod: string
  public get reportPeriod() {
    return this.mReportPeriod
  }

  private mReportDuration: string
  public get reportDuration() {
    return this.mReportDuration
  }

  private mReportedOn: string
  public get reportedOn() {
    return this.mReportDuration
  }

  private mEstimatedTotalWeight: number
  public get estimatedTotalWeight() {
    return this.mEstimatedTotalWeight
  }

  private mAnnualizedWastDiversion: number
  public get annualizedWastDiversion() {
    return this.mAnnualizedWastDiversion
  }

  private mAnnualizedSequestered: number
  public get annualizedSequestered() {
    return this.mAnnualizedSequestered
  }

  private mMaterials: IMaterial[]
  public get materials() {
    return this.mMaterials
  }

  constructor(reportData: IReportData, dashboardMetrix: IDashboardMetrix) {
    this.mAccountName = reportData.location.account.name
    this.mLocationName = reportData.location.name
    this.mAddress = reportData.location.address
    this.mReportStartDate = DateUtils.getDisplayDateFromISOString(
      reportData.startDt
    )
    this.mReportEndDate = DateUtils.getDisplayDateFromISOString(
        reportData.endDt
    )
    this.mReportPeriod = `${this.mReportStartDate} - ${this.mReportEndDate}`
    this.mReportDuration = reportData.auditDuration || ""
    this.mReportedOn = reportData.reportedOn || ""
    this.mEstimatedTotalWeight = reportData.totalWeight || 0
    this.mAnnualizedWastDiversion = dashboardMetrix.annualizedWastDiversion || 0
    this.mAnnualizedSequestered = dashboardMetrix.annualizedSequestered || 0
    this.mMaterials = []
    if (reportData.materials) {
      this.mMaterials = reportData.materials
    }
  }

  public static initWithData(
    reportData: IReportData,
    dashboardMetrix: IDashboardMetrix
  ) {
    let reportPDF: ReportPDF = undefined
    if (reportData && dashboardMetrix) {
      reportPDF = new ReportPDF(reportData, dashboardMetrix)
    }
    return reportPDF
  }

  public getReportPDF(): IReportPDF {
    const rp: IReportPDF = {
      accountName: this.mAccountName,
      locationName: this.mLocationName,
      address: this.mAddress,
      reportStartDate: this.mReportStartDate,
      reportEndDate: this.mReportEndDate,
      reportPeriod: this.mReportPeriod,
      reportDuration: this.mReportDuration,
      reportedOn: this.mReportedOn,
      estimatedTotalWeight: this.mEstimatedTotalWeight,
      annualizedWastDiversion: this.mAnnualizedWastDiversion,
      annualizedSequestered: this.mAnnualizedSequestered,
      materials: this.mMaterials,
    }
    return rp
  }
}
