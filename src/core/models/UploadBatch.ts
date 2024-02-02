import { ILocation } from './Location';
import MaterialList from './MaterialList';
import Location from './Location';
import { IAccount } from './Account';
import dayjs, { Dayjs } from "dayjs";
import { IUploadMaterial } from './Material';
import TextUtils from '../utils/TextUtils';

export type IUploadBatch = {
    account: IAccount;
    location: ILocation;
    startDt: string|null;
    endDt: string|null;
    file: any;
    fileId: string|undefined;
    materialList: IUploadMaterial[];
    estimatedTotalWeight?: number;
    allExcelMaterialList: IExcelRow[];
    unknownMaterialList: IExcelRow[];
}

export type IExcelRow = {
    material: string|null|undefined 
    collected_weight: number|null|undefined
}

export default class UploadBatch {

    private mStartDt: Dayjs|null
    public get startDt() {
        return this.mStartDt
    }

    private mEndDt: Dayjs|null
    public get endDt() {
        return this.mEndDt
    }

    private mLocation: Location|null|undefined
    public get location() {
        return this.mLocation
    }

    private mFile: any
    public get file() {
        return this.mFile
    }

    private mUploadMaterialList: IUploadMaterial[]
    public get uploadMaterialList() {
        return this.mUploadMaterialList
    }

    constructor(res: IUploadBatch) {
        this.mStartDt = dayjs(res.startDt)
        this.mEndDt = dayjs(res.endDt)
        if(res.location) {
            this.mLocation = Location.initWithResult(res.location)
        }
        this.mFile = res.file
        this.mUploadMaterialList = res.materialList
    }

    public static unknowMaterialNames(arr: IExcelRow[]) {
        if(arr && arr.length > 0) {
            const nameArr = arr.map((item) => TextUtils.trimString(item.material))
            const commaSepNames = nameArr.join(", ");
            return commaSepNames
        }
        return undefined
    }
}