export default class PlaceAPIUtil {
  public static getPlaceDetails(data: any) {
    let fullAddress = ""
    let city = ""
    let state = ""
    if (
      data.status &&
      data.status === "OK" &&
      data.results &&
      Array.isArray(data.results) &&
      data.results.length > 0
    ) {
      const address = data.results[0]
      if (
        address &&
        address.address_components &&
        Array.isArray(address.address_components) &&
        address.address_components.length > 0
      ) {
        for (let i = 0; i < address.address_components.length; i++) {
            const item = address.address_components[i]
            if(item.types && Array.isArray(item.types) && item.types.includes("administrative_area_level_3")) {
                // city
                city = item.long_name
            } else if(item.types && Array.isArray(item.types) && item.types.includes("locality") && city.length == 0) {
                // city
                city = item.long_name
            } else if(item.types && Array.isArray(item.types) && item.types.includes("administrative_area_level_1")) {
                // state
                state = item.long_name
            }
            if(city.length > 0 && state.length > 0) {
                break;
            }
        }
      }
      if(address && address.formatted_address) {
        // full address
        fullAddress = address.formatted_address
      }
    }
    return {
      city,
      state,
      fullAddress
    }
  }
}
