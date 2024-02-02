import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from "../core/webservice/ApiError"
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import SessionManager from "../core/utils/SessionManager"
import ApiEndpoints from "./ApiEndpoints"
import User from '../core/models/User';
import UserManager from '../core/utils/UserManager';
import Material, { IMaterialUpdate } from "../core/models/Material"
import { IMaterial, IMaterialCreate } from '../core/models/Material';
import MaterialList from "../core/models/MaterialList"

export default class MaterialService {
  private static apiUrl = process.env.REACT_APP_API_BASE_URL + "/graphql"
  private static config = { headers: { "Content-Type": "application/json" } }

  /**
   * Create/Update new material.
   * @returns {Material} - account
   */
  public static async createOrUpdateMaterial(material: IMaterial) {
    const {
      id,
      name,
      materialType,
      defaultWeightScale,
    } = material

    let isUpdateOperation = false
    let iMaterialCreateOrUpdate: IMaterialCreate | IMaterialUpdate = undefined
    if (id) {
      isUpdateOperation = true
      iMaterialCreateOrUpdate = {
        id,
        name,
        materialTypeId:materialType.id,
        defaultWeightScale
      }
    } else {
        iMaterialCreateOrUpdate = {
            name,
            materialTypeId:materialType.id,
            defaultWeightScale
          }
    }
    
    const response = await WebServiceUtils.post(
      isUpdateOperation
        ? this.updateMaterialBody(iMaterialCreateOrUpdate as IMaterialUpdate)
        : this.createMaterialBody(iMaterialCreateOrUpdate as IMaterialCreate),
        MaterialService.config,
        MaterialService.apiUrl
    )

    if (response.success) {
      try {
        let isSuccessResult = false
        if (
          response.data &&
          response.data.data &&
          (response.data.data.createMaterial || response.data.data.updateMaterial)
        ) {
          const materialJsonObject = response.data.data.createMaterial
            ? response.data.data.createMaterial
            : response.data.data.updateMaterial
          const resultMaterial: Material =
          Material.initWithResult(materialJsonObject)
          if (resultMaterial) {
            isSuccessResult = true
            return Promise.resolve(resultMaterial)
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

  private static createMaterialBody(iAccountCreate: IMaterialCreate): any {
    return `{
      "query": "mutation($In:MaterialCreate!) {createMaterial(in:$In) {id,name,materialType{id,name,isActivated},defaultWeightScale,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iAccountCreate)}
      }
    }`.replace(/\s+/g, " ")
  }

  private static updateMaterialBody(iAccountUpdate: IMaterialUpdate): any {
    return `{
      "query": "mutation($In:MaterialUpdate!) {updateMaterial(in:$In) {id,name,materialType{id,name,isActivated},defaultWeightScale,isRemoved}}",
      "variables": {
          "In": ${JSON.stringify(iAccountUpdate)}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Material List.
   * @returns {MaterialList} - material list
   */
  public static async getMaterialList(page: number) {
    const pageSize = MaterialList.pageSize
    const offset = page * pageSize

    const response = await WebServiceUtils.post(
      this.getMaterialListBody(offset, pageSize),
      MaterialService.config,
      MaterialService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.materials &&
          response.data.data.materials.data &&
          Array.isArray(response.data.data.materials.data)
        ) {
          const materialList = MaterialList.initWithResult(
            response.data.data.materials,
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

  private static getMaterialListBody(offset: number, limit: number): any {
    const sort = {
      id: "DESC",
    }
    return `{
      "query": "query($filter:MaterialFilter,$sort:MaterialSorter,$limit: Int!,$offset: Int!){materials(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,materialType{id,name,isActivated},defaultWeightScale,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get All Material List.
   * @returns {MaterialList} - all material list
   */
  public static async getAllMaterialList() {
    const pageSize = 1000
    const offset = 0

    const response = await WebServiceUtils.post(
      this.getAllMaterialListBody(offset, pageSize),
      MaterialService.config,
      MaterialService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.materials &&
          response.data.data.materials.data &&
          Array.isArray(response.data.data.materials.data)
        ) {
          const materialList = MaterialList.initWithResult(
            response.data.data.materials,
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

  private static getAllMaterialListBody(offset: number, limit: number): any {
    const sort = {
      id: "DESC",
    }
    return `{
      "query": "query($filter:MaterialFilter,$sort:MaterialSorter,$limit: Int!,$offset: Int!){materials(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,materialType{id,name,isActivated},defaultWeightScale,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": {},
          "offset": ${offset},
          "limit": ${limit}
      }
    }`.replace(/\s+/g, " ")
  }

  /**
   * Get Material Details.
   * @returns {Material} - material
   */
  public static async getMaterialDetails(materialId: number) {
    const response = await WebServiceUtils.post(
      this.getMaterialDetailsBody(materialId),
      MaterialService.config,
      MaterialService.apiUrl
    )

    if (response.success) {
      try {
        if (
          response.data &&
          response.data.data &&
          response.data.data.materials &&
          response.data.data.materials.data &&
          Array.isArray(response.data.data.materials.data)
        ) {
          const materialList = MaterialList.initWithResult(
            response.data.data.materials,
            null
          )
          if (materialList.materials.length === 1) {
            return Promise.resolve(materialList.materials[0])
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

  private static getMaterialDetailsBody(materialId: number): any {
    const sort = {
      id: "DESC",
    }
    const filter = {
      id: {
        eq: [materialId],
      },
    }
    return `{
      "query": "query($filter:MaterialFilter,$sort:MaterialSorter,$limit: Int!,$offset: Int!){materials(filter: $filter,sort:$sort limit: $limit,offset:$offset){total,data{id,name,materialType{id,name,isActivated},defaultWeightScale,isRemoved}}}",
      "variables": {
          "sort": ${JSON.stringify(sort)},
          "filter": ${JSON.stringify(filter)},
          "offset": 0,
          "limit": 1
      }
    }`.replace(/\s+/g, " ")
  }
}