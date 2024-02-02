import { ILocation } from './Location';
import { IMaterial } from './Material';
import Material from './Material';
import dayjs, { Dayjs } from "dayjs"
import Location from './Location';
import MaterialList from './MaterialList';
import { IReport } from './Report';
import DateUtils from '../utils/DateUtils';

export type IReportData = {
    location: ILocation
    materials: IMaterial[]
    startDt: string | null
    endDt: string | null
    createdAt?: string | null
    auditMonth?: string
    auditDuration?:string
    reportedOn?:string
    totalWeight?:number
    pdfFileId?:string
    imageFileId?:string
    annualizedWasteKG?: number
    annualizedCO2KG?: number
}

export type IRecycledMaterial = {
  totalWeight:number
  material: IMaterial
}

export type INewReportData = {
  location: ILocation
  startDt: string|null
  endDt: string|null
  recycledMaterials: IRecycledMaterial[]
}
export default class ReportData {

    private mLocation: Location | null | undefined
    public get location() {
      return this.mLocation
    }

    private mMaterialList: MaterialList
    public get materialList() {
      return this.mMaterialList
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
  
    constructor(res: IReportData, newRes: INewReportData, report: IReport) {
      if(res) {
        if (res.location) {
          this.mLocation = Location.initWithResult(res.location)
        }
        this.mMaterialList = MaterialList.default()
        if (res.materials) {
          const mList = MaterialList.initWithResult({total: res.materials.length, data: res.materials}, null)
          this.mMaterialList = mList
        }
        this.mStartDt = dayjs(res.startDt)
        this.mEndDt = dayjs(res.endDt)
        this.mCreatedAt = (res.createdAt) ? dayjs(res.createdAt) : null
      } else {
        if (newRes.location) {
          // tricky part due to partner info is not coming in the api in account model.
          let loc = {
            ...newRes.location,
            account: {
              ...newRes.location.account,
              partner:report.partner
            }
          }
          // end
          this.mLocation = Location.initWithResult(loc)
        }
        this.mMaterialList = MaterialList.default()
        let newMaterialArr: IMaterial[] = []
        if (newRes.recycledMaterials && newRes.recycledMaterials.length > 0) {
          newRes.recycledMaterials.forEach(material => {
            let tempM: IMaterial = {
              ...material.material
            }
            tempM.weight = material.totalWeight
            newMaterialArr.push(tempM)
          });
        }
        const mList = MaterialList.initWithResult({total: newMaterialArr.length, data: newMaterialArr}, null)
        this.mMaterialList = mList
        this.mStartDt = dayjs(newRes.startDt)
        this.mEndDt = dayjs(newRes.endDt)
        let createdDate = dayjs()
        if(report && report.createdAt && report.createdAt.length > 0) {
          createdDate = dayjs(report.createdAt)
        }
        this.mCreatedAt = (createdDate) ? createdDate : null
      }
    }
  
    public static initWithResult(res: IReportData): ReportData {
      let report: ReportData = undefined
      if (res && res.materials) {
        report = new ReportData(res,undefined,undefined)
      }
      return report
    }

    public static initWithResponse(res: INewReportData, report: IReport): ReportData {
      let rData: ReportData = undefined
      if (res && res.recycledMaterials) {
        rData = new ReportData(undefined,res,report)
      }
      return rData
    }
  
    public getReportData(): IReportData {
      let arrOfMat: IMaterial[] = []
      this.mMaterialList.materials.forEach(m => {
        arrOfMat.push(m.getMaterial())
      });

      const date1 = this.mStartDt
      const date2 = this.mEndDt
      const diffDays = date2.diff(date1, 'days') + 1

      // if createdAt == null, consider createdAt == endDt
      console.log('this.mCreatedAt :'+this.mCreatedAt)
      console.log('this.mEndDt :'+this.mEndDt)
      let reportedOnDt = ''
      if(this.mCreatedAt) {
        reportedOnDt = DateUtils.getDisplayDate(this.mCreatedAt)
      } else if(this.mEndDt) {
        reportedOnDt = DateUtils.getDisplayDate(this.mEndDt)
      }
      console.log('reportedOnDt :'+reportedOnDt)

      const annualWasteInGm = this.mMaterialList.totalWeight * 12
      const annualCO2InGm = annualWasteInGm * 6

      const rd: IReportData = {
        location: (this.mLocation) ? this.mLocation.getLocation() : undefined,
        materials: arrOfMat,
        startDt: this.mStartDt.toISOString(),
        endDt: this.mEndDt.toISOString(),
        createdAt: (this.mCreatedAt) ? this.mCreatedAt.toISOString() : null,
        auditMonth: `${date2.format('MMM YYYY')}`,
        auditDuration: `${diffDays} days`,
        reportedOn: reportedOnDt,
        totalWeight: this.mMaterialList.totalWeight,
        annualizedWasteKG: annualWasteInGm,
        annualizedCO2KG: annualCO2InGm
      }
      return rd
    }
  }