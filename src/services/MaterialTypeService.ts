

import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from '../core/models/User';
import UserManager from '../core/utils/UserManager';
import MaterialType, { IMaterialType, IMaterialTypeCreate, IMaterialTypeUpdate } from "../core/models/MaterialType"
import MaterialTypeList from '../core/models/MaterialTypeList';

export default class MaterialTypeService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Create/Update new material type.
   * @returns {MaterialType} - material type
   */
  public static async createOrUpdateMaterialType(materialType: IMaterialType) {
    const {
      id,
      name,
      isActivated
    } = materialType

    let isUpdateOperation = false
    let iMTCreateOrUpdate: IMaterialTypeCreate | IMaterialTypeUpdate = undefined
    if (id) {
      isUpdateOperation = true
      iMTCreateOrUpdate = {
        id,
        name,
        isActivated,
      }
    } else {
        iMTCreateOrUpdate = {
            name,
        }
    }
    
    const response = await WebServiceUtils.post(
      isUpdateOperation
        ? this.updateMaterialTypeServiceBody(iMTCreateOrUpdate as IMaterialTypeUpdate)
        : this.createMaterialTypeServiceBody(iMTCreateOrUpdate as IMaterialTypeCreate),
        MaterialTypeService.config,
        MaterialTypeService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          (response.data.data.createMaterialType || response.data.data.updateMaterialType)
        ) {
          const materialTypeJsonObject = response.data.data.createMaterialType
            ? response.data.data.createMaterialType
            : response.data.data.updateMaterialType
          const resultMaterialType: MaterialType =
          MaterialType.initWithMaterialType(materialTypeJsonObject)
          if (resultMaterialType) {
            isSuccessResult = true
            return Promise.resolve(resultMaterialType)
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

  private static createMaterialTypeServiceBody(iMTCreate: IMaterialTypeCreate): any {
    return `{
      "query": "mutation($In:MaterialTypeCreate!) {createMaterialType(in:$In) {id,name,isActivated,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iMTCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  private static updateMaterialTypeServiceBody(iMTUpdate: IMaterialTypeUpdate): any {
    return `{
      "query": "mutation($In:MaterialTypeUpdate!) {updateMaterialType(in:$In) {id,name,isActivated,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iMTUpdate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Material Type List.
   * @returns {MaterialTypeList} - material type list
   */
  public static async getMaterialTypeList(page: number) {
    const pageSize = MaterialTypeList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getMaterialTypeListBody(offset, pageSize),
      MaterialTypeService.config,
      MaterialTypeService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.materialTypes &&
          response.data.data.materialTypes.data &&
          Array.isArray(response.data.data.materialTypes.data)
        ) {
          const materialList = MaterialTypeList.initWithResult(
            response.data.data.materialTypes,
            null
          )
          return Promise.resolve(materialList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getMaterialTypeListBody(offset: number, limit: number): any {
    const sort = {
      id: "DESC",
    }
    return `{
      "query": "query($filter:MaterialTypeFilter,$sort:MaterialTypeSorter,$limit: Int!,$offset: Int!){materialTypes(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,isActivated,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get All Material Type List.
   * @returns {MaterialTypeList} - all material type list
   */
  public static async getAllMaterialTypeList() {
    const pageSize = 1000
    const offset = 0

    const response = await WebServiceUtils.post(
      this.getAllMaterialTypeListBody(offset, pageSize),
      MaterialTypeService.config,
      MaterialTypeService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.materialTypes &&
          response.data.data.materialTypes.data &&
          Array.isArray(response.data.data.materialTypes.data)
        ) {
          const materialList = MaterialTypeList.initWithResult(
            response.data.data.materialTypes,
            null
          )
          return Promise.resolve(materialList)
        } else {
          return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
        }
      } catch (error) {
        return Promise.reject(new ApiError(500, Strings.DEFAULT_ERROR_MSG))
      }
    }
    return WebServiceUtils.handleNetworkError(response)
  }

  private static getAllMaterialTypeListBody(offset: number, limit: number): any {
    const sort = {
        id: "DESC",
      }
      const filter = {
        isActivated: {
          eq:true
        },
      }
      return `{
        "query": "query($filter:MaterialTypeFilter,$sort:MaterialTypeSorter,$limit: Int!,$offset: Int!){materialTypes(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,isActivated,isRemoved}}}",
        "variables": {
            "sort": ${JSON.stringify(sort)},
            "filter": ${JSON.stringify(filter)},
            "offset": ${offset},
            "limit": ${limit}
        }
      }`.replace(/\s+/g, " ")
  }

}