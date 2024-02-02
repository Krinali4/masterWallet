import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from "../core/models/User"
import UserManager from "../core/utils/UserManager"
import Report, { IReport, IReportCreate } from "../core/models/Report"
import ReportList from "../core/models/ReportList"
import ReportData, { IReportData } from "../core/models/ReportData"
import dayjs from 'dayjs';
import DateUtils from "../core/utils/DateUtils"
import DashboardMetrix from '../core/models/DashboardMetrix';
import { IDashboardMetrix } from '../core/models/DashboardMetrix';
import ReportPDF, { IReportPDF } from '../core/models/ReportPDF';
import { IQueryParams } from "../core/utils/QueryParamUtils"

export default class ReportService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Generate PDF report.
   * @returns {fileId} - generate PDF report
   */
  public static async generatePDFReport(reportData: IReportData,dashboardMatrix: IDashboardMetrix) {
    
    const reportPDF = ReportPDF.initWithData(reportData,dashboardMatrix)
    if(!reportPDF) {
      return Promise.reject(new ApiError(500, 'Report data is invalid.'))
    }
    
    const reportPDFInfo: IReportPDF = reportPDF.getReportPDF()
    const apiURL = process.env.REACT_APP_REPORT_GENERATE_API_BASE_URL + "/rewaste/reports/generate"
    
    const response = await WebServiceUtils.post(
      reportPDFInfo,
      ReportService.config,
      apiURL
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.pdfFileId &&
          response.data.imageFileId
        ) {
          console.log('generatePDFReport API CALL :'+JSON.stringify(response.data))
          return Promise.resolve({pdfFileId:response.data.pdfFileId, imageFileId:response.data.imageFileId})
        } else  {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  /**
   * Get Report material information for period.
   * @returns {fileId} - generate PDF report
   */
  public static async getReportData(report: IReport) {

    // const sampleResponse = "{\"data\":{\"generateReportData\":{\"location\":{\"id\":1,\"name\":\"IKEA Burlington\",\"account\":{\"id\":1,\"name\":\"account\"}},\"recycledMaterials\":[{\"totalWeight\":2000,\"material\":{\"id\":1,\"name\":\"Strapping\"}}]}}}"
    // const jsonResponse = JSON.parse(sampleResponse)
    // const reportJsonObject = jsonResponse.data.generateReportData
    // const resultReportData: ReportData = ReportData.initWithResponse(reportJsonObject,report)
    // return Promise.resolve(resultReportData)

    const response = await WebServiceUtils.post(
      this.getReportDataBody(report),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.generateReportData
        ) {
          const reportJsonObject = response.data.data.generateReportData
          const resultReportData: ReportData = ReportData.initWithResponse(reportJsonObject,report)
          if (resultReportData) {
            isSuccessResult = true
            return Promise.resolve(resultReportData)
          }
        }

        if (!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getReportDataBody(report: IReport): any {

    const reqFilterVar = {
      locationId: report.location.id,
      startDt: report.startDt,
      endDt: report.endDt
    }
    
    return `{
      "query": "query( $locationId: Int!, $startDt: Instant!, $endDt: Instant!) {generateReportData(locationId:$locationId,startDt:$startDt,endDt:$endDt) {location{id,name,address,account{id,name}},startDt,endDt,recycledMaterials{totalWeight,material{id,name}}}}",
      "variables": ${JSON.stringify(reqFilterVar)}
    }`.replace(/\s+/g, " ")
  }

  public static async getReportKPAData(report: IReport) {

    const response = await WebServiceUtils.post(
      this.getReportKPADataBody(report),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.dashboardMetrics
        ) {
          const reportJsonObject = response.data.data.dashboardMetrics
          const resultReportData: DashboardMetrix = DashboardMetrix.initWithResult(reportJsonObject)
          if (resultReportData) {
            isSuccessResult = true
            return Promise.resolve(resultReportData)
          }
        }
        if (!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getReportKPADataBody(report: IReport): any {

    /*let eDateYear = dayjs(report.endDt).year() //2023
    const eDateMonth = dayjs(report.endDt).month() + 1 // 1
    const lastMonth = (eDateMonth == 1) ? 12 : (eDateMonth - 1)
    const lastYear = (eDateMonth == 1) ? (eDateYear - 1) : eDateYear
    let lastMonthStr = `${lastMonth}`
    if(lastMonthStr.length == 1) {
      lastMonthStr = `0${lastMonth}`
    }
    const startDateOfYear = dayjs(`01/01/${lastYear}`,'MM/DD/YYYY')
    const endDateOfLastMonth = dayjs(`${lastMonthStr}/01/${lastYear}`,'MM/DD/YYYY').endOf('month')
    const sDate = DateUtils.getStartDateISOString(startDateOfYear)
    const eDate = DateUtils.getEndDateISOString(endDateOfLastMonth)*/

    const d = new Date();
    let diff = d.getTimezoneOffset();

    const filter = {
      locationId:{
        eq:[report.location.id]
      },
      createdAt: {
        gte: report.startDt,
        lte: report.endDt
      },
      timeZoneOffset: diff
    }
    const reqFilterVar = {
      filter:filter 
    }
    
    return `{
      "query": "query( $filter:ReportFilter) {dashboardMetrics(filter: $filter) {annualizedWastDiversion}}",
      "variables": ${JSON.stringify(reqFilterVar)}
    }`.replace(/\s+/g, " ")
  }

  public static async getDashboardMatrix(filter: IQueryParams) {
    const response = await WebServiceUtils.post(
      this.getDashboardMatrixBody(filter),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.dashboardMetrics
        ) {
          const reportJsonObject = response.data.data.dashboardMetrics
          const resultReportData: DashboardMetrix = DashboardMetrix.initWithResult(reportJsonObject)
          if (resultReportData) {
            isSuccessResult = true
            return Promise.resolve(resultReportData)
          }
        }
        if (!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getDashboardMatrixBody(dashboardFilter: IQueryParams): any {


    const lastMonthRange = DateUtils.lastYearDateRange()

    // const filter = {
    //   locationId:{
    //     eq:[report.location.id]
    //   },
    //   createdAt: {
    //     gte: report.startDt,
    //     lte: report.endDt
    //   }
    // }
    const filter = {
      locationId:{
        eq: dashboardFilter.locationIds
      },
      accountId:{
        eq: dashboardFilter.accountIds
      },
      createdAt: {
        gte: lastMonthRange.gte,
        lte: lastMonthRange.lte
      },
      timeZoneOffset: lastMonthRange.timeZoneOffset
    }
    console.log('dashboard filters: '+JSON.stringify(filter))
    const reqFilterVar = {
      filter:filter 
    }
    
    return `{
      "query": "query( $filter:ReportFilter) {dashboardMetrics(filter: $filter) {totalWasteReceived,totalWasteSorted,totalWasteProcessed,annualizedWastDiversion,annualizedSequestered}}",
      "variables": ${JSON.stringify(reqFilterVar)}
    }`.replace(/\s+/g, " ")
  }

  /**
   * Create new report.
   * @returns {Report} - account
   */
  public static async createReport(reportData: IReportData) {
    const { location, startDt, endDt, pdfFileId, imageFileId } =
    reportData
    const { account } = location
    const { partner } = account

    let iReportCreate: IReportCreate = {
      partnerId: partner.id,
      accountId: account.id,
      locationId: location.id,
      startDt,
      endDt,
      reportFileName:pdfFileId,
      reportImgFileName:imageFileId,
    }

    const response = await WebServiceUtils.post(
      this.createReportBody(iReportCreate),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.createReport
        ) {
          const reportJsonObject = response.data.data.createReport
          const resultReport: Report = Report.initWithResult(reportJsonObject)
          if (resultReport) {
            isSuccessResult = true
            return Promise.resolve(resultReport)
          }
        }

        if (!isSuccessResult) {
          return WebServiceUtils.throwGenericError()
        }
      } catch (error) {
        return WebServiceUtils.throwGenericError()
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static createReportBody(iReportCreate: IReportCreate): any {
    return `{
      "query": "mutation($In:ReportCreate!) {createReport(in:$In) {id,startDt,endDt,createdAt,reportPdfUrl,reportImgUrl,location{id,name,account{id,name,partner{id, name}}}}}",
      "variables": {
          "In": ${JSON.stringify(iReportCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Report List.
   * @returns {ReportList} - report list
   */
  public static async getReportList(filter: IQueryParams) {
    const pageSize = ReportList.pageSize
    const offset = filter.page * pageSize

    const response = await WebServiceUtils.post(
      this.getReportListBody(offset, pageSize, filter),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.reports &&
          response.data.data.reports.data &&
          Array.isArray(response.data.data.reports.data)
        ) {
          const reportList = ReportList.initWithResult(
            response.data.data.reports,
            null
          )
          return Promise.resolve(reportList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getReportListBody(offset: number, limit: number,reportsFilter: IQueryParams): any {
    const sort = {
      id: "DESC",
    }
    // createdAt: {
    //   gte: "2021-12-01T00:00:00.000Z",
    //   lte: "2023-01-31T00:00:00.000Z",
    // },
    const filter = {
      partnerId: {
        eq:reportsFilter.clientIds
      },
      accountId: {
        eq:reportsFilter.accountIds
      },
      locationId: {
        eq:reportsFilter.locationIds
      }
    }

    return `{
      "query": "query($filter:ReportFilter,$sort:ReportSorter,$limit: Int!,$offset: Int!){reports(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,startDt,endDt,createdAt,reportPdfUrl,reportImgUrl,location{id,name,account{id,name,partner{id, name}}}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Report Details.
   * @returns {ReportList} - report list
   */
  public static async getReportDetails(reportId: number) {
    const pageSize = ReportList.pageSize
    const offset = 0

    const response = await WebServiceUtils.post(
      this.getReportDetailsBody(reportId),
      ReportService.config,
      ReportService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.reports &&
          response.data.data.reports.data &&
          Array.isArray(response.data.data.reports.data)
        ) {
          const reportList = ReportList.initWithResult(
            response.data.data.reports,
            null
          )
          if(reportList.reports.length === 1) {
            return Promise.resolve(reportList.reports[0]);
          } else {
            return Promise.reject(
              new ApiError(500, `No Report found with id.`)
            )
          }
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getReportDetailsBody(reportId: number): any {
    const sort = {
      id: "DESC",
    }
    // createdAt: {
    //   gte: "2021-12-01T00:00:00.000Z",
    //   lte: "2023-01-31T00:00:00.000Z",
    // },
    const filter = {
      id:{
        eq:[reportId]
      }
    }
    return `{
      "query": "query($filter:ReportFilter,$sort:ReportSorter,$limit: Int!,$offset: Int!){reports(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,startDt,endDt,createdAt,reportPdfUrl,reportImgUrl,location{id,name,account{id,name,partner{id, name}}}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }

  public static async downloadPDFFile(reportPdfUrl: string) { 
    const response = await WebServiceUtils.get(
      {responseType: 'arraybuffer'},
      reportPdfUrl
    )

    if (response.success) {
      try {
        if (
          response.data
        ) {
          var pdfFile = new Blob([response.data], {
            type: "application/pdf"
          });
          var pdfUrl = URL.createObjectURL(pdfFile);
          return Promise.resolve(pdfUrl);
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }
}
