import GeneralUtils from "../utils/GeneralUtils"
import { ILocation } from "./Location"
import dayjs, { Dayjs } from "dayjs"
import Location from "./Location"
import { IPartner } from './Partner';
import { IAccount } from './Account';

export type IReport = {
  id: number
  partner: IPartner
  account: IAccount
  location: ILocation
  startDt: string | null
  endDt: string | null
  createdAt?: string | null
  reportPdfUrl: string
  reportImgUrl: string
  reportFileName?: string
  reportImgFileName?: string
}

export type IReportCreate = {
  partnerId: number
  accountId: number
  locationId: number
  startDt: string | null
  endDt: string | null
  reportFileName: string
  reportImgFileName: string
}

export default class Report {
  private mId: number
  public get id() {
    return this.mId
  }

  private mStartDt: Dayjs | null
  public get startDt() {
    return this.mStartDt
  }

  private mEndDt: Dayjs | null
  public get endDt() {
    return this.mEndDt
  }

  private mCreatedAt: Dayjs | null
  public get createdAt() {
    return this.mCreatedAt
  }

  private mReportPDFUrl: string
  public get reportPdfUrl() {
    return this.mReportPDFUrl
  }

  private mReportImgUrl: string
  public get reportImgUrl() {
    return this.mReportImgUrl
  }

  private mLocation: Location | null | undefined
  public get location() {
    return this.mLocation
  }

  public displayStringCreatedAt() {
    if(this.mCreatedAt) {
      return this.mCreatedAt.format('MM/DD/YYYY')
    }
    return ''
  }

  constructor(res: IReport) {
    this.mId = res.id
    if (res.location) {
      this.mLocation = Location.initWithResult(res.location)
    }
    this.mStartDt = dayjs(res.startDt)
    this.mEndDt = dayjs(res.endDt)
    this.mCreatedAt = (res.createdAt) ? dayjs(res.createdAt) : null
    this.mReportPDFUrl = res.reportPdfUrl
    this.mReportImgUrl = res.reportImgUrl
  }

  public static initWithResult(res: IReport): Report {
    let report: Report = undefined
    if (res.id) {
      report = new Report(res)
    }
    return report
  }

  public static initWithList(res: any): Report[] {
    let finalArray: Report[] = []
    for (let report of res) {
      let reportObj: Report = this.initWithResult(report)
      if (reportObj) {
        finalArray.push(reportObj)
      }
    }
    return finalArray
  }

  public getReport(): IReport {
    const rd: IReport = {
      id: this.mId,
      partner: (this.mLocation) ? this.mLocation.getLocation().account.partner : undefined,
      account: (this.mLocation) ? this.mLocation.getLocation().account : undefined,
      location: (this.mLocation) ? this.mLocation.getLocation() : undefined,
      startDt: this.mStartDt.toISOString(),
      endDt: this.mEndDt.toISOString(),
      createdAt: (this.mCreatedAt) ? this.mCreatedAt.toISOString() : null,
      reportPdfUrl: this.mReportPDFUrl,
      reportImgUrl: this.mReportImgUrl,
      reportFileName: '',
      reportImgFileName: ''
    }
    return rd
  }
}

/*
    "partnerId": 1,
    "accountId": 1,
    "locationId": 1,
    "startDt": "2022-12-01T00:30:00.000Z",
    "endDt": "2022-12-31T00:00:00.000Z",
    "reportFileName": "1.pdf",
    "reportImgFileName": "1.jpg"
*/

/*
    "id": 1,
    "startDt": "2022-12-01T00:30:00Z",
    "endDt": "2022-12-31T00:00:00Z",
    "createdAt": "2023-01-04T12:58:50.033487Z",
    "reportPdfUrl": "https://d282epe0d26hfy.cloudfront.net/pdf/1.pdf",
    "reportImgUrl": "https://d282epe0d26hfy.cloudfront.net/images/1.jpg",
    "location": {
        "name": "IKEA Burlington"
    }
*/
