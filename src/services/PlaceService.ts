import WebServiceUtils from "../core/webservice/WebServiceUtils"
import { ApiError } from '../core/webservice/ApiError';
import Strings from "../core/utils/Strings"
import TextUtils from "../core/utils/TextUtils"
import TagScanHistory from "../core/models/TagScanHistory"
import TagScanHistoryList from "../core/models/TagScanHistoryList"
import PlaceAPIUtil from '../core/utils/PlaceAPIUtil';

export default class PlaceService {
  public static async findAddressesOfTagScanHistoryList(
    tagScanHistoryList: TagScanHistoryList
  ) {
    return new Promise<TagScanHistoryList>((resolve,reject) => {
        if(tagScanHistoryList.tagScanHistories.length > 0) {
            const arrOfTagScanHistory = tagScanHistoryList.tagScanHistories
            const promises = arrOfTagScanHistory.map((tg) => {
                return this.findAddressOfTagScanHistory(tg)
            });
            Promise.all(promises)
                .then((result) => {
                    console.log('Promise.all result =>'+JSON.stringify(result))
                    console.log('Promise.all tagScanHistoryList =>'+JSON.stringify(tagScanHistoryList))
                    const newTagScanHistoryList = tagScanHistoryList.updateTagScanHistoryObjectArray(result)
                    resolve(newTagScanHistoryList)
                }).catch((error) => {
                    // there was an error
                    console.log('Promise.all error :'+error.message)
                    resolve(tagScanHistoryList)
                });
        } else {
            resolve(tagScanHistoryList)
        }
    })
  }

  public static async findAddressOfTagScanHistory(
    tagScanHistory: TagScanHistory
  ) {
    const lat = tagScanHistory.scannedLat
    const lng = tagScanHistory.scannedLong
    if(!lat || !lng) {
        tagScanHistory.setGeoLocationName("")
        return Promise.resolve(tagScanHistory)
    }
    const apiUrl = `${process.env.REACT_APP_REPORT_GENERATE_API_BASE_URL}/rewaste/find-address?latlng=${lat},${lng}`
    
    const response = await WebServiceUtils.get({}, apiUrl)

    if (response.success && response.data) {
      try {
        const placeDetails = PlaceAPIUtil.getPlaceDetails(response.data)
        let displayGeoName = ''
        if(placeDetails.city.length > 0 && placeDetails.state.length > 0) {
            displayGeoName = `${placeDetails.city}/${placeDetails.state}`
        } else if(placeDetails.city.length > 0) {
            displayGeoName = `${placeDetails.city}`
        } else if(placeDetails.state.length > 0) {
            displayGeoName = `${placeDetails.state}`
        }
        tagScanHistory.setGeoLocationName(displayGeoName)
        console.log(JSON.stringify(placeDetails))
        return Promise.resolve(tagScanHistory)
      } catch (error) {
        tagScanHistory.setGeoLocationName("")
        return Promise.resolve(tagScanHistory)
      }
    }
    tagScanHistory.setGeoLocationName("")
    return Promise.resolve(tagScanHistory)
  }
}
