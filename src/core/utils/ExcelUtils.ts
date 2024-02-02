import { IExcelRow } from '../models/UploadBatch';
import TextUtils from "./TextUtils";

export default class ExcelUtils {
    public static convertExcelJSONtoModel(data: any): IExcelRow[] {
        let arr: IExcelRow[] = []
        if(data && Array.isArray(data) && data.length > 0) {
            data.forEach(row => {
                if(row.material && !TextUtils.isEmpty(row.material) &&
                    row.collected_weight_inKG && !isNaN(row.collected_weight_inKG)) {
                        const toGramWeight = row.collected_weight_inKG * 1000 // converted to kg by default
                        const excelRowItem: IExcelRow = {
                            material: row.material, 
                            collected_weight: toGramWeight
                        }
                        arr.push(excelRowItem);
                }
            });
        }
        console.log('convertExcelJSONtoModel =>'+JSON.stringify(arr))
        return arr;
    }
}