import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TagList from '../core/models/TagList';
import Tag from "../core/models/Tag"
import TagScanHistory from '../core/models/TagScanHistory';
import TagScanHistoryList from '../core/models/TagScanHistoryList';
import { IQueryParams } from "../core/utils/QueryParamUtils";
import { GeoLocation } from "../core/models/GeoLocation";

export default class TagService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Get Tags List.
   * @returns {TagList} - tag list
   */
  public static async getTagList(filter: IQueryParams) {
    const pageSize = TagList.pageSize
    const offset = filter.page * pageSize

    const response = await WebServiceUtils.post(
      this.getTagListBody(offset, pageSize, filter),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tags &&
          response.data.data.tags.data &&
          Array.isArray(response.data.data.tags.data)
        ) {
          const tagList = TagList.initWithResult(
            response.data.data.tags,
            null
          )
          console.log('tagList :'+JSON.stringify(tagList))
          return Promise.resolve(tagList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getTagListBody(offset: number, limit: number, tagfilter: IQueryParams): any {
    const sort = {
      id: "DESC",
    }
    // const filter = {}

    const tagTypes = (tagfilter.tagTypes && tagfilter.tagTypes.length > 0) ? tagfilter.tagTypes : ["BATCH","MATERIAL"]
    console.log('tagTypes :'+tagTypes)
    const filter = {
        tagAllocationType: {
            os:tagTypes
        },
        searchQuery: (tagfilter.searchQuery && tagfilter.searchQuery.length > 0) ? tagfilter.searchQuery : '' 
    }
    console.log('tagTypes filter :'+JSON.stringify(filter))

    return `{
      "query": "query($filter:TagFilter,$sort:TagSorter,$limit: Int!,$offset: Int!){tags(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,tagCode,tagType,tagAllocationType,tagLastAction,totalWeight,lastTrackingItem{scannedAt,scannedLat,scannedLong,locality,city,state,country}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }
  
  /**
   * Get Tag Details.
   * @returns {Tag} - tag
   */
  public static async getTagDetails(tagId: number) {
    const response = await WebServiceUtils.post(
      this.getTagDetailsBody(tagId),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tags &&
          response.data.data.tags.data &&
          Array.isArray(response.data.data.tags.data)
        ) {
          const tagList = TagList.initWithResult(
            response.data.data.tags,
            null
          )
          if (tagList.tags.length === 1) {
            return Promise.resolve(tagList.tags[0])
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

  private static getTagDetailsBody(tagId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      id: {
        eq: [tagId],
      },
      tagAllocationType: {
        os:["BATCH","MATERIAL"]
      }
    }
    return `{
      "query": "query($filter:TagFilter,$sort:TagSorter,$limit: Int!,$offset: Int!){tags(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,tagCode,tagAllocationType,tagLastAction}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }


  /**
   * Get Tag Scan History List.
   * @returns {TagScanHistory} - tag list
   */
  public static async getTagScanHistoryList(page: number,tagId: number) {
    const pageSize = TagScanHistoryList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getTagScanHistoryListBody(offset, pageSize, tagId),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tagTrackingHistory &&
          response.data.data.tagTrackingHistory.data &&
          Array.isArray(response.data.data.tagTrackingHistory.data)
        ) {
          const tsHistoryList = TagScanHistoryList.initWithResult(
            response.data.data.tagTrackingHistory,
            null
          )
          return Promise.resolve(tsHistoryList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getTagScanHistoryListBody(offset: number, limit: number, tagId: number): any {
    const sort = {
        scannedAt: "DESC",
    }
    const filter = {
        tagId: {
            eq:[tagId]
        }
    }
    return `{
      "query": "query($filter:TagTrackingFilter,$sort:TagTrackingSorter,$limit: Int!,$offset: Int!){tagTrackingHistory(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,tagId,tagAction,scannedLat,scannedLong,scannedLocation{id,name},scannedAt,scannedBy{email},locality,city,state,country}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Tag Scan History with Image List.
   * @returns {TagScanHistory} - tag list
   */
  public static async getTagScanHistoryWithImageList(tagId: number) {
    const pageSize = 1000
    const offset = 0

    const response = await WebServiceUtils.post(
      this.getTagScanHistoryWithImageListBody(offset, pageSize, tagId),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tagTrackingHistory &&
          response.data.data.tagTrackingHistory.data &&
          Array.isArray(response.data.data.tagTrackingHistory.data)
        ) {
          const tsHistoryList = TagScanHistoryList.initWithResult(
            response.data.data.tagTrackingHistory,
            null
          )
          return Promise.resolve(tsHistoryList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getTagScanHistoryWithImageListBody(offset: number, limit: number, tagId: number): any {
    const sort = {
        scannedAt: "DESC",
    }
    const filter = {
        tagId: {
            eq:[tagId]
        },
        attachedImageOnly: {
          eq: true
        }
    }
    return `{
      "query": "query($filter:TagTrackingFilter,$sort:TagTrackingSorter,$limit: Int!,$offset: Int!){tagTrackingHistory(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,tagId,tagAction,tagHolderImages,scannedLat,scannedLong,scannedLocation{id,name},scannedAt,scannedBy{email}}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  public static async batchMarkAsSorted(tag: Tag, geoLocation: GeoLocation) {
    const response = await WebServiceUtils.post(
      this.markAsSortedOrProcessedBody(tag,geoLocation,'SORTED'),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tagScanned &&
          response.data.data.tagScanned.id
        ) {
          const tsHistory = TagScanHistory.initWithResult(response.data.data.tagScanned)
          return Promise.resolve(tsHistory)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  public static async materialBinMarkAsProcessed(tag: Tag, geoLocation: GeoLocation) {
    const response = await WebServiceUtils.post(
      this.markAsSortedOrProcessedBody(tag,geoLocation,'RECYCLED'),
      TagService.config,
      TagService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.tagScanned &&
          response.data.data.tagScanned.id
        ) {
          const tsHistory = TagScanHistory.initWithResult(response.data.data.tagScanned)
          return Promise.resolve(tsHistory)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static markAsSortedOrProcessedBody(tag: Tag, geoLocation: GeoLocation, action: string):string {

    const varBody = {
      In: {
        tagId: tag.id,
        tagAction: action,
        scannedLat:geoLocation.lat,
        scannedLong:geoLocation.lng
      }
    }

    return `{
      "query": "mutation($In:TagTrackingCreate!) {tagScanned(in:$In) {id,tagId,tagAction,tagHolderImages,scannedLat,scannedLong,scannedLocation{id,name},scannedAt,scannedBy{email}}}",
      "variables": ${JSON.stringify(varBody)}
    }`.replace(/\s+/g, " ")
  }

}