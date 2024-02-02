import { GeoLocation } from '../models/GeoLocation';
import { ApiError } from '../webservice/ApiError';

export default class GeoLocationUtil {

    private static options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
    }

    public static async getCurrentLocation(){
        return new Promise<GeoLocation>((resolve, reject) => {
            if (navigator.geolocation) {
              if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                  if (result.state === "granted") {
                    console.log(result.state);
                    //If granted then you can directly call your function here
                    navigator.geolocation.getCurrentPosition((pos: any) => {
                      var crd = pos.coords;
                      resolve({lat:crd.latitude, lng:crd.longitude})
                    });
                  } else if (result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition((pos: any) => {
                      var crd = pos.coords;
                      resolve({lat:crd.latitude, lng:crd.longitude})
                    }, (err: any) => {
                      console.log(`ERROR(${err.code}): ${err.message}`);
                      reject(new ApiError(err.code, err.message))
                    }, GeoLocationUtil.options);
                  } else if (result.state === "denied") {
                    //If denied then you have to show instructions to enable location
                    reject(new ApiError(801, "Location services has been disabled on your browser. Please turn it on."))
                  } else {
                    reject(new ApiError(801, "We are not able to fetch your location currently."))
                  }
                });
              } else {
                navigator.geolocation.getCurrentPosition((pos: any) => {
                  var crd = pos.coords;
                  resolve({lat:crd.latitude, lng:crd.longitude})
                }, (err: any) => {
                  console.log(`ERROR(${err.code}): ${err.message}`);
                  reject(new ApiError(err.code, err.message))
                }, GeoLocationUtil.options);
              }            
            } else {
                reject(new ApiError(801, "Location services not available on your browser."))
            }
          });
    }
}