import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from "../core/models/User"
import UserManager from "../core/utils/UserManager"
import { IUploadBatch } from "../core/models/UploadBatch"
import { IBatchCreate, IBatch } from "../core/models/Batch"
import { TagType } from "../core/models/Tag"
import BatchMaterial, {
  IBatchMaterialCreate,
} from "../core/models/BatchMaterial"
import { IUploadMaterial } from "../core/models/Material"
import Batch from "../core/models/Batch"
import DateUtils from "../core/utils/DateUtils"
import GeneralUtils from "../core/utils/GeneralUtils"
import BatchList from "../core/models/BatchList"
import { IQueryParams } from "../core/utils/QueryParamUtils"

export default class UploadDataService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Upload data in batch + material.
   * @returns {string} - file id of uploaded document
   */
  public static async uploadData(data: IUploadBatch) {
    return new Promise((resolve, reject) => {
      const { materialList } = data

      const estimatedTotalWeight =
        GeneralUtils.getEstimatedTotalWeight(materialList)
      data.estimatedTotalWeight = estimatedTotalWeight

      this.createBatch(data)
        .then((batchId: number) => {
          console.log("createdBatch with ID=>" + batchId)
          var requests: any[] = []
          materialList.forEach((material) => {
            requests.push(this.importMaterialToBatch(data, material, batchId))
          })
          Promise.all(requests)
            .then((responses) => {
              responses.forEach((resp) => {
                console.log("importedMaterial ID=>" + resp)
              })
              resolve(true)
            })
            .catch((apiError: ApiError) => {
              reject(apiError)
            })
        })
        .catch((apiError: ApiError) => {
          reject(apiError)
        })
    })
  }

  public static async createBatch(data: IUploadBatch) {
    const { location, account, startDt, endDt, fileId, estimatedTotalWeight } =
      data

    const tagCode = GeneralUtils.getMaterialUniqueTagID(location.id)

    let iBatchCreate: IBatchCreate = {
      assignedTagCode: tagCode,
      assignedTagType: TagType.QRCODE,
      partnerId: account.partner.id,
      accountId: account.id,
      locationId: location.id,
      uploadStartDt: startDt,
      uploadEndDt: endDt,
      batchFileName: fileId,
      estimatedTotalWeight,
    }
    // console.log('IUploadBatch :'+JSON.stringify(data))
    // console.log('iBatchCreate :'+JSON.stringify(iBatchCreate))
    // return WebServiceUtils.throwGenericError()

    // let sampleResponse = "{\"id\":1,\"createdAt\":\"2022-12-31T00:00:00Z\",\"tag\":{\"id\":1,\"tagCode\":\"12\",\"tagLastAction\":\"CREATED\",\"tagActionModifiedAt\":\"2023-01-05T16:37:06.428483Z\"},\"location\":{\"name\":\"IKEA Burlington\"},\"materials\":[{\"id\":1,\"weight\":1000,\"createdAt\":\"2022-12-01T00:30:00Z\",\"material\":{\"id\":1,\"name\":\"Strapping\"}}]}"
    // const resultBatch: Batch = Batch.initWithResult(JSON.parse(sampleResponse))
    // if (resultBatch) {
    //   return Promise.resolve(resultBatch)
    // }
    // return;
    const response = await WebServiceUtils.post(
      this.createBatchBody(iBatchCreate),
      UploadDataService.config,
      UploadDataService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.createBatch &&
          response.data.data.createBatch.id
        ) {
          const batchID = response.data.data.createBatch.id
          if (batchID) {
            isSuccessResult = true
            return Promise.resolve(batchID)
          }
          /*const createBatchJsonObject = response.data.data.createBatch
          const resultBatch: Batch = Batch.initWithResult(createBatchJsonObject)
          if (resultBatch) {
            isSuccessResult = true
            return Promise.resolve(resultBatch)
          }*/
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

  //,createdAt,tag{id,tagCode,tagLastAction,tagActionModifiedAt},account{id,name},location{id,name},materials{id,weight,createdAt,material{id,name}}
  private static createBatchBody(iBatchCreate: IBatchCreate): any {
    return `{
    "query": "mutation($In:BatchCreate!) {createBatch(in:$In){id}}",
    "variables": {
        "In": ${JSON.stringify(iBatchCreate)}
    }
  }`.replace(/\s+/g, " ")
  }

  public static async importMaterialToBatch(
    data: IUploadBatch,
    material: IUploadMaterial,
    batchId: number
  ) {
    const { location, endDt } = data

    const tagCode = GeneralUtils.getMaterialUniqueTagID(location.id)

    let iBatchMaterialCreate: IBatchMaterialCreate = {
      batchId: batchId,
      assignedTagCode: tagCode,
      assignedTagType: TagType.QRCODE,
      materialId: material.id,
      weight: material.weight,
      isRecycled: true,
    }
    // console.log('IUploadBatch :'+JSON.stringify(data))
    // console.log('IBatchMaterialCreate :'+JSON.stringify(iBatchMaterialCreate))
    // return WebServiceUtils.throwGenericError()

    // let sampleResponse = "{\"id\":1,\"weight\":1000,\"createdAt\":\"2022-12-01T00:30:00Z\",\"material\":{\"id\":1,\"name\":\"Strapping\"}}"
    // const resultBatchMaterial: BatchMaterial = BatchMaterial.initWithResult(JSON.parse(sampleResponse))
    // if (resultBatchMaterial) {
    //   return Promise.resolve(resultBatchMaterial)
    // }
    // return;
    const response = await WebServiceUtils.post(
      this.importBatchMaterialBody(iBatchMaterialCreate),
      UploadDataService.config,
      UploadDataService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          response.data.data.importMaterial &&
          response.data.data.importMaterial.id
        ) {
          const batchMaterialID = response.data.data.importMaterial.id
          if (batchMaterialID) {
            isSuccessResult = true
            return Promise.resolve(batchMaterialID)
          }
          // const importMaterialJsonObject = response.data.data.importMaterial
          // const resultBatchMaterial: BatchMaterial =
          //   BatchMaterial.initWithResult(importMaterialJsonObject)
          // if (resultBatchMaterial) {
          //   isSuccessResult = true
          //   return Promise.resolve(resultBatchMaterial)
          // }
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

  //,weight,createdAt,material{id,name}
  private static importBatchMaterialBody(
    iBatchMaterialCreate: IBatchMaterialCreate
  ): any {
    return `{
    "query": "mutation($In:ImportMaterialCreate!) {importMaterial(in:$In){id}}",
    "variables": {
        "In": ${JSON.stringify(iBatchMaterialCreate)}
    }
  }`.replace(/\s+/g, " ")
  }

  /**
   * Get List of Batch.
   * @returns {BatchList} - batch list
   */
  public static async getBatchList(filter: IQueryParams) {
    const pageSize = BatchList.pageSize
    const offset = filter.page * pageSize

    const response = await WebServiceUtils.post(
      this.getBatchListBody(offset, pageSize, filter),
      UploadDataService.config,
      UploadDataService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.batches &&
          response.data.data.batches.data &&
          Array.isArray(response.data.data.batches.data)
        ) {
          const batchList = BatchList.initWithResult(
            response.data.data.batches,
            null
          )
          return Promise.resolve(batchList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getBatchListBody(offset: number, limit: number, uploadDataFilter: IQueryParams): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      bulkUpload: {
        eq: true,
      },
      partnerId: {
        eq:uploadDataFilter.clientIds
      },
      accountId: {
        eq:uploadDataFilter.accountIds
      },
      locationId: {
        eq:uploadDataFilter.locationIds
      }
    }
    return `{
      "query": "query($filter:BatchFilter,$sort:BatchSorter,$limit: Int!,$offset: Int!){batches(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,createdAt,account{id,name},location{id,name},batchFileName,batchFilePath,uploadedBy{email}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Upload file.
   * @returns {string} - file id of uploaded document
   */
  public static async uploadReportDataFile(file: any) {
    var fileName = file.name
    var allowedExtensions = /(\.xlsx|\.xls|\.XLSX|\.XLS|\.csv|\.CSV)$/
    if (fileName != "" && !allowedExtensions.exec(fileName)) {
      return Promise.reject(
        new ApiError(400, Strings.INVALID_UPLOAD_DATA_FILE_ERROR)
      )
    }

    await WebServiceUtils.validatePartnerAuthToken()
    const apiUrl =
      process.env.REACT_APP_API_BASE_URL + "/" + ApiEndpoints.UPLOAD_FILES
    const response = await WebServiceUtils.multipartPost(file, apiUrl)

    if (
      response.success &&
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      try {
        const fileObj = response.data[0]
        const fileId = fileObj.file
        return Promise.resolve(fileId)
      } catch (error) {}
    }
    return WebServiceUtils.handleNetworkError(response)
  }
}
