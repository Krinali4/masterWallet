import TextUtils from './TextUtils';
import compareVersions from "compare-versions";
// import { ReasonItem } from '../model/UnloadWalletOrder';
import CountryCodeList from '../models/CountryCodeList';
import { IUploadMaterial } from '../models/Material';

export default class GeneralUtils {
  private constructor() { }

  public static makeACall(phoneNum: string | undefined) {
    if (!TextUtils.isEmpty(phoneNum)) {
      window.location.href = "tel:" + phoneNum;
    }
  }

  public static isAndroidOS(): boolean {
    let userAgent = navigator.userAgent.toLowerCase();
    return /android/.test(userAgent);
  }

  public static isSafariBrowser(): boolean {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  public static toAmount = (value:any, defValue = 0) => {
    return value ? (value / 100).toFixed(2) : defValue;
  }

  public static toTokens = (value:any, defValue = 0) =>
    value && parseFloat(value) ? Number((parseFloat(value) * 100).toFixed(2)) : defValue;

  public static forceAppUpdateRequired(latestVersion: string, latestBuildVersion: string): boolean {
    var storeAppVersion = latestVersion;
    var currentAppV = process.env.REACT_APP_VERSION
      ? process.env.REACT_APP_VERSION
      : "";
    var storeAppBuildVersion = latestBuildVersion;
    var currentAppBuildV = process.env.REACT_APP_BUILD_VERSION
      ? process.env.REACT_APP_BUILD_VERSION
      : "";

    if (
      !TextUtils.isEmpty(storeAppVersion) &&
      !TextUtils.isEmpty(currentAppV)
    ) {
      // let versionComparator = compareVersions(currentAppV, storeAppVersion);
      // if (versionComparator === -1) {
      //   return true;
      // }
    }

    if (
      !TextUtils.isEmpty(storeAppBuildVersion) &&
      !TextUtils.isEmpty(currentAppBuildV)
    ) {
      // let buildComparator = compareVersions(
      //   currentAppBuildV,
      //   storeAppBuildVersion
      // );
      // if (buildComparator == -1) {
      //   return true;
      // }
    }

    return false;
  }

  public static numberFormatWithLocale(x: string | undefined, withFractionDigits: boolean): string {
    if (x && !TextUtils.isEmpty(x)) {
      const userLocale = "en-US";
      if (withFractionDigits) {
        return new Intl.NumberFormat(userLocale, { minimumFractionDigits: 2 }).format(Number(x))
      }
      return new Intl.NumberFormat(userLocale, {}).format(Number(x))

    }
    if (!x) return "0.00";
    return x;
  }

  public static validEmail: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public static url = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

  public static currencySymbol = "$";

  public static phoneNoFormat(data: string): string {
    if (data && data.length == 10) {
        const front = data.slice(0, 3);
        const back3 = data.slice(3, 6);
        const last4 = data.slice(6, 10);
        return `+1 (${front}) ${back3}-${last4}`
    } else {
        const frontFirst = data.slice(0, 2)
        const front = data.slice(2, 5);
        const back = data.slice(5, 8);
        const last = data.slice(8, 12);
        return `${frontFirst} (${front}) ${back}-${last}`
    }
 }

 public static getAppVersion(): string {
  return `v${process.env.REACT_APP_VERSION} (${process.env.REACT_APP_BUILD_VERSION})`
 }

 public static isValidEmailId(text: string): boolean {
  const regexp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  return regexp.test(text);
  }

  public static getPhoneNumberWithFormat(phoneCode: string, phone: string) {
    if(!TextUtils.isEmpty(phoneCode) && !TextUtils.isEmpty(phone)) {
      return `${phoneCode}-${phone}`
    }
    return ''
  }

  public static parsePhoneNumberWithFormat(phone: string) {
    const countryCodeList: CountryCodeList = new CountryCodeList()
    let finalPhoneCode = `${countryCodeList.dropDownItems[0].id}` //default country code
    let finalPhone = ''
    if(!TextUtils.isEmpty(phone) && phone.includes("-")) {
      const arr = phone.split("-");
      if(arr && arr.length >= 2) {
        finalPhoneCode = arr[0]
        finalPhone = arr[1]
      }
    } else if(!TextUtils.isEmpty(phone)) {
      finalPhone = phone
    }
    return {
      phoneCode: finalPhoneCode,
      phone: finalPhone,
      original: phone
    }
  }

  public static calculatePagesCount(pageSize: number, totalCount: number) {
    // we suppose that if we have 0 items we want 1 empty page
    return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
  };

  public static getEstimatedTotalWeight(materialList: IUploadMaterial[]): number {
    let estimatedTotalWeightInGm = 0
    if(materialList && materialList.length > 0) {
      materialList.forEach((material) => {
        estimatedTotalWeightInGm += material.weight
      })
    }
    return estimatedTotalWeightInGm
  }

  public static getMaterialUniqueTagID(locationId: number): string {
    const timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    const random = ("" + Math.random()).substring(2, 8); 
    const random_number = timestamp+random;
    const tagName = `MATERIAL_${locationId}_${random_number}`
    return tagName;
  }

  public static getBatchUniqueTagID(locationId: number): string {
    const timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    const random = ("" + Math.random()).substring(2, 8); 
    const random_number = timestamp+random;
    const tagName = `BATCH_${locationId}_${random_number}`
    return tagName;
  }
}
