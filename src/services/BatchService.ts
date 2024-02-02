import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TagList from "../core/models/TagList"
import Tag from "../core/models/Tag"
import Batch from "../core/models/Batch"
import BatchMaterial from "../core/models/BatchMaterial"
import BatchMaterialList from "../core/models/BatchMaterialList"
import BatchList from '../core/models/BatchList';

export default class BatchService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Get Batch Details by tag id.
   * @returns {Batch} - tag
   */
  public static async getBatchDetailsByTagID(tagId: number) {
    const response = await WebServiceUtils.post(
      this.getBatchDetailsByTagIDBody(tagId),
      BatchService.config,
      BatchService.apiUrl
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
          const batchList = BatchList.initWithResult(response.data.data.batches, null)
          if (batchList.batches.length === 1) {
            return Promise.resolve(batchList.batches[0])
          } else {
            return Promise.reject(new ApiError(500, Strings.NO_ACCOUNT_FOUND))
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

  private static getBatchDetailsByTagIDBody(tagId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      assignedTagId: {
        eq: [tagId],
      },
    }
    return `{
      "query": "query($filter:BatchFilter,$sort:BatchSorter,$limit: Int!,$offset: Int!){batches(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,createdAt,estimatedTotalWeight,account{id,name},materials{id,weight,createdAt,material{id,name},tag{id,tagCode,tagAllocationType,tagLastAction}}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Batch Material Details by tag id.
   * @returns {BatchMaterial} - tag
   */
  public static async getBatchMaterialDetailsByTagID(tagId: number) {
    const response = await WebServiceUtils.post(
      this.getBatchMaterialDetailsByTagIDBody(tagId),
      BatchService.config,
      BatchService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.importedMaterials &&
          response.data.data.importedMaterials.data &&
          Array.isArray(response.data.data.importedMaterials.data)
        ) {
          const impMaterialList = BatchMaterialList.initWithResult(
            response.data.data.importedMaterials
          )
          return Promise.resolve(impMaterialList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getBatchMaterialDetailsByTagIDBody(tagId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      assignedTagId: {
        eq: [tagId],
      },
    }
    return `{
      "query": "query($filter:ImportMaterialFilter,$sort:ImportMaterialSorter,$limit: Int!,$offset: Int!){importedMaterials(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,weight,createdAt,material{id,name},batch{id,tag{id,tagCode,tagAllocationType,tagLastAction}}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1000
      }
    }`.replace(/\s+/g, " ")
  }
}
